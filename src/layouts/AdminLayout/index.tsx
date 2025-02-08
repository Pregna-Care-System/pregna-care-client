import AdminSidebar from '@/components/Sidebar/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-gray-800 text-white p-6'>
        <AdminSidebar />
      </div>
      {children}
    </div>
  )
}
