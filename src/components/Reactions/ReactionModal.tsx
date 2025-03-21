import React from 'react'
import { Modal, Tabs } from 'antd'
import { FaRegLaughBeam, FaRegSadTear, FaRegAngry, FaHeart, FaRegSurprise } from 'react-icons/fa'
import { AiFillLike } from 'react-icons/ai'
import { MdClose } from 'react-icons/md'

const { TabPane } = Tabs

interface ReactionsModalProps {
  visible: boolean
  onClose: () => void
  reactions: any[]
  loading: boolean
  post: any
}

const ReactionsModal: React.FC<ReactionsModalProps> = ({ visible, onClose, reactions, loading, post }) => {
  const getReactionTypeFromNumber = (type: string) => {
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

  const getReactionsByType = () => {
    const reactionsByType: Record<string, any[]> = {}

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

  const getReactionIcon = (reactionName: string) => {
    switch (reactionName) {
      case 'Like':
        return <AiFillLike className='text-blue-500' />
      case 'Love':
        return <FaHeart className='text-red-500' />
      case 'Haha':
        return <FaRegLaughBeam className='text-yellow-500' />
      case 'Wow':
        return <FaRegSurprise className='text-yellow-500' />
      case 'Sad':
        return <FaRegSadTear className='text-yellow-500' />
      case 'Angry':
        return <FaRegAngry className='text-orange-500' />
      default:
        return <AiFillLike className='text-blue-500' />
    }
  }

  const reactionsByType = getReactionsByType()

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      title={
        <div className='flex items-center'>
          <span className='font-medium'>Reactions</span>
          {post && <span className='text-gray-500 text-sm ml-2'>- {post.fullName}'s post</span>}
        </div>
      }
      width={400}
      centered
      bodyStyle={{ maxHeight: '60vh', overflow: 'auto' }}
      closeIcon={<MdClose />}
    >
      {loading ? (
        <div className='flex justify-center items-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500'></div>
        </div>
      ) : (
        <>
          {reactions.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>No reactions yet</div>
          ) : (
            <>
              <div className='text-sm text-gray-500 mb-4'>
                {reactions.length} {reactions.length === 1 ? 'person' : 'people'} reacted to this post
              </div>

              <Tabs defaultActiveKey='All'>
                <TabPane tab='All' key='All'>
                  <div className='space-y-3 max-h-[40vh] overflow-y-auto py-2'>
                    {reactions.map((reaction) => (
                      <div key={reaction.id} className='flex items-center px-2 py-1 hover:bg-gray-50 rounded'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 mr-3'>
                          {getReactionIcon(getReactionTypeFromNumber(reaction.type))}
                        </div>
                        <div className='flex-1'>
                          <p className='font-medium'>{reaction.fullName || 'User'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabPane>

                {Object.entries(reactionsByType).map(([reactionName, reactionList]) => (
                  <TabPane
                    tab={
                      <div className='flex items-center space-x-1'>
                        {getReactionIcon(reactionName)}
                        <span>{reactionList.length}</span>
                      </div>
                    }
                    key={reactionName}
                  >
                    <div className='space-y-3 max-h-[40vh] overflow-y-auto py-2'>
                      {reactionList.map((reaction) => (
                        <div key={reaction.id} className='flex items-center px-2 py-1 hover:bg-gray-50 rounded'>
                          <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 mr-3'>
                            {getReactionIcon(reactionName)}
                          </div>
                          <div className='flex-1'>
                            <p className='font-medium'>{reaction.fullName || 'User'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </>
          )}
        </>
      )}
    </Modal>
  )
}

export default ReactionsModal
