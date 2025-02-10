import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { selectMemberAdminInfo } from '@/store/modules/global/selector'
import { Avatar, Button, Select, Space, Table } from 'antd'
import { Input } from 'antd'
import { useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function MemberPage() {
  const [isHovered, setIsHovered] = useState(false)
  const dataSource = useSelector(selectMemberAdminInfo)
  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (status: any) => (
        <Button
          style={{
            backgroundColor: status ? '#84e3b7' : 'white',
            color: status ? 'white' : 'red',
            border: status ? '1px solid green' : '1px solid red'
          }}
        >
          {status ? 'Active' : 'Inactive'}
        </Button>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button danger variant='outlined'>
            <FiTrash2 />
          </Button>
        </Space>
      )
    }
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    console.log(`selected ${value}`)
  }
  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Member</h1>
        <button
          className={`flex items-center bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold'>Report</span>
        </button>
      </div>
      <div className='bg-white p-10 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Input.Search className='w-1/3 mr-4' placeholder='Search' />
          <Select
            defaultValue='newest'
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'newest', label: 'Newest' },
              { value: 'Yiminghe', label: 'yiminghe' }
            ]}
          />
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} />
      </div>
    </>
  )
}
