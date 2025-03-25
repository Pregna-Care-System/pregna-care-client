import { selectTransactionInfo } from '@/store/modules/global/selector'
import { Button, Input, Select, Table } from 'antd'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'

export default function TransactionPage() {
  const dataSource = useSelector(selectTransactionInfo)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_USER_MEMBERSHIP_PLANS' })
  }, [dispatch])

  useEffect(() => {
    setFilteredData(dataSource)
  }, [dataSource])

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

  const handleSearch = () => {
    const filtered = dataSource.filter(
      (item: any) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.membershipPlanName.toLowerCase().includes(searchQuery.toLowerCase())
    ) // search email or plan name
    setFilteredData(filtered)
  }
  
  const handleChange = (value: string) => {
    const currentDate = new Date()
    let filtered = []
    if (value === 'week') {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()) //(Sun)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) //(Sat)

      filtered = dataSource.filter((item: any) => {
        const itemDate = new Date(item.activatedAt)
        return itemDate >= startOfWeek && itemDate <= endOfWeek
      })
    } else if (value === 'month') {
      filtered = dataSource.filter((item: any) => {
        const itemDate = new Date(item.activatedAt)
        return itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear()
      })
    } else if (value === 'year') {
      filtered = dataSource.filter((item: any) => {
        const itemDate = new Date(item.activatedAt)
        return itemDate.getFullYear() === currentDate.getFullYear()
      })
    } else {
      filtered = dataSource // Default: show all data
    }

    setFilteredData(filtered)
  }
  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Transaction</h1>
      </div>
      <div className='bg-white p-10 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Input
            className='w-1/4 mr-4'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            allowClear
            placeholder='Search'
          />
          <button className='text-gray-500 rounded-lg mr-5' onClick={handleSearch}>
            <FaSearch />
          </button>
          <Select
            defaultValue=''
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: '', label: 'All' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'year', label: 'This Year' }
            ]}
          />
        </div>
        <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 8 }} />
      </div>
    </>
  )
}
