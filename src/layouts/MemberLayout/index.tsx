import MemberSidebar from '@components/Sidebar/MemberSidebar'
import { Avatar } from 'antd'

export default function MemberLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 text-white p-6'>
        <MemberSidebar />
      </div>
      <div className='flex-1 p-8'>
        <div className='flex justify-end items-center mb-10'>
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
        {children}
      </div>
    </div>
  )
}
