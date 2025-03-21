import React, { useRef, useState } from 'react'
import { Modal } from 'antd'
import { MdClose } from 'react-icons/md'
import { FaRegComment, FaRegHeart, FaShare } from 'react-icons/fa'
import CommentList from './CommentList'
import CommentInput from './CommentInput'
import PostContent from '../PostContent'
import TagsList from '../TagsList/index'
import ReactionButton from '../Reactions/ReactionButton'

interface CommentModalProps {
  visible: boolean
  onCancel: () => void
  post: any
  comments: any[]
  currentUser: any
  postReactions: any[]
  selectedReaction: string
  onReactionChange: (newReactions: any[], newSelectedReaction: string) => void
  onCommentSubmit: (commentText: string) => void
  onEditComment: (commentId: string, newText: string) => Promise<boolean>
  onDeleteComment: (commentId: string) => Promise<boolean>
  onReplyComment: (parentId: string, replyText: string) => Promise<boolean>
  loading: boolean
  submitting: boolean
  onShowReactions?: () => void // Add this new prop
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onCancel,
  post,
  comments,
  currentUser,
  postReactions,
  selectedReaction,
  onReactionChange,
  onCommentSubmit,
  onEditComment,
  onDeleteComment,
  onReplyComment,
  loading,
  submitting,
  onShowReactions // Add this to the destructured props
}) => {
  const [showReactions, setShowReactions] = useState(false)
  const reactionRef = useRef<HTMLDivElement>(null)

  // Format tags array
  const displayTags = post?.tags || post?.blogTags?.map((bt: any) => bt.tag) || []

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      closable={false}
      bodyStyle={{ padding: 0 }}
      className='instagram-modal'
    >
      <div className='flex flex-col h-[80vh]'>
        {/* Header */}
        <div className='p-3 border-b flex items-center justify-between'>
          <div className='flex items-center'>
            <img
              src={post?.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt='User'
              className='w-8 h-8 rounded-full mr-2 object-cover'
            />
            <div>
              <p className='font-semibold text-sm'>{post?.fullName}</p>
              {post?.location && <p className='text-xs text-gray-500'>{post.location}</p>}
            </div>
          </div>
          <button onClick={onCancel} className='text-gray-500'>
            <MdClose size={24} />
          </button>
        </div>

        {/* Post tags */}
        {displayTags.length > 0 && (
          <div className='p-3 border-b'>
            <div className='text-xs text-gray-500 mb-2'>Topics:</div>
            <TagsList tags={displayTags} maxVisible={5} size='small' />
          </div>
        )}

        {/* Post content with image */}
        <div className='p-3 border-b'>
          <div className='flex items-start space-x-3'>
            <img
              src={post?.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt={post?.fullName}
              className='w-8 h-8 rounded-full object-cover'
            />
            <div className='flex-1'>
              <div>
                <span className='font-semibold text-sm mr-2'>{post?.fullName}</span>
                <span className='text-sm'>
                  <PostContent content={post?.content || post?.shortDescription || ''} />
                </span>
              </div>
              <div className='text-xs text-gray-500 mt-1'>{post?.timeAgo}</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='p-3 border-b'>
          <div className='flex flex-col'>
            {/* Reactions count */}
            {postReactions.length > 0 && (
              <button
                onClick={onShowReactions} // Use the prop here instead of direct function call
                className='flex items-center space-x-2 text-gray-500 hover:text-pink-600 transition-colors mb-2 self-start'
              >
                <div className='flex -space-x-1'>
                  {/* Simplified for this example */}
                  <span className='w-5 h-5 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm'>
                    <FaRegHeart className='text-red-500' />
                  </span>
                </div>
                <span className='text-sm'>
                  {postReactions.length} {postReactions.length === 1 ? 'reaction' : 'reactions'}
                </span>
              </button>
            )}

            <div className='flex justify-between mb-2'>
              <div className='flex space-x-4 relative'>
                {/* Reaction button */}
                <ReactionButton
                  postId={post?.id}
                  userId={currentUser?.id}
                  selectedReaction={selectedReaction}
                  postReactions={postReactions}
                  onReactionChange={onReactionChange}
                  placement='modal'
                />

                <button className='text-2xl'>
                  <FaRegComment />
                </button>
                <button className='text-2xl'>
                  <FaShare />
                </button>
              </div>
            </div>

            {post?.likes && post?.likes > 0 && <p className='font-semibold text-sm'>{post.likes} likes</p>}
            <p className='text-xs text-gray-500'>{post?.timeAgo}</p>
          </div>
        </div>

        {/* Comments section */}
        <div className='flex-1 overflow-y-auto p-3 border-b'>
          {loading ? (
            <div className='flex justify-center items-center h-32'>
              <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500'></div>
            </div>
          ) : (
            <CommentList
              comments={comments}
              currentUserId={currentUser?.id}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onReplyComment={onReplyComment}
            />
          )}
        </div>

        {/* Comment input */}
        <CommentInput onSubmit={onCommentSubmit} submitting={submitting} />
      </div>
    </Modal>
  )
}

export default CommentModal
