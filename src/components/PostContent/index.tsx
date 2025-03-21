import React from 'react'

interface PostContentProps {
  content: string
}

const PostContent: React.FC<PostContentProps> = ({ content }) => {
  if (!content) return null

  // If content contains HTML, render it safely
  if (content.includes('<')) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  // Otherwise, handle hashtags
  const parts = content.split(/(#[a-zA-Z0-9_]+)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <span key={index} className='text-blue-500 hover:underline cursor-pointer'>
              {part}
            </span>
          )
        }
        return part
      })}
    </>
  )
}

export default PostContent
