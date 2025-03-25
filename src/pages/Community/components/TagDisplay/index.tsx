import { useState } from 'react'
import styled from 'styled-components'

interface Tag {
  id: string
  name: string
  color?: string
}

interface TagDisplayProps {
  tags: Tag[]
  maxVisible?: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const TagBase = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  align-items: center;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 9999px;
  transition: all 0.2s ease;
  cursor: default;
  max-width: ${(props) => (props.size === 'small' ? '120px' : '150px')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: #fee2e2;
    transform: translateY(-1px);
  }

  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: 2px 8px;
          font-size: 0.75rem;
        `
      case 'large':
        return `
          padding: 6px 12px;
          font-size: 1rem;
        `
      default:
        return `
          padding: 4px 10px;
          font-size: 0.875rem;
        `
    }
  }}
`

const TagDot = styled.span<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${(props) => (props.size === 'small' ? '6px' : props.size === 'large' ? '8px' : '6px')};
  height: ${(props) => (props.size === 'small' ? '6px' : props.size === 'large' ? '8px' : '6px')};
  border-radius: 50%;
  background-color: #ef4444;
  margin-right: ${(props) => (props.size === 'small' ? '4px' : '6px')};
  display: inline-block;
`

const ToggleButton = styled.button<{ size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  color: #4b5563;
  border-radius: 9999px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: #e5e7eb;
    transform: translateY(-1px);
  }

  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: 2px 8px;
          font-size: 0.75rem;
        `
      case 'large':
        return `
          padding: 6px 12px;
          font-size: 1rem;
        `
      default:
        return `
          padding: 4px 10px;
          font-size: 0.875rem;
        `
    }
  }}
`

const TagDisplay = ({ tags, maxVisible = 3, size = 'medium', className }: TagDisplayProps) => {
  const [showAllTags, setShowAllTags] = useState(false)

  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <TagContainer className={className}>
      {tags.length <= maxVisible || showAllTags ? (
        // Show all tags if there are fewer than maxVisible or if showAllTags is true
        <>
          {tags.map((tag) => (
            <TagBase key={tag.id} size={size} title={tag.name}>
              <TagDot size={size} />
              {tag.name}
            </TagBase>
          ))}
          {showAllTags && tags.length > maxVisible && (
            <ToggleButton
              size={size}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowAllTags(false)
              }}
            >
              Show less
            </ToggleButton>
          )}
        </>
      ) : (
        // Show first (maxVisible - 1) tags and a count for the rest
        <>
          {tags.slice(0, maxVisible - 1).map((tag) => (
            <TagBase key={tag.id} size={size} title={tag.name}>
              <TagDot size={size} />
              {tag.name}
            </TagBase>
          ))}
          <ToggleButton
            size={size}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowAllTags(true)
            }}
            title={tags
              .slice(maxVisible - 1)
              .map((tag) => tag.name)
              .join(', ')}
          >
            +{tags.length - (maxVisible - 1)} more
          </ToggleButton>
        </>
      )}
    </TagContainer>
  )
}

export default TagDisplay
