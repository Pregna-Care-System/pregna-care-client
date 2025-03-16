import { useEffect, useMemo, useState } from 'react'
import { Button, Input, message, Modal, Table } from 'antd'
import { FiTrash2 } from 'react-icons/fi'
import { deleteFeedBack, getAllFeedBack } from '@/services/feedbackService'

export default function FeedBack() {
  const [loading, setLoading] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])
  const memoizedDataSource = useMemo(() => feedbackList, [feedbackList])

  // Fetch Feedback List
  const getListFeedback = async () => {
    try {
      const res = await getAllFeedBack()
      if (res?.status === 200) {
        setFeedbackList(res.data.response || [])
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }

  useEffect(() => {
    getListFeedback()
  }, [])

  const columns = [
    {
      title: 'User Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button onClick={() => handleViewDetail(record)}>View Detail</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            <FiTrash2 />
          </Button>
        </div>
      )
    }
  ]

  // Handle Delete Feedback
  const handleDelete = async (feedbackId: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This feedback will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          const success = await deleteFeedBack(feedbackId)
          if (success) {
            message.success('Feedback deleted successfully')
            getListFeedback()
          } else {
            message.error('Failed to delete feedback')
          }
        } catch (error) {
          message.error('Failed to delete')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // Handle View Detail
  const handleViewDetail = (record: any) => {
    Modal.info({
      title: 'Feedback Detail',
      content: (
        <div>
          <p>
            <strong>User Email:</strong> {record.email}
          </p>
          <p>
            <strong>Content:</strong> {record.content}
          </p>
          <p>
            <strong>Rating:</strong> {record.rating}
          </p>
        </div>
      ),
      onOk() {}
    })
  }

  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Feedback</h1>
      </div>
      <div className='bg-white p-5 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5 '>
          <Input.Search className='w-1/3 mr-4' placeholder='Search' />
        </div>
        <Table dataSource={memoizedDataSource} columns={columns} pagination={{ pageSize: 5 }} loading={loading} />
      </div>
    </>
  )
}
