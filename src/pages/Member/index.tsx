import React from 'react'
import MemberSidebar from '@/layouts/SideBarLayout/MemberSidebar'
import { Outlet } from 'react-router-dom'

export default function Member() {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-gray-800 text-white p-6'>
        <MemberSidebar />
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}
