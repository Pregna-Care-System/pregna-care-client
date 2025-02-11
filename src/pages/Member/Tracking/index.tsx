import { selectPregnancyRecord } from '@/store/modules/global/selector'
import { FileAddFilled } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { TbEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'

export default function Tracking() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [pregnancyInfor, setPregnancyInfor] = React.useState([])
  const [selectedPregnancyId, setSelectedPregnancyId] = React.useState<string | null>(null)
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
      render: (_, record) => {
        return (
          <Space size='middle'>
            <Button type='primary'>
              <TbEdit />
            </Button>
            <Button type='default' onClick={() => handleOpenModal(record.id)}>
              <FileAddFilled />
            </Button>
          </Space>
        )
      }
    }
  ]

  const handleOpenModal = (pregnancyId: string) => {
    setSelectedPregnancyId(pregnancyId)
    setIsModalOpen(true)
  }
  const handleSubmit = (values: any) => {
    if (!selectedPregnancyId) {
      message.error('No pregnancy record selected!')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    dispatch({
      type: 'CREATE_FETAL_GROWTH_RECORD',
      payload: {
        userId: user?.id,
        pregnancyRecordId: selectedPregnancyId,
        name: values.name,
        unit: values.unit,
        description: values.description,
        week: values.week,
        value: values.value,
        note: values.note
      }
    })
    setLoading(false)
    setIsModalOpen(false)
    form.resetFields()
  }

  const onClose = () => {
    setIsModalOpen(false)
  }
  return (
    <>
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
