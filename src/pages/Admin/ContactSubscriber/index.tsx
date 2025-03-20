import { useEffect, useState } from 'react'
import { Button, message, Modal, Table } from 'antd'
import { FiTrash2 } from 'react-icons/fi'
import { deleteContact, getAllContact } from '@/services/contactService'

export default function ContactAdminPage() {
  const [contactList, setContactList] = useState([])
  const [loading, setLoading] = useState(false)

  const getListContact = async () => {
    setLoading(true)
    try {
      const res = await getAllContact()
      if (res.status === 200) {
        if (res.data.success && res.data.response) {
          setContactList(res.data.response)
        }
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Failed to fetch contacts.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListContact()
  }, [])

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
          await getListContact()
        } catch (error) {
          message.error('Failed to delete')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  return (
    <div>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Contact Subscriber</h1>
      </div>
      <div className='bg-white p-5 rounded-xl shadow-md'>
        <Table
          dataSource={contactList}
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
