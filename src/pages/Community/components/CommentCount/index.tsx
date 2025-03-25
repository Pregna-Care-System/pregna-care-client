import type React from 'react'
import { useEffect, useState } from 'react'
import { getAllCommentByBlogId } from '@/services/blogService'
import styled from 'styled-components'

interface CommentCountProps {
  postId: string
  className?: string
}

const CountContainer = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
`

/**
 * A component that fetches and displays the comment count for a post
 */
const CommentCount: React.FC<CommentCountProps> = ({ postId, className }) => {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!postId) return

      try {
        setLoading(true)
        const response = await getAllCommentByBlogId(postId)

        if (response && response.success && response.response) {
          // Count total comments including replies
          let totalCount = 0
          const comments = response.response

          if (Array.isArray(comments)) {
            totalCount = comments.length

            // Add reply counts
            comments.forEach((comment) => {
              if (comment.replies && Array.isArray(comment.replies)) {
                totalCount += comment.replies.length
              }
            })

            setCount(totalCount)
          }
        }
      } catch (error) {
        console.error('Failed to fetch comment count:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommentCount()
  }, [postId])

  if (loading || count === null) {
    return null
  }

  return <CountContainer className={className}>{count > 0 ? `(${count})` : ''}</CountContainer>
}

export default CommentCount
