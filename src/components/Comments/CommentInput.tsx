import React, { useState } from 'react'

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>
  placeholder?: string
  initialValue?: string
  submitting?: boolean
  buttonText?: string
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'Add a comment...',
  initialValue = '',
  submitting = false,
  buttonText = 'Post'
}) => {
  const [text, setText] = useState(initialValue)

  const handleSubmit = async () => {
    if (text.trim() === '') return
    await onSubmit(text)
    setText('')
  }

  return (
    <div className='flex items-center p-3 border-t'>
      <input
        type='text'
        placeholder={placeholder}
        className='flex-1 border-none focus:outline-none'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !submitting) {
            handleSubmit()
          }
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || submitting}
        className={`font-semibold ${!text.trim() || submitting ? 'text-blue-300' : 'text-blue-500'}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default CommentInput
