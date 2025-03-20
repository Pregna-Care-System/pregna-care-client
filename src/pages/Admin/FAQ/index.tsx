import React, { useEffect, useState } from 'react'
import { Button, Form, Input, InputNumber, message, Modal, Space, Table } from 'antd'
import { DeleteOutlined, DownCircleOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import {
  createFAQ,
  createFAQCategory,
  deleteFAQ,
  deleteFAQCategory,
  getAllFAQCategories,
  updateFAQ,
  updateFAQCategory
} from '@/services/faqService'

interface FAQCategory {
  id: string
  name: string
  description: string
  displayOrder: number
  items: FAQ[]
}

interface FAQ {
  id: string
  faqCategoryId: string
  question: string
  answer: string
  displayOrder: string
}

const FAQModal: React.FC<{
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  categoryId: string
  initialData?: FAQ
}> = ({ visible, onClose, onSuccess, categoryId, initialData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (initialData) {
        form.setFieldsValue(initialData)
      }
    }
  }, [visible, initialData, form])

  const handleSubmit = async (values: any) => {
    try {
      if (initialData) {
        await updateFAQ(initialData.id, categoryId, values.question, values.answer, values.displayOrder)
        message.success('FAQ updated successfully')
      } else {
        await createFAQ(categoryId, values.question, values.answer, values.displayOrder)
        message.success('FAQ created successfully')
      }
      onSuccess()
    } catch (error) {
      message.error('Operation failed')
    }
  }

  return (
    <Modal
      title={initialData ? 'Edit FAQ' : 'Add FAQ'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
      width={720}
      className='rounded-xl overflow-hidden'
      modalRender={(modal) => <div className='rounded-xl overflow-hidden'>{modal}</div>}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit} className='pt-4'>
        <Form.Item
          name='question'
          label={<span className='font-medium text-gray-700'>Question</span>}
          rules={[{ required: true, message: 'Please enter the question' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder='Enter your question here'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Form.Item>
        <Form.Item
          name='answer'
          label={<span className='font-medium text-gray-700'>Answer</span>}
          rules={[{ required: true, message: 'Please enter the answer' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder='Enter your answer here'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Form.Item>
        <Form.Item
          name='displayOrder'
          label={<span className='font-medium text-gray-700'>Display Order</span>}
          rules={[{ required: true, message: 'Please enter display order' }]}
        >
          <Input
            type='number'
            placeholder='Enter display order'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const CategoryModal: React.FC<{
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  initialData?: FAQCategory
}> = ({ visible, onClose, onSuccess, initialData }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (initialData) {
        form.setFieldsValue(initialData)
      }
    }
  }, [visible, initialData, form])

  const handleSubmit = async (values: any) => {
    try {
      if (initialData) {
        await updateFAQCategory(initialData.id, values.name, values.description, values.displayOrder)
        message.success('Category updated successfully')
      } else {
        await createFAQCategory(values.name, values.description, values.displayOrder)
        message.success('Category created successfully')
      }
      onSuccess()
    } catch (error) {
      message.error('Operation failed')
    }
  }

  return (
    <Modal
      title={initialData ? 'Edit Category' : 'Add Category'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
      width={600}
      className='rounded-xl overflow-hidden'
      modalRender={(modal) => <div className='rounded-xl overflow-hidden'>{modal}</div>}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit} className='pt-4'>
        <Form.Item
          name='name'
          label={<span className='font-medium text-gray-700'>Name</span>}
          rules={[{ required: true, message: 'Please enter category name' }]}
        >
          <Input
            placeholder='Enter category name'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Form.Item>
        <Form.Item
          name='description'
          label={<span className='font-medium text-gray-700'>Description</span>}
          rules={[{ required: true, message: 'Please enter category description' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder='Enter category description'
            className='rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
          />
        </Form.Item>
        <Form.Item
          name='displayOrder'
          label={<span className='font-medium text-gray-700'>Display Order</span>}
          rules={[{ required: true, message: 'Please enter display order' }]}
        >
          <InputNumber
            min={1}
            className='w-full rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500'
            placeholder='Enter display order'
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const FAQAdmin = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [faqModalVisible, setFaqModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const categoriesResponse = await getAllFAQCategories()
      console.log('Categories:', categoriesResponse)
      setCategories(Array.isArray(categoriesResponse.data.response) ? categoriesResponse.data.response : [])
    } catch (error) {
      message.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteCategory = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteFAQCategory(id)
          message.success('Category deleted successfully')
          fetchData()
        } catch (error) {
          message.error('Failed to delete category')
        }
      }
    })
  }

  const handleDeleteFAQ = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this FAQ?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await deleteFAQ(id)
          message.success('FAQ deleted successfully')
          fetchData()
        } catch (error) {
          message.error('Failed to delete FAQ')
        }
      }
    })
  }

  const columns: ColumnsType<FAQCategory> = [
    {
      title: <span className='font-semibold text-gray-700'>Name</span>,
      dataIndex: 'name',
      key: 'name',
      className: 'text-gray-700'
    },
    {
      title: <span className='font-semibold text-gray-700'>Description</span>,
      dataIndex: 'description',
      key: 'description',
      className: 'text-gray-600',
      ellipsis: true
    },
    {
      title: <span className='font-semibold text-gray-700'>Display Order</span>,
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 120,
      align: 'center',
      className: 'text-gray-600'
    },
    {
      title: <span className='font-semibold text-gray-700'>Actions</span>,
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type='text'
            icon={<EditOutlined className='text-lg' />}
            className='text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 flex items-center justify-center p-0'
            onClick={() => {
              setEditingCategory(record)
              setCategoryModalVisible(true)
            }}
          />
          <Button
            type='text'
            icon={<DeleteOutlined className='text-lg' />}
            className='text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0'
            onClick={() => handleDeleteCategory(record.id)}
          />
        </Space>
      )
    }
  ]

  const expandedRowRender = (category: FAQCategory) => {
    const categoryFaqs = Array.isArray(category.items) ? category.items : []
    const columns: ColumnsType<FAQ> = [
      {
        title: <span className='font-semibold text-gray-700'>Question</span>,
        dataIndex: 'question',
        key: 'question',
        className: 'text-gray-700'
      },
      {
        title: <span className='font-semibold text-gray-700'>Answer</span>,
        dataIndex: 'answer',
        key: 'answer',
        className: 'text-gray-600',
        ellipsis: true
      },
      {
        title: <span className='font-semibold text-gray-700'>Display Order</span>,
        dataIndex: 'displayOrder',
        key: 'displayOrder',
        width: 120,
        align: 'center',
        className: 'text-gray-600'
      },
      {
        title: <span className='font-semibold text-gray-700'>Actions</span>,
        key: 'actions',
        width: 120,
        align: 'center',
        render: (_, record) => (
          <Space>
            <Button
              type='text'
              icon={<EditOutlined className='text-lg' />}
              className='text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 flex items-center justify-center p-0'
              onClick={() => {
                setEditingFaq(record)
                setSelectedCategoryId(category.id)
                setFaqModalVisible(true)
              }}
            />
            <Button
              type='text'
              icon={<DeleteOutlined className='text-lg' />}
              className='text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 w-8 flex items-center justify-center p-0'
              onClick={() => handleDeleteFAQ(record.id)}
            />
          </Space>
        )
      }
    ]

    return (
      <div className='p-6 rounded-2xl mt-2'>
        <div className='mb-6 flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-700'>FAQs for {category.name}</h3>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedCategoryId(category.id)
              setFaqModalVisible(true)
            }}
            className='bg-black hover:text-[#ff6b81] border-none shadow-sm h-9'
          >
            Add FAQ
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={categoryFaqs}
          pagination={false}
          rowKey='id'
          className='bg-white rounded-2xl shadow-2xl'
          rowClassName='hover:bg-gray-50 transition-colors'
        />
      </div>
    )
  }

  return (
    <div className='p-8 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>FAQ Management</h1>
          </div>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null)
              setCategoryModalVisible(true)
            }}
            className='bg-white hover:bg-blue-600 rounded-lg text-[#ff6b81] shadow-xl h-10 px-6'
          >
            Add Category
          </Button>
        </div>

        <div className='bg-white rounded-xl shadow-sm'>
          <Table
            columns={columns}
            dataSource={categories}
            expandable={{
              expandedRowRender,
              expandIcon: ({ expanded, onExpand, record }) => (
                <DownCircleOutlined
                  rotate={expanded ? 180 : 0}
                  onClick={(e) => onExpand(record, e)}
                  className={`cursor-pointer transition-transform duration-300 text-lg
                    ${expanded ? 'text-[#ff6b81]' : 'text-gray-400 hover:text-gray-500'}`}
                />
              )
            }}
            rowKey='id'
            loading={loading}
            className='rounded-xl overflow-hidden'
            rowClassName='hover:bg-gray-50 transition-colors'
          />
        </div>

        <CategoryModal
          visible={categoryModalVisible}
          onClose={() => {
            setCategoryModalVisible(false)
            setEditingCategory(null)
          }}
          onSuccess={() => {
            setCategoryModalVisible(false)
            setEditingCategory(null)
            fetchData()
          }}
          initialData={editingCategory || undefined}
        />

        <FAQModal
          visible={faqModalVisible}
          onClose={() => {
            setFaqModalVisible(false)
            setEditingFaq(null)
          }}
          onSuccess={() => {
            setFaqModalVisible(false)
            setEditingFaq(null)
            fetchData()
          }}
          categoryId={selectedCategoryId}
          initialData={editingFaq || undefined}
        />
      </div>
    </div>
  )
}

export default FAQAdmin
