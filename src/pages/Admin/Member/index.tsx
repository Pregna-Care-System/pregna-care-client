import { selectMemberInfo } from '@/store/modules/global/selector'
import { Button, Select, Space, Table } from 'antd'
import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

export default function MemberPage() {
  const [isHovered, setIsHovered] = useState(false)
  const dataSource = useSelector(selectMemberInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERS' })
  }, [dispatch])

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
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Status',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (status: any) => (
        <Button
          style={{
            backgroundColor: status ? 'white' : '#84e3b7',
            color: status ? 'red' : 'white',
            border: status ? '1px solid red' : '1px solid green'
          }}
        >
          {status ? 'InActive' : 'Active'}
        </Button>
      )
    },
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
