import React, { useRef, useState } from 'react'
import { Tooltip } from 'antd'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaHeart, FaRegSurprise, FaRegHeart } from 'react-icons/fa'
import { createPostReaction, deleteReaction } from '@/services/blogService'

interface ReactionButtonProps {
  postId: string
  userId: string
  selectedReaction: string
  postReactions: any[]
  onReactionChange: (newReactions: any[], newSelectedReaction: string) => void
  placement?: 'card' | 'modal'
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  postId,
  userId,
  selectedReaction,
  postReactions,
  onReactionChange,
  placement = 'card'
}) => {
  const [showReactions, setShowReactions] = useState(false)
  const reactionRef = useRef<HTMLDivElement>(null)

  // Reaction configuration
  const reactions = [
    { name: 'Like', icon: <AiFillLike size={20} className='text-blue-500' />, color: 'text-blue-500' },
    { name: 'Love', icon: <FaHeart size={20} className='text-red-500' />, color: 'text-red-500' },
    { name: 'Haha', icon: <FaRegLaughBeam size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Wow', icon: <FaRegSurprise size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Sad', icon: <FaRegSadTear size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
    { name: 'Angry', icon: <FaRegAngry size={20} className='text-orange-500' />, color: 'text-orange-500' }
  ]

  // Handler for hovering on the like button
  const handleLikeHover = () => {
    setShowReactions(true)
  }

  // Keep reactions visible when hovering over them
  const handleReactionsHover = () => {
    setShowReactions(true)
  }

  // Handler for leaving the like button or reactions area
  const handleMouseLeave = () => {
    setTimeout(() => {
      setShowReactions(false)
    }, 1000)
  }

  // Handle reaction selection
  const handleReaction = async (reaction: string) => {
    if (!userId) return

    try {
      // Check if user is toggling the same reaction (removing it)
      const isRemovingReaction = reaction === selectedReaction || reaction === ''

      // Find user's current reaction ID for deletion
      let userReactionId = null
      if (isRemovingReaction) {
        const userReaction = postReactions.find((r) => r.userId === userId)
        if (userReaction) {
          userReactionId = userReaction.id
        }
      }

      // Update local state for UI responsiveness
      const newSelectedReaction = isRemovingReaction ? '' : reaction

      // Prepare updated reactions list
      let newReactions = [...postReactions]
      if (isRemovingReaction) {
        newReactions = newReactions.filter((r) => r.userId !== userId)
      } else {
        // Find existing user reaction
        const existingReactionIndex = newReactions.findIndex((r) => r.userId === userId)

        // Map reaction name to numeric type
        const reactionMap: Record<string, string> = {
          Like: '1',
          Love: '2',
          Haha: '3',
          Wow: '4',
          Sad: '5',
          Angry: '6'
        }

        const type = reactionMap[reaction] || '1'

        if (existingReactionIndex >= 0) {
          // Update existing reaction
          newReactions[existingReactionIndex] = {
            ...newReactions[existingReactionIndex],
            type
          }
        } else {
          // Add new reaction
          newReactions.push({
            userId,
            postId,
            type,
            id: 'temp-id-' + Date.now() // Temporary ID until API response
          })
        }
      }

      setShowReactions(false)

      // Update parent component with new reaction state
      onReactionChange(newReactions, newSelectedReaction)

      // Now handle the API call
      try {
        let result
        if (isRemovingReaction) {
          if (userReactionId) {
            result = await deleteReaction(userReactionId)
          }
        } else {
          const type = reactionMap[reaction] || '1'
          result = await createPostReaction(userId, postId, type)
        }

        if (!result || !result.success) {
          // Revert state if API call fails
          onReactionChange(postReactions, selectedReaction)
        }
      } catch (error) {
        console.error('API error:', error)
        // Revert UI state since API call failed
        onReactionChange(postReactions, selectedReaction)
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  // Get active reaction display
  const getActiveReaction = () => {
    if (!selectedReaction)
      return (
        <>
          <AiOutlineLike className='mr-2' />
          <span>Like</span>
        </>
      )

    const reaction = reactions.find((r) => r.name === selectedReaction)

    if (!reaction)
      return (
        <>
          <AiOutlineLike className='mr-2' />
          <span>Like</span>
        </>
      )

    return (
      <>
        {reaction.icon}
        <span className={`ml-2 ${reaction.color}`}>{reaction.name}</span>
      </>
    )
  }

  return (
    <div className='relative'>
      {/* Reaction panel */}
      {showReactions && (
        <div
          ref={reactionRef}
          onMouseEnter={handleReactionsHover}
          onMouseLeave={handleMouseLeave}
          className={`absolute ${placement === 'card' ? 'bottom-full' : 'top-0'} left-0 ${
            placement === 'card' ? 'mb-2' : 'mt-[-50px]'
          } bg-white rounded-full shadow-lg px-2 py-1 flex items-center space-x-2 z-10 transition-all duration-300 ease-in-out`}
          style={{
            transform: 'translateY(-5px)',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {reactions.map((reaction) => (
            <Tooltip key={reaction.name} title={reaction.name} placement='top'>
              <div
                onClick={() => handleReaction(reaction.name)}
                className={`hover:bg-gray-100 p-2 rounded-full cursor-pointer transform transition-transform hover:scale-125 ${
                  selectedReaction === reaction.name ? 'bg-gray-100 scale-110' : ''
                }`}
              >
                {reaction.icon}
              </div>
            </Tooltip>
          ))}
        </div>
      )}

      {placement === 'card' ? (
        <button
          className={`flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-md ${
            selectedReaction ? reactions.find((r) => r.name === selectedReaction)?.color : 'text-gray-500'
          }`}
          onMouseEnter={handleLikeHover}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            handleReaction(selectedReaction ? '' : 'Like')
          }}
        >
          {getActiveReaction()}
        </button>
      ) : (
        <div className='relative' onMouseEnter={handleLikeHover} onMouseLeave={handleMouseLeave}>
          <button className='text-2xl'>
            {!selectedReaction ? (
              <FaRegHeart className='text-gray-600' />
            ) : selectedReaction === 'Love' ? (
              <FaHeart className='text-red-500' />
            ) : (
              reactions.find((r) => r.name === selectedReaction)?.icon || <FaRegHeart className='text-gray-600' />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ReactionButton
