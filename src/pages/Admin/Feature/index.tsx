import { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { CreateModal } from '@/components/Modal'
import { createFeature, deleteFeature, getFeatureById, updateFeature } from '@/services/adminService'
import { getAllFeature } from '@/services/featureService'
import { TbEdit } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'

export default function FeatureAdminPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [featureList, setFeatureList] = useState([])
  const [selectedFeature, setSelectedFeature] = useState<any>('')
  const [form] = Form.useForm()
  const memoizedDataSource = useMemo(() => featureList, [featureList])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const getListFeature = async () => {
    try {
      const res = await getAllFeature()
      if (res.status === 200) {
        setFeatureList(res.data.response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getListFeature()
  }, [])

  useEffect(() => {
    setFilteredData(memoizedDataSource)
  }, [memoizedDataSource])

  const columns = [
    {
      title: 'Feature Name',
      dataIndex: 'featureName',
      key: 'featureName'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button type='primary' onClick={() => handleGetDataFeature(record.id)}>
            <TbEdit />
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            <FiTrash2 />
          </Button>
        </div>
      )
    }
  ]

  const featureFormItem = [
    {
      name: 'featureName',
      label: 'Feature Name',
      type: 'text',
      message: 'Please enter feature name',
      rules: [
        { required: true, message: 'Please enter feature name' },
        { min: 2, message: 'Feature name must be at least 2 characters' },
        { max: 50, message: 'Feature name cannot exceed 50 characters' }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      message: 'Please enter description',
      rules: [
        { required: true, message: 'Please enter description' },
        { min: 10, message: 'Description must be at least 10 characters' },
        { max: 500, message: 'Description cannot exceed 500 characters' }
      ]
    }
  ]

  const handleCreate = async (values: any) => {
    setLoading(true)
    try {
      const res = await createFeature(values)
      if (res.status === 200) {
        message.success('Create feature successfully')
        getListFeature()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsOpen(false)
      setLoading(false)
    }
    form.resetFields()
  }

  const handleUpdate = async (values: any, id: string) => {
    setLoading(true)
    try {
      const res = await updateFeature(values, id)
      if (res.status === 200) {
        message.success('Update feature successfully')
        getListFeature()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsOpen(false)
      setLoading(false)
    }
    form.resetFields()
  }

  const handleSubmit = async (values: any) => {
    if (isUpdateMode) {
      handleUpdate(values, selectedFeature)
    } else {
      handleCreate(values)
    }
  }

  const handleDelete = async (featureId: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This feature will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          const res = await deleteFeature(featureId)
          if (res.status === 200) {
            message.success('Delete successfully')
            getListFeature()
          }
        } catch (error) {
          message.error('Failed to delete')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleGetDataFeature = async (featureId: string) => {
    try {
      const res = await getFeatureById(featureId)
      const { featureName, description } = res.data.response
      form.setFieldsValue({
        featureName,
        description
      })
      setIsOpen(true)
      setIsUpdateMode(true)
      setSelectedFeature(featureId)
    } catch (error) {
      console.error('Error while fetching feature:', error)
      message.error('Failed to fetch feature details for update')
    }
  }

  const handleSearch = () => {
    const filtered = memoizedDataSource.filter(
      (item: any) => item.featureName.toLowerCase().includes(searchQuery.toLowerCase()) // search by 'email'
    )
    setFilteredData(filtered)
  }
  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Feature</h1>
        <button
          className={`flex items-center h-1/3 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
        >
          <MdOutlineCreateNewFolder className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold text-sm'>Create</span>
        </button>
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
      <Modal
        title={isUpdateMode ? 'Update feature' : 'Create feature'}
        open={isOpen}
        onCancel={() => {
          setIsOpen(false)
          form.resetFields()
          setIsUpdateMode(false)
        }}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name='featureName'
            label='Feature Name'
            rules={[
              { required: true, message: 'Please enter feature name' },
              { min: 5, message: 'Feature name must be at least 5 characters' },
              { max: 100, message: 'Feature name cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder='Enter feature name' />
          </Form.Item>

          <Form.Item
            name='description'
            label='Description'
            rules={[
              { required: true, message: 'Please enter description' },
              { min: 10, message: 'Description must be at least 10 characters' },
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]}
          >
            <Input.TextArea rows={4} placeholder='Enter description' />
          </Form.Item>

          <div className='flex justify-end gap-2'>
            <Button
              onClick={() => {
                setIsOpen(false)
                form.resetFields()
                setIsUpdateMode(false)
              }}
            >
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              {isUpdateMode ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
