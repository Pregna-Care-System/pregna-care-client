import React from 'react'
import { Tooltip } from 'antd'
import { AiOutlineLike } from 'react-icons/ai'
import { getReactionConfig, getReactionTypeFromNumber } from './reactionUtils'

interface ReactionDisplayProps {
  postReactions: any[]
  totalReactions: number
  onClick: (e: React.MouseEvent) => void
  loading?: boolean
}

const ReactionDisplay: React.FC<ReactionDisplayProps> = ({
  postReactions,
  totalReactions,
  onClick,
  loading = false
}) => {
  const reactions = getReactionConfig()

  const getReactionCounts = () => {
    const counts: Record<string, number> = {}

    if (!postReactions || !Array.isArray(postReactions) || postReactions.length === 0) {
      return counts
    }

    try {
      postReactions.forEach((reaction) => {
        if (!reaction) return

        // Handle different possible formats of reaction type data
        let reactionType = '1' // Default to 'Like'

        if (reaction.type !== undefined) {
          reactionType = reaction.type.toString()
        } else if (reaction.reactionType !== undefined) {
          reactionType = reaction.reactionType.toString()
        }

        // Increment the count for this type
        counts[reactionType] = (counts[reactionType] || 0) + 1
      })
    } catch (error) {
      console.error('Error counting reactions:', error)
    }

    return counts
  }

  if (loading) {
    return <span className='text-gray-400 text-xs'>Loading reactions...</span>
  }

  const reactionCounts = getReactionCounts()
  const reactionTypes = Object.keys(reactionCounts)
    .sort((a, b) => reactionCounts[b] - reactionCounts[a])
    .slice(0, 3)

  if (reactionTypes.length === 0) {
    return <span className='text-gray-400 text-xs'>No reactions yet</span>
  }

  return (
    <button
      onClick={onClick}
      className='flex items-center hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-200'
    >
      <div className='flex -space-x-1'>
        {reactionTypes.map((type, index) => {
          const reactionName = getReactionTypeFromNumber(type)
          const reactionObj = reactions.find((r) => r.name === reactionName)
          const count = reactionCounts[type]

          return (
            <Tooltip key={index} title={`${reactionName}: ${count}`} placement='top'>
              <span
                className='relative inline-block rounded-full bg-white border border-gray-100 shadow-sm'
                style={{ zIndex: 10 - index, marginLeft: index > 0 ? '-8px' : '0' }}
              >
                {reactionObj?.icon || <AiOutlineLike size={16} className='bg-blue-500 text-white rounded-full p-1' />}
              </span>
            </Tooltip>
          )
        })}
      </div>
      <span className='text-gray-500 text-sm ml-2'>{totalReactions}</span>
    </button>
  )
}

export default ReactionDisplay
