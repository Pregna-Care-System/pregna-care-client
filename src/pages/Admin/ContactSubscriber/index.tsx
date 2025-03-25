import { useEffect, useState } from 'react'
import { Button, Input, message, Modal, Table } from 'antd'
import { FiTrash2 } from 'react-icons/fi'
import { deleteContact, getAllContact } from '@/services/contactService'
import { FaSearch } from 'react-icons/fa'

export default function ContactAdminPage() {
  const [contactList, setContactList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const getListContact = async () => {
    const res = await getAllContact()
    if (res.status === 200) {
      if (res.data.success && res.data.response) {
        setContactList(res.data.response)
      }
    }
  }

  useEffect(() => {
    getListContact()
  }, [])

  useEffect(() => {
    setFilteredData(contactList)
  }, [contactList])

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
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button danger onClick={() => handleDelete(record.email)}>
            <FiTrash2 />
          </Button>
        </div>
      )
    }
  ]

  const handleDelete = async (email: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This contact subscriber will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          await deleteContact(email)
          message.success('Delete successfully')
          setContactList((prevList) => prevList.filter((item) => item.email !== email))
          setFilteredData((prevList) => prevList.filter((item) => item.email !== email))
        } catch (error) {
          message.error('Failed to delete')
        } finally {
          setLoading(false)
        }
      }
    })
  }
  const handleSearch = () => {
    const filtered = contactList.filter(
      (item: any) => item.email.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by 'email'
    )
    setFilteredData(filtered)
  }
  return (
    <div>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Contact Subscriber</h1>
      </div>
      <div className='bg-white p-5 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5 '>
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
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
          locale={{
            emptyText: 'No contact data available.'
          }}
        />
      </div>
    </div>
  )
}
