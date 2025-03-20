import { Bot } from 'lucide-react'

export default function ChatMessage({ chat }) {
  return (
    <div className={`flex m-3 ${chat.role === 'mode' ? 'justify-start' : 'justify-end'} my-2`}>
      {chat.role === 'mode' && <Bot className='text-gray-500 mt-3' size={20} />}
      <p
        className={`p-2 rounded-lg max-w-xs ${
          chat.role === 'mode' ? 'bg-gray-100 text-gray-700 text-sm p-2 rounded-lg' : 'bg-blue-400 text-white text-sm'
        }`}
      >
        {chat.text}
      </p>
    </div>
  )
}
