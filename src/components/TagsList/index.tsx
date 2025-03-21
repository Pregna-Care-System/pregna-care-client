import React, { useState } from 'react'

interface Tag {
  id: string
  name: string
  color?: string
}

interface TagsListProps {
  tags: Tag[]
  maxVisible?: number
  size?: 'small' | 'medium' | 'large'
}

const TagsList: React.FC<TagsListProps> = ({ tags, maxVisible = 3, size = 'medium' }) => {
  const [showAllTags, setShowAllTags] = useState(false)

  if (!tags || tags.length === 0) return null

  // Determine size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-xs max-w-[120px]',
    medium: 'px-3 py-1 text-sm max-w-[150px]',
    large: 'px-4 py-2 text-base max-w-[180px]'
  }

  const dotSize = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2 h-2',
    large: 'w-2.5 h-2.5'
  }

  const sizePadding = {
    small: 'px-2 py-1',
    medium: 'px-3 py-1',
    large: 'px-3 py-2'
  }

  return (
    <div className='flex flex-wrap gap-1'>
      {tags.length <= maxVisible || showAllTags ? (
        // Show all tags if there are fewer than maxVisible or if showAllTags is true
        <>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center bg-pink-50 text-pink-600 rounded-full truncate ${sizeClasses[size]}`}
              title={tag.name}
            >
              <span className={`${dotSize[size]} rounded-full bg-pink-400 mr-1`}></span>
              {tag.name}
            </span>
          ))}
          {showAllTags && tags.length > maxVisible && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowAllTags(false)
              }}
              className={`inline-flex items-center bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 ${sizePadding[size]}`}
            >
              Show less
            </button>
          )}
        </>
      ) : (
        // Show first (maxVisible-1) tags and a count for the rest
        <>
          {tags.slice(0, maxVisible - 1).map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center bg-pink-50 text-pink-600 rounded-full truncate ${sizeClasses[size]}`}
              title={tag.name}
            >
              <span className={`${dotSize[size]} rounded-full bg-pink-400 mr-1`}></span>
              {tag.name}
            </span>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowAllTags(true)
            }}
            className={`inline-flex items-center bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 ${sizePadding[size]}`}
            title={tags
              .slice(maxVisible - 1)
              .map((tag) => tag.name)
              .join(', ')}
          >
            +{tags.length - (maxVisible - 1)} more
          </button>
        </>
      )}
    </div>
  )
}

export default TagsList
