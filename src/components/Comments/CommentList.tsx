import React, { useState } from 'react'
import CommentItem from './CommentItem'

interface CommentListProps {
  comments: any[]
  currentUserId: string
  onEditComment: (commentId: string, newText: string) => Promise<boolean>
  onDeleteComment: (commentId: string) => Promise<boolean>
  onReplyComment: (parentId: string, replyText: string) => Promise<boolean>
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  onEditComment,
  onDeleteComment,
  onReplyComment
}) => {
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({})

  const showReplies = (commentId: string) => {
    setShowAllReplies({ ...showAllReplies, [commentId]: true })
  }

  const hideReplies = (commentId: string) => {
    setShowAllReplies({ ...showAllReplies, [commentId]: false })
  }

  if (!comments || comments.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-500'>No comments yet</p>
        <p className='text-sm text-gray-400'>Be the first to comment</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onReply={onReplyComment}
          />

          {/* Comment replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className='mt-2'>
              {!showAllReplies[comment.id] ? (
                <button onClick={() => showReplies(comment.id)} className='text-sm text-blue-500 hover:underline ml-11'>
                  View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              ) : (
                <div className='mt-3 space-y-3'>
                  {comment.replies.map((reply: any) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      currentUserId={currentUserId}
                      isReply={true}
                      onEdit={onEditComment}
                      onDelete={onDeleteComment}
                      onReply={onReplyComment}
                    />
                  ))}

                  <button
                    onClick={() => hideReplies(comment.id)}
                    className='text-sm text-gray-500 hover:underline ml-11'
                  >
                    Hide replies
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CommentList
