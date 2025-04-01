import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Modal, Popconfirm, message } from 'antd'
import { MdMoreVert, MdClose } from 'react-icons/md'
import { getAllCommentByBlogId, createComment, updateComment, deleteComment } from '@/services/blogService'

interface User {
  id: string
  fullName: string
  avatarUrl?: string
}

interface Comment {
  id: string
  commentText: string
  timeAgo: string
  user: {
    id: string
    fullName: string
    avatarUrl?: string
  }
  parentCommentId?: string
  replies?: Comment[]
}

interface CommentSystemProps {
  postId: string
  currentUser?: User
  initialComments?: Comment[]
  className?: string
  modalMode?: boolean
  isVisible?: boolean
  onClose?: () => void
  onCommentCountChange?: (count: number) => void
}

const CommentContainer = styled.div`
  width: 100%;
`

const CommentList = styled.div`
  max-height: ${(props) => (props.theme.modalMode ? '60vh' : 'auto')};
  overflow-y: ${(props) => (props.theme.modalMode ? 'auto' : 'visible')};
  padding: 16px 0;
`

const CommentItem = styled.div`
  display: flex;
  margin-bottom: 16px;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`

const CommentContent = styled.div`
  flex: 1;
`

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
`

const CommentText = styled.p`
  margin: 4px 0;
  font-size: 14px;
  word-break: break-word;
`

const CommentActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`

const TimeAgo = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const ReplyContainer = styled.div`
  margin-left: 44px;
`

const CommentInput = styled.div`
  display: flex;
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
`

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 8px 0;
  background: transparent;

  &::placeholder {
    color: #9ca3af;
  }
`

const SubmitButton = styled.button<{ disabled: boolean }>`
  background: none;
  border: none;
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => (props.disabled ? '#93c5fd' : '#3b82f6')};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

const EditInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
`

const EditActions = styled.div`
  display: flex;
  gap: 8px;
`

const EditButton = styled.button<{ primary?: boolean }>`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  ${(props) =>
    props.primary
      ? `
    background-color: #3b82f6;
    color: white;
    border: none;
    
    &:hover {
      background-color: #2563eb;
    }
    
    &:disabled {
      background-color: #93c5fd;
      cursor: default;
    }
  `
      : `
    background-color: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f3f4f6;
    }
  `}
