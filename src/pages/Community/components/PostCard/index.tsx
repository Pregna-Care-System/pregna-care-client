import type React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Popconfirm } from 'antd'
import { postBlogView } from '@/services/blogService'
import TagDisplay from '../TagDisplay'
import ReactionSystem from '../ReactionSystem'
import CommentSystem from '../CommentSystem'
import ContentFormatter from '../ContentFormatter'
import ROUTES from '@/utils/config/routes'
import { MoreHorizontal, MessageCircle, Edit, Trash2, BarChartIcon as ChartBar } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color?: string
}

interface BlogPost {
  id: string
  pageTitle?: string
  content?: string
  shortDescription?: string
  type?: string
  userId: string
  fullName: string
  userAvatarUrl?: string
  timeAgo: string
  location?: string
  images?: string[]
  likes?: number
  comments?: number
  hashtags?: string[]
  sharedChartData?: string
  tags?: Tag[]
  blogTags?: { tag: Tag }[]
  userReaction?: string
  reactions?: {
    type: string
    count: number
  }[]
  reactionsCount?: number
}

interface PostCardProps {
  post: BlogPost
  currentUser: any
  onEdit: (post: BlogPost) => void
  onDelete: (postId: string) => void
  className?: string
}

const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

const UserProfile = styled.div`
  display: flex;
  align-items: center;
`

const Avatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const UserDetails = styled.div`
  margin-left: 0.75rem;
`

const UserName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
`

const UserLocation = styled.span`
  margin-left: 0.5rem;
  font-weight: normal;
  color: #6b7280;
  font-size: 0.875rem;
`

const PostTime = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
`

const OptionsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`

const OptionsMenu = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.25rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 20;
  width: 12rem;
  padding: 0.5rem 0;
  overflow: hidden;
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &.delete {
    color: #ef4444;
  }

  &.delete:hover {
    background-color: #fef2f2;
  }
`

const MenuItemIcon = styled.span`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  color: inherit;
`

const PostContent = styled.div`
  margin-top: 1rem;
  color: #374151;
  font-size: 1rem;
  line-height: 1.5;
`

const ChartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fee2e2;
    text-decoration: none;
    transform: translateY(-1px);
  }

  svg {
    margin-right: 0.5rem;
  }
`

const TagsContainer = styled.div`
  margin-top: 1rem;
`

const PostImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
`

const ActionBar = styled.div`
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

const ActionButtons = styled.div`
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f3f4f6;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #4b5563;
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: #f9fafb;
    color: #111827;
  }

  svg {
    margin-right: 0.5rem;
  }
