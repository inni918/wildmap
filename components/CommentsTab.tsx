'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS } from '@/lib/icons'

interface Comment {
  id: string
  spot_id: string
  user_id: string
  content: string
  created_at: string
  display_name?: string
}

interface Props {
  spotId: string
}

export default function CommentsTab({ spotId }: Props) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setLoading(true)
    // Fetch comments
    const { data: commentsData, error } = await supabase
      .from('comments')
      .select('id, spot_id, user_id, content, created_at')
      .eq('spot_id', spotId)
      .order('created_at', { ascending: false })

    if (error || !commentsData) {
      setLoading(false)
      return
    }

    // Get unique user IDs
    const userIds = [...new Set(commentsData.map(c => c.user_id))]

    // Fetch display names
    let userMap = new Map<string, string>()
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

    const enriched: Comment[] = commentsData.map(c => ({
      ...c,
      display_name: userMap.get(c.user_id) || '匿名用戶',
    }))

    setComments(enriched)
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
        })

      if (!error) {
        setNewComment('')
        await fetchComments()
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
            <div
              key={comment.id}
              className="bg-surface-alt rounded-xl px-4 py-3 border border-border/50"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-text-on-primary text-xs font-bold">
                    {(comment.display_name || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text-main">
                    {comment.display_name}
                  </span>
                  <span className="text-xs text-text-secondary/60">
                    {formatTime(comment.created_at)}
                  </span>
                </div>
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
              <p className="text-sm text-text-main leading-relaxed pl-8">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
