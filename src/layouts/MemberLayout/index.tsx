import ChatBot from '@/components/Chat'
import MemberSidebar from '@components/Sidebar/MemberSidebar'
import { Avatar } from 'antd'

export default function MemberLayout({ children }) {
  return (
    <div className='flex'>
      <div className='w-64 text-white p-6'>
        <MemberSidebar />
      </div>
      <div className='flex-1 bg-white'>
        <div className=' flex justify-end items-center px-6 py-4'>
          <h4 className='px-2 border-s-2 border-gray-300'>
            Hello, <strong>Username</strong>
          </h4>
          <div>
            <Avatar
              size={50}
              src={'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'}
            />
          </div>
        </div>
        <div className='p-4 bg-gray-100 min-h-screen'>{children}</div>
        <ChatBot />
      </div>
    </div>
  )
}
