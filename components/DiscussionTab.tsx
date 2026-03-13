'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { NAV_ICONS } from '@/lib/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  likes_count: number
  display_name?: string
  avatar_url?: string
  replies?: Comment[]
  user_liked?: boolean
}

interface Props {
  spotId: string
}

export default function DiscussionTab({ spotId }: Props) {
  const { user } = useAuth()
  const { earnReview, earnAction } = useAchievements()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loginHint, setLoginHint] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 舉報相關 state
  const [reportingComment, setReportingComment] = useState<Comment | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())
  const [reportToast, setReportToast] = useState(false)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    try {
      // 撈留言
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('id, spot_id, user_id, content, created_at, parent_id, likes_count')
        .eq('spot_id', spotId)
        .order('created_at', { ascending: true })

      if (error || !commentsData) {
        setLoading(false)
        return
      }

      // 撈用戶資料
      const userIds = [...new Set(commentsData.map(c => c.user_id))]
      const userMap = new Map<string, { display_name: string; avatar_url: string | null }>()
      if (userIds.length > 0) {
        const { data: users } = await supabase
          .from('users')
          .select('id, display_name, avatar_url')
          .in('id', userIds)
        if (users) {
          for (const u of users) {
            userMap.set(u.id, { display_name: u.display_name || '匿名用戶', avatar_url: u.avatar_url })
          }
        }
      }

      // 撈當前用戶的按讚紀錄
      const likedCommentIds = new Set<string>()
      if (user && commentsData.length > 0) {
        const commentIds = commentsData.map(c => c.id)
        const { data: likes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds)
        if (likes) {
          for (const l of likes) likedCommentIds.add(l.comment_id)
        }
      }

      // 組裝資料
      const enriched: Comment[] = commentsData.map(c => ({
        ...c,
        parent_id: c.parent_id ?? null,
        likes_count: c.likes_count ?? 0,
        display_name: userMap.get(c.user_id)?.display_name || '匿名用戶',
        avatar_url: userMap.get(c.user_id)?.avatar_url ?? undefined,
        user_liked: likedCommentIds.has(c.id),
      }))

      // 整理樹狀：頂層留言 + 回覆
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

      for (const comment of topLevel) {
        comment.replies = replyMap.get(comment.id) || []
      }

      // 按讚數由高到低排序，同讚數按時間排序（新→舊）
      topLevel.sort((a, b) => {
        if (b.likes_count !== a.likes_count) return b.likes_count - a.likes_count
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setComments(topLevel)
    } finally {
      setLoading(false)
    }
  }, [spotId, user])

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
        const text = newComment.trim()
        setNewComment('')
        await fetchComments()
        earnReview(spotId, text)
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

  const handleToggleLike = async (commentId: string, currentlyLiked: boolean) => {
    if (!user) {
      setLoginHint(true)
      setTimeout(() => setLoginHint(false), 2500)
      return
    }

    // Optimistic update
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes_count: currentlyLiked ? Math.max(0, c.likes_count - 1) : c.likes_count + 1,
            user_liked: !currentlyLiked,
          }
        }
        // 也處理回覆
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r =>
              r.id === commentId
                ? {
                    ...r,
                    likes_count: currentlyLiked ? Math.max(0, r.likes_count - 1) : r.likes_count + 1,
                    user_liked: !currentlyLiked,
                  }
                : r
            ),
          }
        }
        return c
      })
    )

    try {
      if (currentlyLiked) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id })
      }
    } catch {
      // Revert optimistic update on error
      await fetchComments()
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

  const Avatar = ({ name, avatarUrl, size = 'md' }: { name: string; avatarUrl?: string | null; size?: 'sm' | 'md' }) => {
    const sizeClass = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs'
    const initial = (name || '?')[0].toUpperCase()
    return (
      <div className={`${sizeClass} rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary flex-shrink-0 overflow-hidden`}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </div>
    )
  }

  const LikeButton = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <button
      onClick={() => handleToggleLike(comment.id, !!comment.user_liked)}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all cursor-pointer active:scale-90 ${
        comment.user_liked
          ? 'text-rose-500 bg-rose-50'
          : 'text-text-secondary/60 hover:text-rose-400 hover:bg-rose-50/50'
      }`}
    >
      <span className={`text-sm ${comment.user_liked ? 'scale-110' : ''} transition-transform`}>
        {comment.user_liked ? '❤️' : '🤍'}
      </span>
      {comment.likes_count > 0 && (
        <span className={`${isReply ? 'text-[10px]' : 'text-xs'} font-medium`}>
          {comment.likes_count}
        </span>
      )}
    </button>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FontAwesomeIcon icon={NAV_ICONS.spinner} className="text-primary animate-spin mr-2" />
        <span className="text-sm text-text-secondary">載入討論中...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100% - 32px)' }}>
      {/* 登入提示 toast */}
      {loginHint && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-gray-800/90 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fade-in whitespace-nowrap">
          請先登入才能按讚
        </div>
      )}

      {/* 留言列表 */}
      <div className="flex-1 space-y-3 pb-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">💬</span>
            <p className="text-sm text-text-secondary font-medium">還沒有討論</p>
            <p className="text-xs text-text-secondary/60">成為第一個留言的人！</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id}>
              {/* 頂層留言 */}
              <div className="rounded-2xl bg-surface-alt border border-border/40 px-4 py-3">
                <div className="flex gap-3">
                  <Avatar name={comment.display_name || '?'} avatarUrl={comment.avatar_url} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-text-main truncate">
                        {comment.display_name}
                      </span>
                      <span className="text-[11px] text-text-secondary/50 flex-shrink-0">
                        {formatTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-text-main leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                    {/* 操作列 */}
                    <div className="flex items-center gap-1 mt-2">
                      <LikeButton comment={comment} />
                      {user && (
                        <button
                          onClick={() => {
                            if (replyingTo === comment.id) {
                              setReplyingTo(null)
                              setReplyContent('')
                            } else {
                              setReplyingTo(comment.id)
                              setReplyContent('')
                              setTimeout(() => inputRef.current?.focus(), 100)
                            }
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-text-secondary/60 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <FontAwesomeIcon icon={NAV_ICONS.reply} className="text-[10px]" />
                          <span>回覆</span>
                        </button>
                      )}
                      {user && user.id === comment.user_id && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-[11px] text-text-secondary/40 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-30"
                        >
                          <FontAwesomeIcon icon={NAV_ICONS.trash} className="text-[10px]" />
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
                          className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-[11px] transition-all cursor-pointer ${
                            reportedIds.has(comment.id)
                              ? 'text-text-secondary/30 cursor-not-allowed'
                              : 'text-text-secondary/40 hover:text-orange-400 hover:bg-orange-50'
                          }`}
                          title={reportedIds.has(comment.id) ? '已舉報' : '舉報留言'}
                        >
                          <FontAwesomeIcon icon={NAV_ICONS.flag} className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 回覆列表 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-1.5 space-y-1.5 border-l-2 pl-3" style={{ borderColor: '#2D6A4F20' }}>
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="rounded-xl bg-surface-alt/50 border border-border/30 px-3 py-2.5">
                      <div className="flex gap-2">
                        <Avatar name={reply.display_name || '?'} avatarUrl={reply.avatar_url} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-text-main truncate">
                              {reply.display_name}
                            </span>
                            <span className="text-[10px] text-text-secondary/50 flex-shrink-0">
                              {formatTime(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-text-main leading-relaxed whitespace-pre-wrap break-words">
                            {reply.content}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <LikeButton comment={reply} isReply />
                            {user && user.id === reply.user_id && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                disabled={deletingId === reply.id}
                                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-[10px] text-text-secondary/40 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-30"
                              >
                                <FontAwesomeIcon icon={NAV_ICONS.trash} className="text-[10px]" />
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
                                className={`ml-auto flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all cursor-pointer ${
                                  reportedIds.has(reply.id)
                                    ? 'text-text-secondary/30 cursor-not-allowed'
                                    : 'text-text-secondary/40 hover:text-orange-400 hover:bg-orange-50'
                                }`}
                                title={reportedIds.has(reply.id) ? '已舉報' : '舉報留言'}
                              >
                                <FontAwesomeIcon icon={NAV_ICONS.flag} className="text-[10px]" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 回覆輸入框 */}
              {replyingTo === comment.id && user && (
                <div className="ml-6 mt-1.5 pl-3 border-l-2" style={{ borderColor: '#2D6A4F40' }}>
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={inputRef}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleReplySubmit(comment.id)
                        }
                      }}
                      placeholder="寫下你的回覆..."
                      rows={2}
                      className="flex-1 px-3 py-2 text-xs border border-border rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                      maxLength={500}
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyContent.trim() || submitting}
                        className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={NAV_ICONS.send} className="text-[10px]" />
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyContent('') }}
                        className="px-3 py-2 text-text-secondary hover:text-text-main rounded-xl text-xs cursor-pointer bg-surface-alt hover:bg-border/30 transition-colors"
                      >
                        <FontAwesomeIcon icon={NAV_ICONS.close} className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 留言輸入框（底部） */}
      <div className="sticky bottom-0 bg-surface border-t border-border pt-3 pb-2">
        {user ? (
          <div className="flex gap-2 items-end">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="參與討論，分享你的想法..."
              rows={2}
              className="flex-1 px-4 py-3 text-sm border border-border rounded-2xl bg-surface-alt focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none transition-all"
              maxLength={1000}
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="px-4 py-3 rounded-2xl text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md flex-shrink-0"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              {submitting ? (
                <FontAwesomeIcon icon={NAV_ICONS.spinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={NAV_ICONS.send} />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3 rounded-2xl bg-surface-alt border border-border">
            <p className="text-sm text-text-secondary">
              <FontAwesomeIcon icon={NAV_ICONS.lock} className="mr-2 text-xs" />
              登入後可留言
            </p>
          </div>
        )}
      </div>

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
