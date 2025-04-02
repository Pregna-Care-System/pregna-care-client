import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Tooltip, message, Modal, Tabs } from 'antd'
import { AiOutlineLike, AiFillLike } from 'react-icons/ai'
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaHeart, FaRegSurprise } from 'react-icons/fa'
import { createPostReaction, deleteReaction, getAllReactionByBlogId } from '@/services/blogService'
import UserAvatar from '@/components/common/UserAvatar'

const { TabPane } = Tabs

interface Reaction {
  id: string
  userId: string
  fullName?: string
  userName?: string
  userAvatarUrl?: string
  userAvatar?: string
  type: string
  createdAt?: string
}

interface ReactionType {
  name: string
  icon: JSX.Element
  color: string
}

interface ReactionSystemProps {
  postId: string
  currentUserId?: string
  initialReactions?: Reaction[]
  initialCount?: number
  initialUserReaction?: string
  onReactionChange?: (reactionCount: number) => void
  size?: 'small' | 'medium' | 'large'
  displayMode?: 'button' | 'icon' | 'counter'
  className?: string
}

const ReactionContainer = styled.div`
  position: relative;
`

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

const ReactionCounter = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 9999px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`

const ReactionIconGroup = styled.div`
  display: flex;
  margin-right: 8px;
`

const ReactionIconWrapper = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-left: -4px;

  &:first-child {
    margin-left: 0;
  }
`

const ReactionCount = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`

const ReactionPanel = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 9999px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 4px;
  display: flex;
  z-index: 10;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ReactionOption = styled.div<{ active?: boolean }>`
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
  background-color: ${(props) => (props.active ? 'rgba(0, 0, 0, 0.05)' : 'transparent')};
  transform: ${(props) => (props.active ? 'scale(1.1)' : 'scale(1)')};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.2);
  }
