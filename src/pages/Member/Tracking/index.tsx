import { selectPregnancyRecord } from '@/store/modules/global/selector'
import { FileAddFilled } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { TbEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'

export default function Tracking() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [pregnancyInfor, setPregnancyInfor] = React.useState([])
  const dispatch = useDispatch()
  const pregnancyResponse = useSelector(selectPregnancyRecord)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    if (user?.id) {
      dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: user.id } })
    }
  }, [dispatch])

  useEffect(() => {
    if (pregnancyResponse) {
      setPregnancyInfor(pregnancyResponse)
    }
  }, [pregnancyResponse])

  const columns = [
    {
      title: 'Baby Name',
      dataIndex: 'babyName',
      key: 'babyName'
    },
    {
      title: 'Pregnancy Start Date',
      dataIndex: 'pregnancyStartDate',
      key: 'pregnancyStartDate'
    },
    {
      title: 'Expected Due Date',
      dataIndex: 'expectedDueDate',
      key: 'expectedDueDate'
    },
    {
      title: 'Baby Gender',
      dataIndex: 'babyGender',
      key: 'babyGender'
    },
    {
      title: 'Image Url',
      dataIndex: 'imageUrl',
      key: 'imageUrl'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt', 
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary'>
            <TbEdit />
          </Button>
        </Space>
      )
    }
  ]

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
  const handleSubmit = (values: any) => {
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth.format('DD/MM/YYYY'),
      pregnancyStartDate: values.pregnancyStartDate.format('DD/MM/YYYY'),
      expectedDueDate: values.expectedDueDate.format('DD/MM/YYYY'),
      userId: user?.id
    }
    dispatch({ type: 'CREATE_PREGNANCY_RECORD', payload: { data: payload } })
    setLoading(false)
    setIsModalOpen(false)
    form.resetFields()
  }
  const onClose = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <div className='flex justify-end w-full'>
        <Button type='primary' className='mb-5' danger onClick={handleOpenModal}>
          <FileAddFilled /> Tracking
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
        <Table dataSource={pregnancyInfor} columns={columns} pagination={{ pageSize: 8 }} />
      </div>

      <Modal title={`Tracking Information`} open={isModalOpen} onCancel={onClose} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Form.Item name='week' label='Week' rules={[{ required: true, message: 'Please enter your current week' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please enter value' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='unit' label='Unit' rules={[{ required: true, message: 'Please enter value' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='value' label='Value' rules={[{ required: true, message: 'Please enter value' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='notes' label='Notes' rules={[{ required: false }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
