import { selectMemberInfo } from '@/store/modules/global/selector'
import { Button, Input, Modal, Select, Space, Table, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineUser } from 'react-icons/ai'

export default function MemberPage() {
  const [searchName, setSearchName] = useState('')
  const [filterType, setFilterType] = useState(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const dataSource = useSelector(selectMemberInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    fetchMembers()
  }, [dispatch])

  const fetchMembers = () => {
    dispatch({ type: 'GET_ALL_MEMBERS', payload: { filterType, name: searchName } })
  }

  const handleSearch = (value) => {
    setSearchName(value)
    fetchMembers()
  }

  const handleFilterChange = (value) => {
    setFilterType(value === 'select' ? null : value)
    fetchMembers()
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
        <button
          className={`flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold'>Report</span>
        </button>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='flex justify-end items-center mb-4'>
          <Input.Search className='w-1/3 mr-4' placeholder='Search member...' allowClear onSearch={handleSearch} />
          <Select
            defaultValue='select'
            className='w-40'
            onChange={handleFilterChange}
            options={[
              { value: 'select', label: 'Select Filter' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' }
            ]}
          />
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} bordered />
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
