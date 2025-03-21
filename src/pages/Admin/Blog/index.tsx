import { useEffect, useMemo, useState } from 'react'
import { Button, Input, message, Modal, Table, Tag } from 'antd'
import { FiTrash2 } from 'react-icons/fi'
import { deleteBlog, getAllBlog, updateBlogStatus } from '@/services/blogService'

export default function BlogAdmin() {
  const [loading, setLoading] = useState(false)
  const [blogList, setBlogList] = useState([])
  const memoizedDataSource = useMemo(() => blogList, [blogList])

  const getListBlog = async () => {
    try {
      const res = await getAllBlog()
      console.log('RES', res)
      if (res.success) {
        setBlogList(res.response || [])
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
    }
  }
  useEffect(() => {
    getListBlog()
  }, [])

  const columns = [
    {
      title: 'FullName',
      dataIndex: 'fullName',
      key: 'fullName'
    },

    {
      title: 'PageTitle',
      dataIndex: 'pageTitle',
      key: 'rating'
    },
    {
      title: 'Heading',
      dataIndex: 'heading',
      key: 'heading'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'ShortDescription',
      dataIndex: 'shortDescription',
      key: 'shortDescription'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gray'
        if (status === 'Approved') color = 'green'
        else if (status === 'Rejected') color = 'red'

        return <Tag color={color}>{status}</Tag>
      }
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

  // Handle Delete Blog
  const handleDelete = async (feedbackId: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This feedback will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          await deleteBlog(feedbackId)
          message.success('Feedback deleted successfully')
          await getListBlog()
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
      title: 'Blog Detail',
      content: (
        <div>
          <p>
            <strong>Full Name:</strong> {record.fullName}
          </p>
          <p>
            <strong>Page Title:</strong> {record.pageTitle}
          </p>
          <p>
            <strong>Heading:</strong> {record.heading}
          </p>
          <p>
            <strong>Short Description:</strong> {record.shortDescription}
          </p>
          <p>
            <strong>Content:</strong> {record.content}
          </p>
          <p>
            <strong>Tags:</strong> {record.tags?.map((tag) => tag.name).join(', ') || 'No tags'}
          </p>
        </div>
      ),
      footer: (
        <div className='flex justify-end gap-2'>
          {!record.isApproved && (
            <>
              <Button type='primary' onClick={() => handleApprove(record.id, 'Approved')}>
                Approve
              </Button>
              <Button danger onClick={() => handleApprove(record.id, 'Rejected')}>
                Reject
              </Button>
            </>
          )}
          <Button onClick={() => Modal.destroyAll()}>Close</Button>
        </div>
      ),
      onOk() {}
    })
  }

  const handleApprove = async (blogId: string, status: string) => {
    try {
      await updateBlogStatus(blogId, status)
      message.success('Blog approved successfully')
      getListBlog()
      Modal.destroyAll()
    } catch (error) {
      message.error('Failed to approve blog')
    }
  }

  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Blog</h1>
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
