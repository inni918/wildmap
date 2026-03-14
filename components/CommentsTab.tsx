'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'
import { usePermission } from '@/components/PermissionGate'
import { incrementStat, updateStreak } from '@/lib/stats-service'

const REPORT_REASONS = [
  { value: 'spam', label: '垃圾訊息' },
  { value: 'misinformation', label: '不實資訊' },
  { value: 'inappropriate', label: '不當內容' },
  { value: 'harassment', label: '騷擾' },
  { value: 'other', label: '其他' },
] as const

interface Comment {
  id: string
  spot_id: string
  user_id: string
  content: string
  created_at: string
  parent_id: string | null
  display_name?: string
  replies?: Comment[]
}

interface Props {
  spotId: string
  claimedBy?: string
}

export default function CommentsTab({ spotId, claimedBy }: Props) {
  const { user } = useAuth()
  const { earnReview, earnAction } = useAchievements()
  const writeReviewPerm = usePermission('write_review')
  const replyPerm = usePermission('reply_comment')
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // 舉報相關 state
  const [reportingComment, setReportingComment] = useState<Comment | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())
  const [reportToast, setReportToast] = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    // Fetch all comments (top-level + replies)
    const { data: commentsData, error } = await supabase
      .from('comments')
      .select('id, spot_id, user_id, content, created_at, parent_id')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: true })

    if (error || !commentsData) {
      setLoading(false)
      return
    }

    // Get unique user IDs
    const userIds = [...new Set(commentsData.map(c => c.user_id))]

    // Fetch display names
    const userMap = new Map<string, string>()
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, display_name')
        .in('id', userIds)

      if (users) {
        for (const u of users) {
          userMap.set(u.id, u.display_name || '匿名用戶')
        }
      }
    }

    // Enrich with display names
    const enriched: Comment[] = commentsData.map(c => ({
      ...c,
      parent_id: c.parent_id ?? null,
      display_name: userMap.get(c.user_id) || '匿名用戶',
    }))

    // Organize: top-level comments (parent_id IS NULL) with nested replies
    const topLevel: Comment[] = []
    const replyMap = new Map<string, Comment[]>()

    for (const c of enriched) {
      if (!c.parent_id) {
        topLevel.push({ ...c, replies: [] })
      } else {
        if (!replyMap.has(c.parent_id)) replyMap.set(c.parent_id, [])
        replyMap.get(c.parent_id)!.push(c)
      }
    }

    // Attach replies to their parents
    for (const comment of topLevel) {
      comment.replies = replyMap.get(comment.id) || []
    }

    // Sort top-level by newest first
    topLevel.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setComments(topLevel)
    setLoading(false)
  }, [spotId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 載入已舉報過的留言 ID
  useEffect(() => {
    if (!user) return
    const fetchReported = async () => {
      const { data } = await supabase
        .from('reports')
        .select('target_id')
        .eq('reporter_id', user.id)
        .eq('target_type', 'comment')
      if (data) {
        setReportedIds(new Set(data.map(r => r.target_id)))
      }
    }
    fetchReported()
  }, [user])

  // 舉報留言
  const handleReport = async () => {
    if (!user || !reportingComment || !reportReason || reportSubmitting) return
    setReportSubmitting(true)

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          target_type: 'comment',
          target_id: reportingComment.id,
          reason: reportReason,
          description: reportDescription.trim() || null,
          reporter_id: user.id,
          status: 'pending',
        })

      if (!error) {
        setReportedIds(prev => new Set(prev).add(reportingComment.id))
        setReportingComment(null)
        setReportReason('')
        setReportDescription('')
        setReportToast(true)
        setTimeout(() => setReportToast(false), 3000)
      }
    } finally {
      setReportSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    if (!user || !newComment.trim() || submitting) return
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          spot_id: spotId,
          user_id: user.id,
          content: newComment.trim(),
          parent_id: null,
        })

      if (!error) {
        const commentText = newComment.trim()
        setNewComment('')
        await fetchComments()
        earnReview(spotId, commentText)
        // 成就系統 v2：累加留言計數器
        if (user) {
          incrementStat(user.id, 'comments_total')
          if (commentText.length >= 100) incrementStat(user.id, 'detailed_comments')
          updateStreak(user.id)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentId: string) => {
    if (!user || !replyContent.trim() || submitting) return
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          spot_id: spotId,
          user_id: user.id,
          content: replyContent.trim(),
          parent_id: parentId,
        })

      if (!error) {
        setReplyContent('')
        setReplyingTo(null)
        await fetchComments()
        earnAction('reply_discussion', spotId)
        // 成就系統 v2：累加回覆計數器
        if (user) {
          incrementStat(user.id, 'replies_total')
          updateStreak(user.id)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!user || deletingId) return
    setDeletingId(commentId)

    try {
      await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

      await fetchComments()
    } finally {
      setDeletingId(null)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return '剛剛'
    if (diffMin < 60) return `${diffMin} 分鐘前`
    if (diffHours < 24) return `${diffHours} 小時前`
    if (diffDays < 30) return `${diffDays} 天前`
    return date.toLocaleDateString('zh-TW')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
        <span className="text-sm text-text-secondary">載入評論...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* New comment input */}
      {user ? (
        writeReviewPerm.allowed ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              placeholder="分享你的體驗..."
              className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              maxLength={500}
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="px-3 py-2 bg-primary text-text-on-primary rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1"
            >
              <FontAwesomeIcon icon={NAV_ICONS.send} className="text-xs" />
            </button>
          </div>
        ) : (
          <div className="text-center py-3 bg-surface-alt rounded-xl border border-border">
            <p className="text-sm text-text-secondary">
              🔒 需要 Lv.{writeReviewPerm.requiredLevel} 才能留言
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-3 bg-surface-alt rounded-xl border border-border">
          <p className="text-sm text-text-secondary">
            <FontAwesomeIcon icon={NAV_ICONS.lock} className="mr-1" />
            登入後即可留言
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <FontAwesomeIcon icon={NAV_ICONS.commentDots} className="text-3xl text-border mb-2" />
          <p className="text-sm text-text-secondary">還沒有評論</p>
          <p className="text-xs text-text-secondary/60 mt-1">成為第一個分享體驗的人！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id}>
              {/* Top-level comment */}
              <div className={`rounded-xl px-4 py-3 border ${
                claimedBy && comment.user_id === claimedBy
                  ? 'bg-blue-50/50 border-blue-200/50'
                  : 'bg-surface-alt border-border/50'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-xs font-bold">
                      {(comment.display_name || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text-main">
                      {comment.display_name}
                    </span>
                    {claimedBy && comment.user_id === claimedBy && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>
                        🏪 商家
                      </span>
                    )}
                    <span className="text-xs text-text-secondary/60">
                      {formatTime(comment.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {user && (
                      <button
                        onClick={() => {
                          if (replyingTo === comment.id) {
                            setReplyingTo(null)
                            setReplyContent('')
                          } else {
                            setReplyingTo(comment.id)
                            setReplyContent('')
                          }
                        }}
                        className="text-text-secondary/60 hover:text-primary text-xs cursor-pointer transition-colors p-1 flex items-center gap-1"
                        title="回覆"
                      >
                        <FontAwesomeIcon icon={NAV_ICONS.reply} />
                        <span>回覆</span>
                      </button>
                    )}
                    {user && user.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="text-text-secondary/40 hover:text-error text-xs cursor-pointer transition-colors p-1"
                        title="刪除留言"
                      >
                        <FontAwesomeIcon icon={NAV_ICONS.trash} />
                      </button>
                    )}
                    {user && user.id !== comment.user_id && (
                      <button
                        onClick={() => {
                          setReportingComment(comment)
                          setReportReason('')
                          setReportDescription('')
                        }}
                        disabled={reportedIds.has(comment.id)}
                        className={`text-xs cursor-pointer transition-colors p-1 ${
                          reportedIds.has(comment.id)
                            ? 'text-text-secondary/30 cursor-not-allowed'
                            : 'text-text-secondary/40 hover:text-orange-500'
                        }`}
                        title={reportedIds.has(comment.id) ? '已舉報' : '舉報留言'}
                      >
                        <FontAwesomeIcon icon={NAV_ICONS.flag} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-main leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {comment.replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`rounded-lg px-3 py-2 border ${
                        claimedBy && reply.user_id === claimedBy
                          ? 'bg-blue-50/40 border-blue-200/30'
                          : 'bg-surface-alt/60 border-border/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/70 flex items-center justify-center text-text-on-primary text-[10px] font-bold">
                            {(reply.display_name || '?')[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-text-main">
                            {reply.display_name}
                          </span>
                          {claimedBy && reply.user_id === claimedBy && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1 py-0.5 rounded-full"
                              style={{ backgroundColor: '#3B82F620', color: '#3B82F6' }}>
                              🏪 商家
                            </span>
                          )}
                          <span className="text-[10px] text-text-secondary/60">
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {user && user.id === reply.user_id && (
                            <button
                              onClick={() => handleDelete(reply.id)}
                              disabled={deletingId === reply.id}
                              className="text-text-secondary/40 hover:text-error text-[10px] cursor-pointer transition-colors p-1"
                              title="刪除留言"
                            >
                              <FontAwesomeIcon icon={NAV_ICONS.trash} />
                            </button>
                          )}
                          {user && user.id !== reply.user_id && (
                            <button
                              onClick={() => {
                                setReportingComment(reply)
                                setReportReason('')
                                setReportDescription('')
                              }}
                              disabled={reportedIds.has(reply.id)}
                              className={`text-[10px] cursor-pointer transition-colors p-1 ${
                                reportedIds.has(reply.id)
                                  ? 'text-text-secondary/30 cursor-not-allowed'
                                  : 'text-text-secondary/40 hover:text-orange-500'
                              }`}
                              title={reportedIds.has(reply.id) ? '已舉報' : '舉報留言'}
                            >
                              <FontAwesomeIcon icon={NAV_ICONS.flag} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-text-main leading-relaxed pl-7">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && user && (
                <div className="ml-8 mt-1 flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(comment.id) }}
                    placeholder="寫下你的回覆..."
                    className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    maxLength={500}
                    autoFocus
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={!replyContent.trim() || submitting}
                    className="px-2 py-1.5 bg-primary text-text-on-primary rounded-lg text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FontAwesomeIcon icon={NAV_ICONS.send} className="text-[10px]" />
                  </button>
                  <button
                    onClick={() => { setReplyingTo(null); setReplyContent('') }}
                    className="px-2 py-1.5 text-text-secondary hover:text-text-main rounded-lg text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={NAV_ICONS.close} className="text-[10px]" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 舉報成功 Toast */}
      {reportToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-gray-800/90 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in whitespace-nowrap">
          🚩 已舉報，我們會盡快處理
        </div>
      )}

      {/* 舉報 Modal */}
      {reportingComment && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={() => setReportingComment(null)}>
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm p-5 m-0 sm:m-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-main">🚩 舉報留言</h3>
              <button
                onClick={() => setReportingComment(null)}
                className="text-text-secondary hover:text-text-main p-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={NAV_ICONS.close} />
              </button>
            </div>

            {/* 被舉報的留言預覽 */}
            <div className="bg-surface-alt rounded-lg px-3 py-2 mb-4 text-xs text-text-secondary">
              <span className="font-medium text-text-main">{reportingComment.display_name}</span>
              <p className="mt-1 line-clamp-2">{reportingComment.content}</p>
            </div>

            {/* 舉報原因 */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-medium text-text-main">舉報原因</label>
              {REPORT_REASONS.map(reason => (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                    reportReason === reason.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-surface-alt'
                  }`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason.value}
                    checked={reportReason === reason.value}
                    onChange={e => setReportReason(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>

            {/* 補充說明 */}
            <textarea
              placeholder="補充說明（選填）..."
              value={reportDescription}
              onChange={e => setReportDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm mb-4 h-16 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              maxLength={500}
            />

            {/* 送出 */}
            <div className="flex gap-2">
              <button
                onClick={() => setReportingComment(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-alt cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {reportSubmitting ? '送出中...' : '送出舉報'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
