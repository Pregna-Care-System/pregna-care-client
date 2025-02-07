import MemberSidebar from '@components/Sidebar/MemberSidebar'

export default function MemberLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 text-white p-6'>
        <MemberSidebar />
      </div>
      <div className='flex-1'>{children}</div>
    </div>
  )
}
