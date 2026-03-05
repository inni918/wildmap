'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useAchievements } from '@/lib/achievement-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

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
  const { triggerCheck } = useAchievements()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

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
        setNewComment('')
        await fetchComments()
        triggerCheck()
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
        triggerCheck()
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
    </div>
  )
}
