import { selectPregnancyRecord } from '@/store/modules/global/selector'
import {  Button, DatePicker, Form, Input, Modal, Select, Space, Table } from 'antd'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { TbEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'

export default function Dashboard() {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [pregnancyInfor, setPregnancyInfor] = React.useState([])
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const pregnancyRecord = useSelector(selectPregnancyRecord)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    console.log('User:', user)
    if (user?.id) {
      dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: user.id } })
    }
  }, [dispatch])

  useEffect(() => {
    if (pregnancyRecord) {
      setPregnancyInfor(pregnancyRecord)
    }
  }, [pregnancyRecord])

  const columns = [
    {
      title: 'Mother Name',
      dataIndex: 'motherName',
      key: 'motherName'
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'motherDateOfBirth',
      key: 'motherDateOfBirth'
    },
    {
      title: 'Blood Type',
      dataIndex: 'bloodType',
      key: 'bloodType'
    },
    {
      title: 'Health Status',
      dataIndex: 'healhStatus',
      key: 'healhStatus'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
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
        <Table dataSource={pregnancyInfor} columns={columns} pagination={{ pageSize: 8 }} />
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
                <DatePicker value={'DD/MM/YYYY'} picker='date' format={'DD/MM/YYYY'} />
              </Form.Item>
              <Form.Item
                name='bloodType'
                label='Blood Type'
                rules={[{ required: true, message: 'Please enter your blood type' }]}
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
                <DatePicker picker='date' format={'DD/MM/YYYY'} />
              </Form.Item>
              <Form.Item
                name='expectedDueDate'
                label='Expected Due Date'
                rules={[{ required: true, message: 'Please enter your expected due date' }]}
              >
                <DatePicker picker='date' format={'DD/MM/YYYY'} />
              </Form.Item>
              <Form.Item
                name='babyGender'
                label='Baby Gender'
                rules={[{ required: true, message: 'Please enter your baby gender' }]}
              >
                <Select
                  defaultValue={'male'}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                />
              </Form.Item>
              <Form.Item name='imageUrl' label='Image Url'>
                <Input placeholder='Enter your imageUrl'/>
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
    </>
  )
}
