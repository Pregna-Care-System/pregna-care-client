import { useEffect, useMemo, useState } from 'react'
import { Button, Input, message, Modal, Table, Tag, Descriptions, Typography } from 'antd'
import { FiTrash2 } from 'react-icons/fi'
import { deleteBlog, getAllBlogAdmin, updateBlogStatus } from '@/services/blogService'
import { FaSearch } from 'react-icons/fa'

export default function BlogAdmin() {
  const [loading, setLoading] = useState(false)
  const [blogList, setBlogList] = useState([])
  const memoizedDataSource = useMemo(() => blogList, [blogList])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const { Paragraph } = Typography

  const getListBlog = async () => {
    try {
      const res = await getAllBlogAdmin('blog')
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

  useEffect(() => {
    setFilteredData(memoizedDataSource)
  }, [memoizedDataSource])

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
      key: 'content',
      render: (content: string) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true }}>{content}</Paragraph>
      )
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
      content: 'This blog will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          await deleteBlog(feedbackId)
          message.success('Blog deleted successfully')
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
      title: <span className='text-[#ff6b81] text-2xl font-semibold'>Blog Detail</span>,
      width: 700,
      content: (
        <Descriptions bordered column={1} size='middle'>
          <Descriptions.Item label='Full Name'>{record.fullName}</Descriptions.Item>
          <Descriptions.Item label='Page Title'>
            <Paragraph strong>{record.pageTitle}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label='Heading'>
            <Paragraph strong>{record.heading}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label='Short Description'>
            <Paragraph>{record.shortDescription}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label='Content'>
            <Paragraph ellipsis={{ rows: 3, expandable: true }}>{record.content}</Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label='Tags'>
            {record.tags?.length
              ? record.tags.map((tag) => (
                  <Tag key={tag.name} color='blue'>
                    {tag.name}
                  </Tag>
                ))
              : 'No tags'}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={record.status === 'Approved' ? 'green' : record.status === 'Rejected' ? 'red' : 'gray'}>
              {record.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ),
      footer: (
        <div className='flex justify-end gap-2'>
          {!record.isApproved && (
            <>
              <Button
                type='primary'
                className='bg-[#ff6b81] border-none'
                onClick={() => handleApprove(record.id, 'Approved')}
              >
                Approve
              </Button>
              <Button danger className='border' onClick={() => handleApprove(record.id, 'Rejected')}>
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

  const handleSearch = () => {
    const filtered = memoizedDataSource.filter(
      (item: any) => item.pageTitle.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by 'papeTitle'
    )
    setFilteredData(filtered)
  }

  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Blog</h1>
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
        <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 5 }} loading={loading} />
      </div>
    </>
  )
}
