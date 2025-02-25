import { selectMotherInfo, selectPregnancyRecord, selectUserInfo } from '@/store/modules/global/selector'
import { Button, DatePicker, Form, Input, Modal, Select, Space, Table } from 'antd'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { TbEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'

export default function Dashboard() {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [pregnancyInfor, setPregnancyInfor] = useState<MODEL.PregnancyRecordResponse[]>([])
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const motherInfo = useSelector(selectMotherInfo)
  const userInfo = useSelector(selectUserInfo)

  useEffect(() => {
    if (userInfo.id) {
      dispatch({ type: 'GET_ALL_MOTHER_INFO', payload: { userId: userInfo.id } })
    }
  }, [dispatch])

  useEffect(() => {
    if (motherInfo) {
      setPregnancyInfor(motherInfo)
    }
  }, [motherInfo])

  const columns = [
    {
      title: 'Mother Name',
      dataIndex: 'motherName',
      key: 'motherName'
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dateOfBirth',
      key: 'motherDateOfBirth'
    },
    {
      title: 'Blood Type',
      dataIndex: 'bloodType',
      key: 'bloodType'
    },
    {
      title: 'Health Status',
      dataIndex: 'healthStatus',
      key: 'healhStatus'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
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
    dispatch({
      type: 'CREATE_PREGNANCY_RECORD',
      payload: {
        userId: user?.id,
        motherName: values.motherName,
        bloodType: values.bloodType,
        healhStatus: values.healhStatus,
        notes: values.notes,
        babyName: values.babyName,
        babyGender: values.babyGender,
        imageUrl: values.imageUrl,
        motherDateOfBirth: values.motherDateOfBirth.format('YYYY-MM-DD'),
        pregnancyStartDate: values.pregnancyStartDate.format('YYYY-MM-DD'),
        expectedDueDate: values.expectedDueDate.format('YYYY-MM-DD')
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
        <Table dataSource={motherInfo} columns={columns} pagination={{ pageSize: 8 }} />
      </div>

      <Modal width={800} height={600} open={isModalOpen} onCancel={onClose} footer={null}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout='horizontal'
          initialValues={{
            BabyName: '',
            BloodType: '',
            HealhStatus: '',
            MotherName: '',
            Notes: ''
          }}
        >
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
                name='motherDateOfBirth'
                label='Date Of Birth'
                rules={[{ required: true, message: 'Please enter your date of birth' }]}
              >
                <DatePicker value={'DD/MM/YYYY'} picker='date' format={'DD/MM/YYYY'} />
              </Form.Item>
              <Form.Item
                name='bloodType'
                label='Blood Type'
                rules={[{ required: true, message: 'The BloodType field is required.' }]}
              >
                <Select
                  options={[
                    { value: 'A', label: 'A' },
                    { value: 'B', label: 'B' },
                    { value: 'O', label: 'O' },
                    { value: 'AB', label: 'AB' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                name='healhStatus'
                label='Health Status'
                rules={[{ required: true, message: 'Please select your health status' }]}
              >
                <Select
                  options={[
                    { value: 'good', label: 'Good' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'underlying_condition', label: 'Underlying_condition' }
                  ]}
                />
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
                  defaultValue={'Selet Gender'}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                />
              </Form.Item>
              <Form.Item name='imageUrl' label='Image Url'>
                <Input placeholder='Enter your imageUrl' />
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
