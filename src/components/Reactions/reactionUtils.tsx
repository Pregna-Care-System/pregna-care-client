import React from 'react'
import { AiFillLike } from 'react-icons/ai'
import { FaHeart, FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaRegSurprise } from 'react-icons/fa'

export const getReactionConfig = () => [
  { name: 'Like', icon: <AiFillLike size={20} className='text-blue-500' />, color: 'text-blue-500' },
  { name: 'Love', icon: <FaHeart size={20} className='text-red-500' />, color: 'text-red-500' },
  { name: 'Haha', icon: <FaRegLaughBeam size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
  { name: 'Wow', icon: <FaRegSurprise size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
  { name: 'Sad', icon: <FaRegSadTear size={20} className='text-yellow-500' />, color: 'text-yellow-500' },
  { name: 'Angry', icon: <FaRegAngry size={20} className='text-orange-500' />, color: 'text-orange-500' }
]

export const getReactionTypeFromNumber = (type: string) => {
  const numberToReaction: Record<string, string> = {
    '1': 'Like',
    '2': 'Love',
    '3': 'Haha',
    '4': 'Wow',
    '5': 'Sad',
    '6': 'Angry'
  }
  return numberToReaction[type]
}

export const getReactionIcon = (reactionType: string) => {
  const reactionName = getReactionTypeFromNumber(reactionType)
  const reaction = getReactionConfig().find((r) => r.name === reactionName)
  return reaction?.icon || <AiFillLike size={20} className='text-blue-500' />
}
