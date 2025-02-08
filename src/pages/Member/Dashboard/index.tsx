import { selectMotherInfo } from '@/store/modules/global/selector'
import { Avatar, Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { TbEdit } from 'react-icons/tb'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const dataSource = useSelector(selectMotherInfo)
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const columns = [
    {
      title: 'Mother Name',
      dataIndex: 'motherName',
      key: 'motherName'
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: 'Blood Type',
      dataIndex: 'bloodType',
      key: 'bloodType'
    },
    {
      title: 'Health Status',
      dataIndex: 'healthStatus',
      key: 'healthStatus'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary'>
            <TbEdit />
          </Button>
          <Button danger variant='outlined'>
            <FiTrash2 />
          </Button>
        </Space>
      )
    }
  ]

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  const handleSubmit = (values: any) => {
    console.log('Form values:', values)
  }
  const onClose = () => {
    setIsModalOpen(false)
  }
  return (
    <div className='flex-1 p-8'>
      <div className='flex justify-end items-center mb-10'>
        <h4 className='px-2 border-s-2 border-gray-300'>
          Hello, <strong>Username</strong>
        </h4>
        <div>
          <Avatar
            size={50}
            src={'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'}
          />
        </div>
      </div>
      <div className='flex justify-end w-full'>
        <Button type='primary' className='mb-5' danger onClick={handleOpenModal}>
          Create
        </Button>
      </div>
      <div className='bg-white p-10 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Select
            defaultValue='newest'
            style={{ width: 120 }}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'newest', label: 'Newest' },
              { value: 'Yiminghe', label: 'yiminghe' }
            ]}
          />
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} />
      </div>

      <Modal width={800} height={600} open={isModalOpen} onCancel={onClose} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout='horizontal'>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <h4 className='text-xl font-bold mb-5'>Mother Information</h4>
              <Form.Item
                name='motherName'
                label='Mother Name'
                rules={[{ required: true, message: 'Please enter your mother name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='dateOfBirth'
                label='Date Of Birth'
                rules={[{ required: true, message: 'Please enter your date of birth' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='bloodType'
                label='Blood Type'
                rules={[{ required: true, type: 'number', message: 'Please enter your blood type' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='healthStatus'
                label='Health Status'
                rules={[{ required: true, message: 'Please enter your health status' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name='notes' label='Notes' rules={[{ required: false }]}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <h4 className='text-lg font-bold mb-4'>Baby Information</h4>
              <Form.Item
                name='babyName'
                label='Baby Name'
                rules={[{ required: true, message: 'Please enter your baby name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='pregnancyStartDate'
                label='Pregnancy Start Date'
                rules={[{ required: true, message: 'Please enter your pregnancy start date' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='expectedDueDate'
                label='Expected Due Date'
                rules={[{ required: true, message: 'Please enter your expected due date' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='babyGender'
                label='Baby Gender'
                rules={[{ required: true, message: 'Please enter your baby gender' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
