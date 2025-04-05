import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

interface UserAvatarProps {
  src?: string | null
  name?: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function UserAvatar({ src, name, size = 40, className = '', style = {} }: UserAvatarProps) {
  // Default image from your codebase
  const defaultImageUrl =
    'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'

  // Function to get initials from name
  const getInitials = (name?: string): string => {
    if (!name) return ''
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (src) {
    return (
      <Avatar
        size={size}
        src={src}
        className={className}
        style={{
          border: '2px solid #ff6b81',
          objectFit: 'cover',
          ...style
        }}
      />
    )
  }

  // If name is provided but no image, show initials
  if (name) {
    return (
      <Avatar
        size={size}
        className={className}
        style={{
          backgroundColor: '#ff6b81',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #ff6b81',
          ...style
        }}
      >
        {getInitials(name)}
      </Avatar>
    )
  }

  // Fallback to default image
  return (
    <Avatar
      size={size}
      src={defaultImageUrl}
      icon={<UserOutlined />}
      className={className}
      style={{
        border: '2px solid #ff6b81',
        ...style
      }}
    />
  )
}
