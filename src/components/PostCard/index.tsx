import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { message, Modal, Popconfirm } from 'antd'
import { FaRegComment, FaShare } from 'react-icons/fa'
import { MdMoreHoriz, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import { postBlogView, getAllCommentByBlogId, getAllReactionByBlogId } from '@/services/blogService'
import ROUTES from '@/utils/config/routes'
import TagsList from '@/components/TagsList'
import CommentModal from '@/components/Comments/CommentModal'
import ReactionButton from '@/components/Reactions/ReactionButton'
import PostContent from '@/components/PostContent'

interface PostCardProps {
  post: any
  currentUser: any
  isPostCreator: boolean
  onEdit: (post: any) => void
  onDelete: (postId: string) => void
  onShowReactions: () => void
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, isPostCreator, onEdit, onDelete, onShowReactions }) => {
  // State variables
  const [showPostMenu, setShowPostMenu] = useState(false)
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false)
  const [postComments, setPostComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [postReactions, setPostReactions] = useState<any[]>([])
  const [totalReactions, setTotalReactions] = useState(post.reactionsCount || post.likes || 0)
  const [loadingReactions, setLoadingReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState<string>(post.userReaction || '')
  const [popconfirmVisible, setPopconfirmVisible] = useState(false)

  const postMenuRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)

  // Extract tags from either tags or blogTags property
  const displayTags = post.tags || post.blogTags?.map((bt) => bt.tag) || []

  // Close post menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
        setShowPostMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch post reactions when component mounts
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoadingReactions(true)
        const response = await getAllReactionByBlogId(post.id)
        if (response && response.success) {
          if (response.response) {
            let reactions = response.response
            if (Array.isArray(reactions)) {
              setPostReactions(reactions)
              setTotalReactions(reactions.length)
            } else if (typeof reactions === 'object' && reactions.items) {
              setPostReactions(reactions.items)
              setTotalReactions(reactions.items.length)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch reactions:', error)
      } finally {
        setLoadingReactions(false)
      }
    }

    fetchReactions()
  }, [post.id])

  // Function to fetch comments
  const fetchComments = async () => {
    if (!post.id) return

    try {
      setLoadingComments(true)
      const response = await getAllCommentByBlogId(post.id)
      if (response && response.success && response.response) {
        setPostComments(response.response)
      } else {
        setPostComments([])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      message.error('Failed to load comments')
    } finally {
      setLoadingComments(false)
    }
  }

  // Toggle post menu
  const togglePostMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setShowPostMenu(!showPostMenu)
  }

  // Show comment modal
  const showCommentModal = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsCommentModalVisible(true)
    await fetchComments()
  }

  // Handle reaction change
  const handleReactionChange = (newReactions: any[], newSelectedReaction: string) => {
    setPostReactions(newReactions)
    setSelectedReaction(newSelectedReaction)
    setTotalReactions(newReactions.length)
  }

  // Handle comment submission, edit, delete, and reply functions
  const handleCommentSubmit = async (commentText: string) => {
    // Implementation here
  }

  const handleEditComment = async (commentId: string, newText: string): Promise<boolean> => {
    // Implementation here
    return true
  }

  const handleDeleteComment = async (commentId: string): Promise<boolean> => {
    // Implementation here
    return true
  }

  const handleReplyComment = async (parentId: string, replyText: string): Promise<boolean> => {
    // Implementation here
    return true
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      {/* Post header */}
      <div className='p-4'>
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <img
              src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt={`${post.fullName}'s avatar`}
              className='w-10 h-10 rounded-full object-cover'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
              }}
            />
            <div className='ml-3'>
              <div className='flex items-center'>
                <h3 className='font-semibold text-sm'>{post.fullName || 'Community Member'}</h3>
                {post.location && (
                  <>
                    <span className='mx-1 text-gray-500'>đang ở</span>
                    <span className='font-semibold text-sm'>{post.location}</span>
                  </>
                )}
              </div>
              <div className='text-gray-500 text-xs flex items-center'>
                <span>{post.timeAgo}</span>
                <span className='mx-1'>·</span>
                <span>🌐</span>
              </div>
            </div>
          </div>
          <div className='relative'>
            <button onClick={togglePostMenu}>
              <MdMoreHoriz />
            </button>

            {/* Post options menu */}
            {showPostMenu && (
              <div ref={postMenuRef} className='absolute right-0 mt-1 bg-white rounded-md shadow-lg z-20 w-48 py-1'>
                {isPostCreator && (
                  <>
                    <button
                      onClick={() => {
                        onEdit(post)
                        setShowPostMenu(false)
                      }}
                      className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      <MdEdit className='mr-2' /> Edit Post
                    </button>
                    <Popconfirm
                      title='Delete post'
                      description='Are you sure you want to delete this post?'
                      open={popconfirmVisible}
                      onConfirm={() => {
                        onDelete(post.id)
                        setShowPostMenu(false)
                        setPopconfirmVisible(false)
                      }}
                      okText='Yes'
                      cancelText='No'
                      onCancel={() => {
                        setPopconfirmVisible(false)
                      }}
                    >
                      <button
                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setPopconfirmVisible(true)
                        }}
                      >
                        <MdDelete className='mr-2' /> Delete Post
                      </button>
                    </Popconfirm>
                  </>
                )}
                {!isPostCreator && <div className='px-4 py-2 text-sm text-gray-500'>No actions available</div>}
              </div>
            )}
          </div>
        </div>

        {/* Post content */}
        <Link
          to={`${ROUTES.COMMUNITY}/${post.id}`}
          className='block hover:no-underline'
          onClick={() => postBlogView(post.id)}
        >
          <div className='mt-3 text-gray-800'>
            <PostContent content={post.content || post.shortDescription || ''} />
          </div>
        </Link>

        {post.type === 'chart' || post.sharedChartData ? (
          <div className='mt-3 mb-2'>
            <Link
              to={`${ROUTES.COMMUNITY}/${post.id}`}
              className='inline-flex items-center px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors'
              onClick={(e) => {
                e.stopPropagation()
                postBlogView(post.id)
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm0 6a1 1 0 000 2h9a1 1 0 100-2H3zm0 6a1 1 0 100 2h9a1 1 0 100-2H3z'
                  clipRule='evenodd'
                />
              </svg>
              View Chart
            </Link>
          </div>
        ) : null}

        {/* Post tags */}
        {displayTags.length > 0 && (
          <div className='mt-2'>
            <TagsList tags={displayTags} maxVisible={3} size='small' />
          </div>
        )}
      </div>

      {/* Post images */}
      {post.images && post.images.length > 0 && (
        <Link
          to={`${ROUTES.COMMUNITY}/${post.id}`}
          className='block hover:no-underline'
          onClick={() => postBlogView(post.id)}
        >
          <div
            className={`grid ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1`}
          >
            {post.images.map((image, index) => (
              <div
                key={index}
                className={`${post.images && post.images.length === 1 ? 'col-span-1' : ''} overflow-hidden`}
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className='w-full h-full object-cover'
                  style={{ maxHeight: post.images && post.images.length === 1 ? '500px' : '250px' }}
                />
              </div>
            ))}
          </div>
        </Link>
      )}

      {/* Like count */}
      <div className='px-4 py-2 flex items-center border-t border-gray-100'>
        <div className='flex'>
          {postReactions.length > 0 && (
            <button className='flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-200'>
              <span className='text-gray-500 text-sm ml-2'>{totalReactions}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className='px-2 py-1 flex justify-between border-t border-gray-100 relative'>
        <ReactionButton
          postId={post.id}
          userId={currentUser?.id}
          selectedReaction={selectedReaction}
          postReactions={postReactions}
          onReactionChange={handleReactionChange}
          placement='card'
        />

        <button
          className='flex-1 flex items-center justify-center py-2 text-gray-500 hover:bg-gray-100 rounded-md'
          onClick={showCommentModal}
        >
          <FaRegComment className='mr-2' />
          <span>Comment</span>
        </button>
      </div>

      {/* Comment Modal */}
      <CommentModal
        visible={isCommentModalVisible}
        onCancel={() => setIsCommentModalVisible(false)}
        post={post}
        comments={postComments}
        currentUser={currentUser}
        postReactions={postReactions}
        selectedReaction={selectedReaction}
        onReactionChange={handleReactionChange}
        onCommentSubmit={handleCommentSubmit}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onReplyComment={handleReplyComment}
        loading={loadingComments}
        submitting={submittingComment}
        onShowReactions={onShowReactions}
      />
    </div>
  )
}

export default PostCard
