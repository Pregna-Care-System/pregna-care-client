import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { selectTransactionInfo } from '@/store/modules/global/selector'
import { Avatar, Input, Select, Table } from 'antd'
import { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function TransactionPage() {
  const [isHovered, setIsHovered] = useState(false)
  const dataSource = useSelector(selectTransactionInfo)
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
      title: 'Type Membership plans',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Date make transactions',
      dataIndex: 'date',
      key: 'date'
    }
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    console.log(`selected ${value}`)
  }
  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Transaction</h1>
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
