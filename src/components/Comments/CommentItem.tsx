import React, { useState, useRef } from 'react'
import { Modal, Dropdown, Menu } from 'antd'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdMoreVert } from 'react-icons/md'

interface CommentItemProps {
  comment: any
  currentUserId?: string
  isReply?: boolean
  onEdit: (commentId: string, newText: string) => Promise<boolean>
  onDelete: (commentId: string) => Promise<boolean>
  onReply: (parentId: string, replyText: string) => Promise<boolean>
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isReply = false,
  onEdit,
  onDelete,
  onReply
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const replyInputRef = useRef<HTMLInputElement>(null)

  // Check if current user is the comment author
  const isCommentAuthor = currentUserId === comment.user?.id

  // Start editing - initialize with current comment text
  const startEditing = () => {
    setEditText(comment.commentText)
    setIsEditing(true)
  }

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false)
    setEditText('')
  }

  // Handle edit submit
  const handleEditSubmit = async () => {
    if (editText.trim() === '') return

    try {
      setSubmitting(true)
      const success = await onEdit(comment.id, editText)

      if (success) {
        setIsEditing(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete comment
  const handleDeleteComment = async () => {
    try {
      setSubmitting(true)
      await onDelete(comment.id)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (replyText.trim() === '') return

    try {
      setSubmitting(true)
      const success = await onReply(comment.id, replyText)

      if (success) {
        setReplyText('')
        setShowReplyBox(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`flex items-start space-x-3 py-2 ${isReply ? 'pl-10' : ''}`}>
      <img
        src={comment.user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
        alt={comment.user?.fullName || 'User'}
        className='w-8 h-8 rounded-full object-cover'
      />

      <div className='flex-1'>
        {isEditing ? (
          // Edit mode
          <div className='flex flex-col'>
            <input
              type='text'
              className='w-full p-2 border rounded-md bg-white focus:outline-none text-sm'
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className='flex gap-2 mt-2'>
              <button
                onClick={handleEditSubmit}
                disabled={!editText.trim() || submitting}
                className={`text-xs px-3 py-1 rounded-md font-medium ${
                  !editText.trim() || submitting ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
                }`}
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className='text-xs px-3 py-1 rounded-md border border-gray-300 text-gray-500'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <div className='flex items-start justify-between'>
            <div>
              <span className='font-semibold text-sm mr-2'>{comment.user?.fullName || 'User'}</span>
              <span className='text-sm'>{comment.commentText}</span>
            </div>

            {isCommentAuthor && (
              <div className='relative ml-2'>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key='edit' onClick={startEditing} icon={<FaEdit size={12} />}>
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        key='delete'
                        danger
                        onClick={() => {
                          Modal.confirm({
                            title: 'Delete Comment',
                            content: 'Are you sure you want to delete this comment? This cannot be undone.',
                            okText: 'Delete',
                            okType: 'danger',
                            cancelText: 'Cancel',
                            onOk: handleDeleteComment
                          })
                        }}
                        icon={<FaTrash size={12} />}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                  placement='bottomRight'
                >
                  <button className='text-gray-400 hover:text-gray-600'>
                    <MdMoreVert size={16} />
                  </button>
                </Dropdown>
              </div>
            )}
          </div>
        )}

        <div className='flex items-center mt-1 text-xs text-gray-500 space-x-3'>
          <span>{comment.timeAgo}</span>
          <button className='font-medium hover:underline'>Like</button>

          {!isEditing && !isReply && (
            <button onClick={() => setShowReplyBox(!showReplyBox)} className='font-medium hover:underline'>
              Reply
            </button>
          )}
        </div>

        {/* Reply box */}
        {showReplyBox && !isEditing && (
          <div className='mt-2 flex items-start'>
            <div className='flex-1'>
              <div className='flex items-center'>
                <input
                  ref={replyInputRef}
                  type='text'
                  className='w-full p-2 border-none bg-transparent focus:outline-none text-sm'
                  placeholder='Write a reply...'
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() || submitting}
                  className={`text-sm font-semibold ${
                    !replyText.trim() || submitting ? 'text-blue-300' : 'text-blue-500'
                  }`}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentItem
