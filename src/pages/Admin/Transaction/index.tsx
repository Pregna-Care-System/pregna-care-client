import { selectTransactionInfo } from '@/store/modules/global/selector'
import { Avatar, Button, Input, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

export default function TransactionPage() {
  const [isHovered, setIsHovered] = useState(false)
  const dataSource = useSelector(selectTransactionInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_USER_MEMBERSHIP_PLANS' })
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
      title: 'Type Membership plans',
      dataIndex: 'membershipPlanName',
      key: 'membershipPlanName'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Date make transactions',
      dataIndex: 'activatedAt',
      key: 'activatedAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (isActive: any) => (
        <Button
          style={{
            backgroundColor: isActive ? '#84e3b7' : 'white',
            color: isActive ? 'white' : 'red',
            border: isActive ? '1px solid green' : '1px solid red'
          }}
        >
          {isActive ? 'Active' : 'IsActive'}
        </Button>
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
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Transaction</h1>
        <button
          className={`flex items-center bg-white px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FiDownload className='w-5 h-5 text-red-500 mr-2' />
          <span className='text-red-500 font-semibold'> Report</span>
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