`

const PostCard = ({ post, currentUser, onEdit, onDelete, className }: PostCardProps) => {
  const [showPostMenu, setShowPostMenu] = useState(false)
  const [popconfirmVisible, setPopconfirmVisible] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // Extract tags from either tags or blogTags property
  const displayTags = post.tags || post.blogTags?.map((bt) => bt.tag) || []

  // Determine if current user is the post creator
  const isPostCreator = currentUser?.id === post.userId

  // Handle post edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onEdit(post)
    setShowPostMenu(false)
  }

  // Handle post delete click
  const handleDeleteClick = () => {
    onDelete(post.id)
    setShowPostMenu(false)
    setPopconfirmVisible(false)
  }

  // Navigate to post detail page when clicking on comment or view more
  const navigateToPostDetail = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault()
    try {
      // Call the postBlogView API when navigating to post details
      await postBlogView(postId)
      // Navigate to the post detail page using window.location
      window.location.href = `${ROUTES.COMMUNITY}/${postId}`
    } catch (error) {
      console.error('Error recording post view:', error)
      // Still navigate even if view recording fails
      window.location.href = `${ROUTES.COMMUNITY}/${postId}`
    }
  }

  // Add a handler for comment count changes
  const handleCommentCountChange = (count: number) => {
    setCommentCount(count)
  }

  return (
    <Card className={className}>
      {/* Post header */}
      <CardHeader>
        <UserInfo>
          <UserProfile>
            <Avatar
              src={post.userAvatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'}
              alt={`${post.fullName}'s avatar`}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.onerror = null
                target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
              }}
            />
            <UserDetails>
              <UserName>
                {post.fullName || 'Community Member'}
                {post.location && <UserLocation>at {post.location}</UserLocation>}
              </UserName>
              <PostTime>
                <span>{post.timeAgo}</span>
                <span className='mx-1'>·</span>
                <span>🌐</span>
              </PostTime>
            </UserDetails>
          </UserProfile>
          <div className='relative'>
            <OptionsButton onClick={() => setShowPostMenu(!showPostMenu)}>
              <MoreHorizontal size={20} />
            </OptionsButton>

            {/* Post options menu */}
            {showPostMenu && (
              <OptionsMenu>
                {isPostCreator ? (
                  <>
                    <MenuItem onClick={handleEditClick}>
                      <MenuItemIcon>
                        <Edit size={16} />
                      </MenuItemIcon>
                      Edit Post
                    </MenuItem>
                    <Popconfirm
                      title='Delete post'
                      description='Are you sure you want to delete this post?'
                      open={popconfirmVisible}
                      onConfirm={handleDeleteClick}
                      okText='Yes'
                      cancelText='No'
                      okButtonProps={{ style: { backgroundColor: '#EF4444', borderColor: '#EF4444' } }}
                      onCancel={() => setPopconfirmVisible(false)}
                    >
                      <MenuItem
                        className='delete'
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setPopconfirmVisible(true)
                        }}
                      >
                        <MenuItemIcon>
                          <Trash2 size={16} />
                        </MenuItemIcon>
                        Delete Post
                      </MenuItem>
                    </Popconfirm>
                  </>
                ) : (
                  <div className='px-4 py-2 text-sm text-gray-500'>No actions available</div>
                )}
              </OptionsMenu>
            )}
          </div>
        </UserInfo>

        {/* Post content */}
        <Link
          to={`${ROUTES.COMMUNITY}/${post.id}`}
          className='block hover:no-underline'
          onClick={(e) => navigateToPostDetail(e, post.id)}
        >
          <PostContent>
            <ContentFormatter content={post.content || post.shortDescription || ''} />
          </PostContent>
        </Link>

        {post.type === 'chart' || post.sharedChartData ? (
          <ChartButton
            to={`${ROUTES.COMMUNITY}/${post.id}`}
            onClick={(e) => {
              e.stopPropagation()
              postBlogView(post.id)
            }}
          >
            <ChartBar size={18} />
            View Chart
          </ChartButton>
        ) : null}

        {/* Post tags */}
        {displayTags.length > 0 && (
          <TagsContainer>
            <TagDisplay tags={displayTags} maxVisible={3} size='small' />
          </TagsContainer>
        )}
      </CardHeader>

      {/* {post.images && post.images.length > 0 && (
        <PostImage src={Array.isArray(post.images) ? post.images[0] : post.images} alt={`Post by ${post.fullName}`} />
      )} */}

      {post.featuredImageUrl && <PostImage src={post.featuredImageUrl} alt={`Post by ${post.fullName}`} />}

      {/* Reaction count */}
      <ActionBar>
        <ReactionSystem
          postId={post.id}
          currentUserId={currentUser?.id}
          initialCount={post.reactionsCount || post.likes || 0}
          initialUserReaction={post.userReaction || ''}
          displayMode='counter'
          size='small'
        />
      </ActionBar>

      {/* Action buttons */}
      <ActionButtons>
        <ReactionSystem
          postId={post.id}
          currentUserId={currentUser?.id}
          initialUserReaction={post.userReaction || ''}
          displayMode='button'
        />

        <ActionButton
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowCommentModal(true)
          }}
        >
          <MessageCircle size={18} />
          <span>Comment {commentCount > 0 ? `(${commentCount})` : ''}</span>
        </ActionButton>
      </ActionButtons>
      {/* Add the CommentSystem modal */}
      <CommentSystem
        postId={post.id}
        currentUser={currentUser}
        modalMode={true}
        isVisible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onCommentCountChange={handleCommentCountChange}
      />
    </Card>
  )
}

export default PostCard
