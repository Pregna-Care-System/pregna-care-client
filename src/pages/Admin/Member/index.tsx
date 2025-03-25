import { selectMemberInfo } from '@/store/modules/global/selector'
import { Button, Input, Modal, Select, Space, Table, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineUser } from 'react-icons/ai'
import { FaSearch } from 'react-icons/fa'

export default function MemberPage() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const dataSource = useSelector(selectMemberInfo)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    fetchMembers()
  }, [dispatch])

  useEffect(() => {
    setFilteredData(dataSource)
  }, [dataSource])

  const fetchMembers = () => {
    dispatch({ type: 'GET_ALL_MEMBERS', payload: { filteredData, name: searchQuery } })
  }

  const uniqueWeeks = Array.from(new Set(dataSource.map((item: any) => item.week)))
    .sort((a, b) => a - b) // Sort by order
    .map((week) => ({
      value: week,
      label: `Week ${week}`
    }))

  const handleSearch = () => {
    const filtered = dataSource.filter(
      (item: any) => item.email.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by 'email'
    )
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
        const itemDate = new Date(item.planCreated)
        return itemDate >= startOfWeek && itemDate <= endOfWeek
      })
    } else if (value === 'month') {
      filtered = dataSource.filter((item: any) => {
        const itemDate = new Date(item.planCreated)
        return itemDate.getMonth() === currentDate.getMonth() && itemDate.getFullYear() === currentDate.getFullYear()
      })
    } else if (value === 'year') {
      filtered = dataSource.filter((item: any) => {
        const itemDate = new Date(item.planCreated)
        return itemDate.getFullYear() === currentDate.getFullYear()
      })
    } else {
      filtered = dataSource // Default: show all data
    }

    setFilteredData(filtered)
  }
  const handleViewDetail = (member) => {
    setSelectedMember(member)
    setIsModalVisible(true)
  }
  const handleModalClose = () => {
    setIsModalVisible(false)
    setSelectedMember(null)
  }
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
      dataIndex: 'isActive',
      key: 'isActive',
      render: (status) => (
        <Tooltip title={status ? 'Active' : 'InActive'}>
          {status ? (
            <AiOutlineCheckCircle className='text-green-500 text-xl' />
          ) : (
            <AiOutlineCloseCircle className='text-red-500 text-xl' />
          )}
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button type='default' onClick={() => handleViewDetail(record)}>
            View Detail
          </Button>
          <Button danger icon={<FiTrash2 />} />
        </Space>
      )
    }
  ]

  return (
    <div className='p-6   min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Members</h1>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='flex justify-end items-center mb-4'>
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
        <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 8 }} bordered />
      </div>

      <Modal
        title={
          <div className='flex items-center gap-3'>
            <AiOutlineUser className='text-blue-600 text-3xl font-bold' />
            <span className='text-3xl font-semibold text-gray-900'>Member Details</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key='close'
            onClick={handleModalClose}
            className='bg-gray-900 text-white hover:bg-gray-700 px-6 py-2 rounded-lg'
          >
            Close
          </Button>
        ]}
        centered
        width={750}
        className='rounded-lg'
      >
        {selectedMember && (
          <div className='grid grid-cols-2 gap-6 p-4'>
            <div className='border-b pb-2'>
              <p className='font-semibold text-gray-500'>Full Name</p>
              <p className='text-lg font-medium text-gray-800'>{selectedMember.fullName}</p>
            </div>
            <div className='border-b pb-2'>
              <p className='font-semibold text-gray-500'>Email</p>
              <p className='text-lg font-medium text-gray-800'>{selectedMember.email}</p>
            </div>
            <div className='border-b pb-2'>
              <p className='font-semibold text-gray-500'>Phone Number</p>
              <p className='text-lg font-medium text-gray-800'>{selectedMember.phoneNumber}</p>
            </div>
            <div className='border-b pb-2'>
              <p className='font-semibold text-gray-500'>Address</p>
              <p className='text-lg font-medium text-gray-800'>{selectedMember.address}</p>
            </div>
            <div className='border-b pb-2'>
              <p className='font-semibold text-gray-500'>Membership Plan</p>
              <p className='text-lg font-semibold text-green-600'>{selectedMember.planName}</p>
            </div>
            <div className='border border-red-300 rounded-full pb-2 text-center'>
              <p className='font-semibold text-gray-500'>Days Remaining</p>
              <p className='text-lg font-semibold text-red-500'>{selectedMember.remainingDate} days</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
