import { useEffect, useMemo, useState } from 'react'
import { Button, Form, message, Modal, Table, Input } from 'antd'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { TbEdit } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import {
  createReminderType,
  deleteReminderType,
  getAllReminderType,
  updateReminderType
} from '@/services/reminderTypeService'

export default function ReminderTypeAdminPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [typeList, setTypeList] = useState([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchReminderTypes()
  }, [])

  const fetchReminderTypes = async () => {
    setLoading(true)
    try {
      const res = await getAllReminderType()
      if (res.success) setTypeList(res.response)
    } catch (error) {
      message.error('Failed to fetch reminder types')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (id?: string) => {
    if (id) {
      const selected = typeList.find((item: any) => item.id === id)
      if (selected) {
        form.setFieldsValue(selected)
        setSelectedType(id)
      }
    } else {
      form.resetFields()
      setSelectedType(null)
    }
    setIsOpen(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      // Validate form before submitting
      await form.validateFields()
      
      setLoading(true)
      if (selectedType) {
        await updateReminderType(selectedType, values.typeName, values.description)
        message.success('Updated successfully')
      } else {
        await createReminderType(values.typeName, values.description)
        message.success('Created successfully')
      }
      fetchReminderTypes()
    } catch (error) {
      // Form validation error
      if (error?.errorFields) {
        message.error('Please check your input')
      } else {
        message.error('Operation failed')
      }
    } finally {
      setIsOpen(false)
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This type will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        setLoading(true)
        try {
          await deleteReminderType(id)
          message.success('Deleted successfully')
          fetchReminderTypes()
        } catch (error) {
          message.error('Failed to delete')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const columns = [
    {
      title: 'Reminder Type Name',
      dataIndex: 'typeName',
      key: 'typeName'
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
          <Button type='primary' onClick={() => handleOpenModal(record.id)}>
            <TbEdit />
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            <FiTrash2 />
          </Button>
        </div>
      )
    }
  ]

  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Reminder Type</h1>
        <button
          className={`flex items-center h-1/3 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => handleOpenModal()}
        >
          <MdOutlineCreateNewFolder className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold text-sm'>Create</span>
        </button>
      </div>
      <div className='bg-white p-5 rounded-xl shadow-md'>
        <Table dataSource={useMemo(() => typeList, [typeList])} columns={columns} pagination={{ pageSize: 5 }} loading={loading} />
      </div>
      <Modal
        title={selectedType ? 'Update Reminder Type' : 'Create Reminder Type'}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="typeName"
            label="Reminder Type Name"
            rules={[
              { required: true, message: 'Please enter reminder type name' },
              { min: 5, message: 'Type name must be at least 5 characters' },
              { max: 100, message: 'Type name cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder="Enter reminder type name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter description' },
              { min: 5, message: 'Description must be at least 5 characters' },
              { max: 200, message: 'Description cannot exceed 200 characters' }
            ]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedType ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
