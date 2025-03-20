import { Bot } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ChatForm from './ChatForm'
import ChatMessage from './ChatMessage'

export default function ChatBot() {
  const [isOpenChat, setIsOpenChat] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const chatBodyRef = useRef(null)
  //helper function to update chat history
  const updateHistory = (text) => {
    setChatHistory((prev) => [...prev.filter((msg) => msg.text !== 'Thinking...'), { role: 'mode', text }])
  }

  const generateChatResponse = async (history) => {
    // Format chat history for API request
    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }]
    }))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: formattedHistory })
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error?.message || 'Something went wrong')

      console.log('Data', data)

      // Get bot response safely
      const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No response'

      updateHistory(apiResponseText)
    } catch (error) {
      console.error('Error fetching chat response:', error)
    }
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatHistory])

  const toggleChat = () => {
    setIsOpenChat(!isOpenChat)
  }
  return (
    <div>
      <div className='fixed bottom-8 right-8 cursor-pointer' onClick={toggleChat}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 1024 1024'
          fill='currentColor'
          className='text-black hover:text-blue-600 transition-colors'
        >
          <path d='M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z'></path>
        </svg>
      </div>

      {isOpenChat && (
        <div className='fixed bottom-24 right-8 w-80 bg-white border-2 border-grey-200 shadow-lg rounded-lg bl-4 br-4 z-10'>
          <div className='flex justify-center gap-2 items-center mb-4 bg-blue-100 p-4 border rounded-md'>
            <Bot
              style={{
                color: 'white',
                backgroundColor: 'black',
                border: '2px solid black',
                padding: '4px',
                borderRadius: '50%'
              }}
              size={34}
            />
            <h3 className='font-bold text-lg'>Chat with us</h3>
            <button onClick={toggleChat} className='text-gray-500 hover:text-gray-700 ml-auto'>
              ✕
            </button>
          </div>
          <div ref={chatBodyRef} className='h-64 overflow-y-auto mb-4'>
            <div className='text-sm flex items-start gap-2 ml-3'>
              <Bot className='text-gray-500 mt-3' size={20} />
              <p className='bg-gray-100 p-2 rounded-lg'>Hello! How can we help you?</p>
            </div>
            <div>
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>
          </div>
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateChatResponse={generateChatResponse}
          />
        </div>
      )}
    </div>
  )
}