`

const ToggleRepliesButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  margin-top: 8px;
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  .spinner {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #db2777;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const EmptyComments = styled.div`
  text-align: center;
  padding: 32px 0;

  p:first-child {
    color: #6b7280;
    margin-bottom: 8px;
  }

  p:last-child {
    color: #9ca3af;
    font-size: 14px;
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
`

const ModalTitle = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;

    p:first-child {
      font-weight: 600;
      font-size: 14px;
    }

    p:last-child {
      font-size: 12px;
      color: #6b7280;
    }
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #1f2937;
  }
`

const CommentSystem: React.FC<CommentSystemProps> = ({
  postId,
  currentUser,
  initialComments = [],
  className,
  modalMode = false,
  isVisible = false,
  onClose,
  onCommentCountChange
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [loading, setLoading] = useState<boolean>(false)
  const [commentText, setCommentText] = useState<string>('')
  const [replyText, setReplyText] = useState<string>('')
  const [showReplyBox, setShowReplyBox] = useState<string | null>(null)
  const [showAllReplies, setShowAllReplies] = useState<Record<string, boolean>>({})
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editText, setEditText] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [popconfirmVisible, setPopconfirmVisible] = useState<string | null>(null)

  const commentInputRef = useRef<HTMLInputElement>(null)
  const replyInputRef = useRef<HTMLInputElement>(null)

  // Fetch comments from API
  const fetchComments = async () => {
    if (!postId) return

    try {
      setLoading(true)
      const response = await getAllCommentByBlogId(postId)
      if (response && response.success && response.response) {
        setComments(response.response)

        // Notify parent component of comment count change
        if (onCommentCountChange) {
          const totalCount = countTotalComments(response.response)
          onCommentCountChange(totalCount)
        }
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      message.error('Failed to load comments')
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  // Count total comments including replies
  const countTotalComments = (comments: Comment[]): number => {
    let count = comments.length

    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length
      }
    })

    return count
  }

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (commentText.trim() === '' || !postId || !currentUser) return

    try {
      setSubmitting(true)

      const response = await createComment(
        'postComment', // apiCallerId
        postId,
        currentUser.id,
        commentText,
        null // parentCommentId empty for top-level comments
      )

      if (response.success) {
        setCommentText('')
        await fetchComments()
        message.success('Comment posted successfully')
      } else {
        message.error(response.message || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
      message.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle reply submission
  const handleReplySubmit = async (parentCommentId: string) => {
    if (replyText.trim() === '' || !postId || !currentUser) return

    try {
      setSubmitting(true)

      const response = await createComment(
        'postReply', // apiCallerId
        postId,
        currentUser.id,
        replyText,
        parentCommentId // parentCommentId for replies
      )

      if (response.success) {
        setReplyText('')
        setShowReplyBox(null)
        await fetchComments()
        message.success('Reply posted successfully')
      } else {
        message.error(response.message || 'Failed to post reply')
      }
    } catch (error) {
      console.error('Failed to post reply:', error)
      message.error('Failed to post reply')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit submission
  const handleEditSubmit = async (commentId: string) => {
    if (editText.trim() === '') return

    try {
      setSubmitting(true)
      const success = await updateComment(commentId, editText)

      if (success) {
        message.success('Comment updated successfully')
        setIsEditing(null)
        await fetchComments()
      } else {
        message.error('Failed to update comment')
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Start editing a comment
  const startEditing = (commentId: string, currentText: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setIsEditing(commentId)
    setEditText(currentText)
  }

  //Confirm delete comment
  const confirmDeleteComment = (commentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setPopconfirmVisible(commentId)
  }

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    try {
      setSubmitting(true)
      const success = await deleteComment(commentId)

      if (success) {
        message.success('Comment deleted successfully')
        await fetchComments()
      } else {
        message.error('Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Toggle dropdown visibility
  // const toggleDropdown = (commentId: string, e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   e.preventDefault()

  //   // Toggle dropdown for this comment
  //   setDropdownVisibleFor((prevId) => {
  //     return prevId === commentId ? null : commentId
  //   })

  //   // Add a click event listener to close dropdown when clicking outside
  //   if (dropdownVisibleFor !== commentId) {
  //     const handleOutsideClick = (event: MouseEvent) => {
  //       setDropdownVisibleFor(null)
  //       document.removeEventListener("click", handleOutsideClick)
  //     }

  //     // Add the listener with a slight delay to avoid immediate triggering
  //     setTimeout(() => {
  //       document.addEventListener("click", handleOutsideClick)
  //     }, 0)
  //   }
  // }

  // // Start editing a comment
  // const startEditing = (commentId: string, currentText: string) => {
  //   setIsEditing(commentId)
  //   setEditText(currentText)
  //   setDropdownVisibleFor(null)
  // }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(null)
    setEditText('')
  }

  // Toggle showing all replies for a comment
  const toggleShowAllReplies = (commentId: string) => {
    setShowAllReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }))
  }

  // Hide replies for a comment
  const hideReplies = (commentId: string) => {
    setShowAllReplies((prevState) => ({
      ...prevState,
      [commentId]: false
    }))
  }

  // Show reply box and focus input
  const handleShowReplyBox = (commentId: string) => {
    setShowReplyBox(commentId)
    setReplyText('')

    // Focus the input after a short delay
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus()
      }
    }, 50)
  }

  // Effect to fetch comments on mount
  useEffect(() => {
    fetchComments()
  }, [postId])

  // Add this useEffect to handle external visibility control:
  useEffect(() => {
    if (modalMode) {
      setIsModalVisible(isVisible)
    }
  }, [isVisible, modalMode])

  // Render a comment item
  const renderCommentItem = (comment: Comment, isReply = false) => {
    // Check if current user is the comment author
    const isCommentAuthor = currentUser && currentUser.id === comment.user.id

    return (
      <CommentItem key={comment.id} style={{ marginLeft: isReply ? '44px' : '0' }}>
        <Avatar
          src={comment.user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
          alt={comment.user.fullName}
        />
        <CommentContent>
          {isEditing === comment.id ? (
            // Edit mode
            <div>
              <EditInput type='text' value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
              <EditActions>
                <EditButton
                  primary
                  onClick={() => handleEditSubmit(comment.id)}
                  disabled={!editText.trim() || submitting}
                >
                  Save
                </EditButton>
                <EditButton onClick={cancelEditing}>Cancel</EditButton>
              </EditActions>
            </div>
          ) : (
            // View mode
            <>
              <CommentHeader>
                <div>
                  <UserName>{comment.user.fullName}</UserName>
                  <CommentText>{comment.commentText}</CommentText>
                  <CommentActions>
                    <TimeAgo>{comment.timeAgo}</TimeAgo>
                    <ActionButton>Like</ActionButton>
                    {!isEditing && <ActionButton onClick={() => handleShowReplyBox(comment.id)}>Reply</ActionButton>}
                    {!isEditing && isCommentAuthor && (
                      <ActionButton onClick={() => startEditing(comment.id, comment.commentText)}>Edit</ActionButton>
                    )}
                    {!isEditing && isCommentAuthor && (
                      <Popconfirm
                        title='Delete the task'
                        description='Are you sure to delete this task?'
                        onConfirm={() => handleDeleteComment(comment.id)}
                        onCancel={() => setPopconfirmVisible(null)}
                        open={popconfirmVisible === comment.id}
                        okText='Yes'
                        cancelText='No'
                      >
                        <ActionButton onClick={() => confirmDeleteComment(comment.id)}>Delete</ActionButton>
                      </Popconfirm>
                    )}
                  </CommentActions>
                </div>
              </CommentHeader>

              {/* Reply box */}
              {showReplyBox === comment.id && !isEditing && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                  <Input
                    ref={replyInputRef}
                    type='text'
                    placeholder='Write a reply...'
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <SubmitButton
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={!replyText.trim() || submitting}
                  >
                    Reply
                  </SubmitButton>
                </div>
              )}
            </>
          )}
        </CommentContent>
      </CommentItem>
    )
  }

  // Render the comment system
  return (
    <CommentContainer className={className} theme={{ modalMode }}>
      {modalMode ? (
        // Modal mode
        <>
          <Modal
            open={isModalVisible}
            onCancel={onClose}
            footer={null}
            width={800}
            centered
            closable={false}
            className='instagram-modal'
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
              <ModalHeader>
                <ModalTitle>
                  <div>
                    <p>Comments</p>
                  </div>
                </ModalTitle>
                <CloseButton onClick={onClose}>
                  <MdClose size={24} />
                </CloseButton>
              </ModalHeader>

              <CommentList theme={{ modalMode: true }}>
                {loading ? (
                  <LoadingSpinner>
                    <div className='spinner'></div>
                  </LoadingSpinner>
                ) : (
                  <>
                    {comments.length === 0 ? (
                      <EmptyComments>
                        <p>No comments yet</p>
                        <p>Be the first to comment</p>
                      </EmptyComments>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id}>
                          {renderCommentItem(comment)}

                          {/* Replies section */}
                          {comment.replies && comment.replies.length > 0 && (
                            <ReplyContainer>
                              {/* Show all replies toggle */}
                              {!showAllReplies[comment.id] && (
                                <ToggleRepliesButton onClick={() => toggleShowAllReplies(comment.id)}>
                                  View {comment.replies.length > 2 ? `all ${comment.replies.length}` : ''} replies
                                </ToggleRepliesButton>
                              )}

                              {/* Display replies only if showAllReplies is true for this comment */}
                              {showAllReplies[comment.id] && (
                                <>
                                  {comment.replies.map((reply) => renderCommentItem(reply, true))}

                                  {/* Hide replies button */}
                                  <ToggleRepliesButton onClick={() => hideReplies(comment.id)}>
                                    Hide replies
                                  </ToggleRepliesButton>
                                </>
                              )}
                            </ReplyContainer>
                          )}
                        </div>
                      ))
                    )}
                  </>
                )}
              </CommentList>

              <CommentInput>
                <Input
                  ref={commentInputRef}
                  type='text'
                  placeholder='Add a comment...'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !submitting && commentText.trim()) {
                      handleCommentSubmit()
                    }
                  }}
                />
                <SubmitButton onClick={handleCommentSubmit} disabled={!commentText.trim() || submitting}>
                  Post
                </SubmitButton>
              </CommentInput>
            </div>
          </Modal>
        </>
      ) : (
        // Inline mode
        <>
          <CommentList theme={{ modalMode: false }}>
            {loading ? (
              <LoadingSpinner>
                <div className='spinner'></div>
              </LoadingSpinner>
            ) : (
              <>
                {comments.length === 0 ? (
                  <EmptyComments>
                    <p>No comments yet</p>
                    <p>Be the first to comment</p>
                  </EmptyComments>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id}>
                      {renderCommentItem(comment)}

                      {/* Replies section */}
                      {comment.replies && comment.replies.length > 0 && (
                        <ReplyContainer>
                          {/* Show all replies toggle */}
                          {!showAllReplies[comment.id] && (
                            <ToggleRepliesButton onClick={() => toggleShowAllReplies(comment.id)}>
                              View {comment.replies.length > 2 ? `all ${comment.replies.length}` : ''} replies
                            </ToggleRepliesButton>
                          )}

                          {/* Display replies only if showAllReplies is true for this comment */}
                          {showAllReplies[comment.id] && (
                            <>
                              {comment.replies.map((reply) => renderCommentItem(reply, true))}

                              {/* Hide replies button */}
                              <ToggleRepliesButton onClick={() => hideReplies(comment.id)}>
                                Hide replies
                              </ToggleRepliesButton>
                            </>
                          )}
                        </ReplyContainer>
                      )}
                    </div>
                  ))
                )}
              </>
            )}
          </CommentList>

          {currentUser && (
            <CommentInput>
              <Input
                ref={commentInputRef}
                type='text'
                placeholder='Add a comment...'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !submitting && commentText.trim()) {
                    handleCommentSubmit()
                  }
                }}
              />
              <SubmitButton onClick={handleCommentSubmit} disabled={!commentText.trim() || submitting}>
                Post
              </SubmitButton>
            </CommentInput>
          )}
        </>
      )}
    </CommentContainer>
  )
}

export default CommentSystem