`

const ReactionSystem: React.FC<ReactionSystemProps> = ({
  postId,
  currentUserId,
  initialReactions = [],
  initialCount = 0,
  initialUserReaction = '',
  onReactionChange,
  size = 'medium',
  displayMode = 'button',
  className
}) => {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [totalReactions, setTotalReactions] = useState<number>(initialCount)
  const [userReaction, setUserReaction] = useState<string>(initialUserReaction)
  const [loading, setLoading] = useState<boolean>(false)
  const [showReactionPanel, setShowReactionPanel] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const reactionPanelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reaction types configuration
  const reactionTypes: ReactionType[] = [
    {
      name: 'Like',
      icon: <AiFillLike size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-blue-500' />,
      color: 'text-blue-500'
    },
    {
      name: 'Love',
      icon: <FaHeart size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-red-500' />,
      color: 'text-red-500'
    },
    {
      name: 'Haha',
      icon: <FaRegLaughBeam size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-yellow-500' />,
      color: 'text-yellow-500'
    },
    {
      name: 'Wow',
      icon: <FaRegSurprise size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-yellow-500' />,
      color: 'text-yellow-500'
    },
    {
      name: 'Sad',
      icon: <FaRegSadTear size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-yellow-500' />,
      color: 'text-yellow-500'
    },
    {
      name: 'Angry',
      icon: <FaRegAngry size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-orange-500' />,
      color: 'text-orange-500'
    }
  ]

  // Map reaction type number to reaction name
  const getReactionTypeFromNumber = (type: string): string => {
    const numberToReaction: Record<string, string> = {
      '1': 'Like',
      '2': 'Love',
      '3': 'Haha',
      '4': 'Wow',
      '5': 'Sad',
      '6': 'Angry'
    }
    return numberToReaction[type] || 'Like'
  }

  // Map reaction name to type number
  const getReactionNumberFromType = (name: string): string => {
    const reactionToNumber: Record<string, string> = {
      Like: '1',
      Love: '2',
      Haha: '3',
      Wow: '4',
      Sad: '5',
      Angry: '6'
    }
    return reactionToNumber[name] || '1'
  }

  // Fetch reactions from API
  const fetchReactions = async () => {
    if (!postId) return

    try {
      setLoading(true)
      const response = await getAllReactionByBlogId(postId)

      if (response && response.success) {
        if (response.response) {
          const fetchedReactions = response.response

          // Ensure we have an array of reactions
          if (Array.isArray(fetchedReactions)) {
            setReactions(fetchedReactions)
            setTotalReactions(fetchedReactions.length)
          } else if (typeof fetchedReactions === 'object') {
            // Handle case where response might be an object with a nested reactions array
            if (fetchedReactions.items && Array.isArray(fetchedReactions.items)) {
              setReactions(fetchedReactions.items)
              setTotalReactions(fetchedReactions.items.length)
            } else {
              console.warn('Reactions is an object but not in expected format:', fetchedReactions)
              setReactions([])
              setTotalReactions(0)
            }
          } else {
            console.warn('Unexpected reaction data format:', fetchedReactions)
            setReactions([])
            setTotalReactions(0)
          }
        } else {
          setReactions([])
          setTotalReactions(0)
        }
      } else {
        console.warn('API returned unsuccessful response:', response)
        setReactions([])
        setTotalReactions(0)
      }
    } catch (error) {
      console.error('Failed to fetch reactions:', error)
      setReactions([])
      setTotalReactions(0)
    } finally {
      setLoading(false)
    }
  }

  // Handle reaction click
  const handleReaction = async (reactionName: string) => {
    if (!currentUserId) {
      message.error('Please login to react')
      return
    }

    try {
      // Check if user is toggling the same reaction (removing it)
      const isRemovingReaction = reactionName === userReaction || reactionName === ''

      // Update local state immediately for UI responsiveness
      setUserReaction(isRemovingReaction ? '' : reactionName)
      setShowReactionPanel(false)

      // Find user's current reaction ID for deletion
      let userReactionId = null
      if (isRemovingReaction) {
        const currentUserReaction = reactions.find((r) => r.userId === currentUserId)
        if (currentUserReaction) {
          userReactionId = currentUserReaction.id
        }
      }

      try {
        let result
        if (isRemovingReaction) {
          if (userReactionId) {
            result = await deleteReaction(userReactionId)
          } else {
            // If we can't find the reaction ID, try with user ID and post ID
            result = await deleteReaction(currentUserId, postId)
          }
        } else {
          // Add or update the reaction
          const type = getReactionNumberFromType(reactionName)
          result = await createPostReaction(currentUserId, postId, type)
        }

        if (result && result.success) {
          // Refresh post reactions after successful action
          await fetchReactions()

          // Notify parent component of reaction change
          if (onReactionChange) {
            onReactionChange(isRemovingReaction ? totalReactions - 1 : totalReactions + 1)
          }
        } else {
          throw new Error(result?.message || 'Failed to update reaction')
        }
      } catch (apiError) {
        console.error('API error:', apiError)
        // Revert UI state since API call failed
        setUserReaction(isRemovingReaction ? reactionName : '')
        message.error('Failed to update reaction')
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  // Calculate reaction counts by type
  const getReactionCounts = () => {
    const counts: Record<string, number> = {}

    if (!reactions || !Array.isArray(reactions) || reactions.length === 0) {
      return counts
    }

    try {
      reactions.forEach((reaction) => {
        if (!reaction) return

        // Handle different possible formats of reaction type data
        let reactionType = '1' // Default to 'Like'

        if (reaction.type !== undefined) {
          reactionType = reaction.type.toString()
        }

        // Increment the count for this type
        counts[reactionType] = (counts[reactionType] || 0) + 1
      })
    } catch (error) {
      console.error('Error counting reactions:', error)
    }

    return counts
  }

  // Group reactions by type for modal display
  const getReactionsByType = () => {
    const reactionsByType: Record<string, Reaction[]> = {}

    reactions.forEach((reaction) => {
      const reactionType = reaction.type?.toString() || '1'
      const reactionName = getReactionTypeFromNumber(reactionType)

      if (!reactionsByType[reactionName]) {
        reactionsByType[reactionName] = []
      }
      reactionsByType[reactionName].push(reaction)
    })

    return reactionsByType
  }

  // Get active reaction display
  const getActiveReaction = () => {
    if (!userReaction) {
      return (
        <>
          <AiOutlineLike size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='mr-2' />
          <span>Like</span>
        </>
      )
    }

    const reaction = reactionTypes.find((r) => r.name === userReaction)

    if (!reaction) {
      return (
        <>
          <AiOutlineLike size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='mr-2' />
          <span>Like</span>
        </>
      )
    }

    return (
      <>
        {reaction.icon}
        <span className={`ml-2 ${reaction.color}`}>{reaction.name}</span>
      </>
    )
  }

  // Show reactions modal
  const showReactionsModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    setIsModalVisible(true)
  }

  // Handle mouse events for reaction panel
  const handleReactionHover = () => {
    setShowReactionPanel(true)
  }

  const handleReactionLeave = () => {
    setTimeout(() => {
      setShowReactionPanel(false)
    }, 500)
  }

  // Effect to fetch reactions on mount
  useEffect(() => {
    fetchReactions()
  }, [postId])

  // Effect to update user reaction when reactions change
  useEffect(() => {
    if (currentUserId && reactions.length > 0) {
      const userReaction = reactions.find((r) => r.userId === currentUserId && r.type !== undefined)
      if (userReaction && userReaction.type !== undefined) {
        setUserReaction(getReactionTypeFromNumber(userReaction.type.toString()))
      } else {
        setUserReaction('')
      }
    }
  }, [reactions, currentUserId])

  // Effect to handle clicks outside reaction panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionPanelRef.current &&
        !reactionPanelRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowReactionPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Render reaction counter
  const renderReactionCounter = () => {
    if (loading) {
      return <span className='text-gray-400 text-xs'>Loading...</span>
    }

    const reactionCounts = getReactionCounts()
    const topReactionTypes = Object.keys(reactionCounts)
      .sort((a, b) => reactionCounts[b] - reactionCounts[a])
      .slice(0, 3)

    if (topReactionTypes.length === 0) {
      return <span className='text-gray-400 text-xs'>No reactions</span>
    }

    return (
      <ReactionCounter onClick={showReactionsModal}>
        <ReactionIconGroup>
          {topReactionTypes.map((type, index) => {
            const reactionName = getReactionTypeFromNumber(type)
            const reactionObj = reactionTypes.find((r) => r.name === reactionName)

            return (
              <Tooltip key={index} title={`${reactionName}: ${reactionCounts[type]}`} placement='top'>
                <ReactionIconWrapper>
                  {reactionObj?.icon || <AiOutlineLike size={16} className='text-blue-500' />}
                </ReactionIconWrapper>
              </Tooltip>
            )
          })}
        </ReactionIconGroup>
        <ReactionCount>{totalReactions}</ReactionCount>
      </ReactionCounter>
    )
  }

  return (
    <ReactionContainer ref={containerRef} className={className}>
      {/* Reaction button or counter based on display mode */}
      {displayMode === 'button' && (
        <ReactionButton
          onMouseEnter={handleReactionHover}
          onMouseLeave={handleReactionLeave}
          onClick={() => handleReaction(userReaction ? '' : 'Like')}
        >
          {getActiveReaction()}
        </ReactionButton>
      )}

      {displayMode === 'counter' && renderReactionCounter()}

      {displayMode === 'icon' && (
        <ReactionButton
          onMouseEnter={handleReactionHover}
          onMouseLeave={handleReactionLeave}
          onClick={() => handleReaction(userReaction ? '' : 'Like')}
        >
          {!userReaction ? (
            <AiOutlineLike size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-gray-500' />
          ) : (
            reactionTypes.find((r) => r.name === userReaction)?.icon || (
              <AiOutlineLike size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className='text-blue-500' />
            )
          )}
        </ReactionButton>
      )}

      {/* Reaction panel */}
      {showReactionPanel && (
        <ReactionPanel ref={reactionPanelRef} onMouseEnter={handleReactionHover} onMouseLeave={handleReactionLeave}>
          {reactionTypes.map((reaction) => (
            <Tooltip key={reaction.name} title={reaction.name} placement='top'>
              <ReactionOption active={userReaction === reaction.name} onClick={() => handleReaction(reaction.name)}>
                {reaction.icon}
              </ReactionOption>
            </Tooltip>
          ))}
        </ReactionPanel>
      )}

      {/* Reactions modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        title='Reactions'
        width={400}
        centered
      >
        {loading ? (
          <div className='flex justify-center items-center h-32'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500'></div>
          </div>
        ) : (
          <>
            {reactions.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-gray-500'>No reactions yet</p>
              </div>
            ) : (
              <Tabs defaultActiveKey='All'>
                <TabPane tab={<span>All ({reactions.length})</span>} key='All'>
                  {reactions.map((reaction) => {
                    const reactionType = reaction.type?.toString() || '1'
                    const reactionName = getReactionTypeFromNumber(reactionType)
                    const reactionObj = reactionTypes.find((r) => r.name === reactionName)

                    return (
                      <div key={reaction.id} className='flex items-center py-2 border-b border-gray-100'>
                        <UserAvatar
                          src={reaction.userAvatarUrl || reaction.userAvatar}
                          name={reaction.fullName || reaction.userName}
                          size={40}
                        />
                        <div className='flex-1'>
                          <p className='font-medium'>{reaction.fullName || reaction.userName || 'User'}</p>
                        </div>
                        <div className='flex items-center'>
                          {reactionObj?.icon || <AiOutlineLike size={16} className='text-blue-500' />}
                          <span className={`ml-1 ${reactionObj?.color || 'text-blue-500'}`}>{reactionName}</span>
                        </div>
                      </div>
                    )
                  })}
                </TabPane>

                {/* Reaction type tabs */}
                {Object.entries(getReactionsByType()).map(([type, reactionGroup]) => (
                  <TabPane
                    tab={
                      <div className='flex items-center'>
                        {(() => {
                          // Find the reaction object that corresponds to this type
                          const reactionObj = reactionTypes.find((r) => r.name === type)
                          // Return the icon if found, or a default icon
                          return reactionObj ? (
                            React.cloneElement(reactionObj.icon as React.ReactElement)
                          ) : (
                            <AiFillLike size={16} className='text-blue-500' />
                          )
                        })()}
                        <span className='ml-1'>
                          {type} ({reactionGroup.length})
                        </span>
                      </div>
                    }
                    key={type}
                  >
                    {reactionGroup.map((reaction) => (
                      <div key={reaction.id} className='flex items-center py-2 border-b border-gray-100'>
                        <UserAvatar
                          src={reaction.userAvatarUrl || reaction.userAvatar}
                          name={reaction.fullName || reaction.userName}
                          size={40}
                        />
                        <div className='flex-1'>
                          <p className='font-medium'>{reaction.fullName || reaction.userName || 'User'}</p>
                        </div>
                      </div>
                    ))}
                  </TabPane>
                ))}
              </Tabs>
            )}
          </>
        )}
      </Modal>
    </ReactionContainer>
  )
}

export default ReactionSystem
