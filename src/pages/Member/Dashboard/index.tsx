import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tabs,
  Tag,
  Typography
} from 'antd'
import {
  FaBaby,
  FaCalendarAlt,
  FaEdit,
  FaFileAlt,
  FaHeartbeat,
  FaNotesMedical,
  FaPlus,
  FaTrash,
  FaUser
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectMemberInfo,
  selectMotherInfo,
  selectPregnancyRecord,
  selectUserInfo
} from '@/store/modules/global/selector'
import dayjs from 'dayjs'
import styled from 'styled-components'
import UserAvatar from '@/components/common/UserAvatar'
import { deletePregnancyRecord } from '@/services/pregnancyRecordService'

const { Title, Text } = Typography
const { TabPane } = Tabs

// Styled components
const PageWrapper = styled.div`
  .profile-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .tab-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .info-card {
    border: 1px solid #ffccd5;
    border-radius: 8px;

    &:hover {
      box-shadow: 0 2px 8px rgba(255, 107, 129, 0.2);
    }
  }

  .pregnancy-card {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 129, 0.2);
    }

    &.active {
      border: 2px solid #ff6b81;
      background: #fff9fa;
    }
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #ff6b81 !important;
  }

  .ant-tabs-ink-bar {
    background: #ff6b81 !important;
  }

  .ant-btn-primary {
    background: #ff6b81;
    border-color: #ff6b81;

    &:hover {
      background: #ff8296;
      border-color: #ff8296;
    }
  }
`

const theme = {
  token: {
    colorPrimary: '#ff6b81',
    colorLink: '#ff6b81'
  }
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const [isMotherModalOpen, setIsMotherModalOpen] = useState(false)
  const [isBabyModalOpen, setIsBabyModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedPregnancy, setSelectedPregnancy] = useState(null)
  const [motherForm] = Form.useForm()
  const [babyForm] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const motherInfo = useSelector(selectMotherInfo)
  const userInfo = useSelector(selectMemberInfo)
  const pregnancyRecords = useSelector(selectPregnancyRecord) || []
  const [motherInfoData, setMotherInfoData] = useState(motherInfo?.[0] || {})

  useEffect(() => {
    if (userInfo.id) {
      dispatch({ type: 'GET_ALL_MOTHER_INFO', payload: { userId: userInfo.id } })
      setMotherInfoData(motherInfo?.[0] || {})
    }
  }, [dispatch, userInfo.id])

  useEffect(() => {
    if (motherInfo?.length > 0) {
      const currentMotherInfo = motherInfo[0]
      setMotherInfoData(currentMotherInfo)
      // Use the current motherInfo directly instead of relying on the state that hasn't updated yet
      if (currentMotherInfo?.id) {
        dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: currentMotherInfo.id } })
      }
    }
  }, [motherInfo, dispatch])

  useEffect(() => {
    if (pregnancyRecords.length > 0 && !selectedPregnancy) {
      setSelectedPregnancy(pregnancyRecords[0])
    }
  }, [pregnancyRecords]) // Removed setSelectedPregnancy from dependencies

  useEffect(() => {
    if (motherInfoData && editMode) {
      motherForm.setFieldsValue({
        bloodType: motherInfoData.bloodType,
        healhStatus: motherInfoData.healthStatus,
        notes: motherInfoData.notes,
        imageUrl: motherInfoData.imageUrl
      })
    }
  }, [motherInfoData, motherForm, editMode])

  useEffect(() => {
    if (selectedPregnancy && editMode) {
      babyForm.setFieldsValue({
        babyName: selectedPregnancy.babyName,
        pregnancyStartDate: selectedPregnancy.pregnancyStartDate ? dayjs(selectedPregnancy.pregnancyStartDate) : null,
        expectedDueDate: selectedPregnancy.expectedDueDate ? dayjs(selectedPregnancy.expectedDueDate) : null,
        babyGender: selectedPregnancy.babyGender
      })
    }
  }, [selectedPregnancy, babyForm, editMode])

  const handleOpenMotherModal = () => {
    setEditMode(false)
    motherForm.resetFields()
    setIsMotherModalOpen(true)
  }

  const handleOpenBabyModal = () => {
    setEditMode(false)
    babyForm.resetFields()
    setIsBabyModalOpen(true)
  }

  const handleEditMotherProfile = () => {
    setEditMode(true)
    setIsMotherModalOpen(true)
  }

  const handleEditBabyProfile = () => {
    setEditMode(true)
    setIsBabyModalOpen(true)
  }

  const handleDeleteBabyProfile = async () => {
    if (selectedPregnancy) {
      try {
        const res = await deletePregnancyRecord(selectedPregnancy.id)
        if (res.success) {
          message.success('Baby profile deleted successfully')
          dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: motherInfoData.id } })
          setSelectedPregnancy(null)
        }
      } catch (error) {}
    }
  }

  const handleSubmitMotherInfo = (values) => {
    setLoading(true)

    const payload = {
      userId: userInfo.id,
      bloodType: values.bloodType,
      healhStatus: values.healhStatus,
      notes: values.notes,
      imageUrl: values.imageUrl
    }

    if (editMode && motherInfoData.id) {
      dispatch({
        type: 'UPDATE_MOTHER_INFO',
        payload: {
          bloodType: payload.bloodType,
          healhStatus: payload.healhStatus,
          notes: payload.notes,
          motherInfoId: motherInfoData.id
        },
        callback: (success: boolean) => {
          if (success) {
            dispatch({ type: 'GET_ALL_MOTHER_INFO', payload: { userId: userInfo.id } })
          }
        }
      })
    } else {
      dispatch({
        type: 'CREATE_MOTHER_INFO',
        payload,
        callback: (success: boolean) => {
          if (success) {
            dispatch({ type: 'GET_ALL_MOTHER_INFO', payload: { userId: userInfo.id } })
          }
        }
      })
    }

    setLoading(false)
    setIsMotherModalOpen(false)
    motherForm.resetFields()
  }

  const handleSubmitBabyInfo = (values) => {
    setLoading(true)

    const payload = {
      motherInfoId: motherInfoData.id,
      babyName: values.babyName,
      babyGender: values.babyGender,
      pregnancyStartDate: values.pregnancyStartDate.format('YYYY-MM-DD'),
      expectedDueDate: values.expectedDueDate.format('YYYY-MM-DD')
    }

    if (editMode && selectedPregnancy?.id) {
      dispatch({
        type: 'UPDATE_PREGNANCY_RECORD',
        payload: {
          babyName: payload.babyName.trim(),
          babyGender: payload.babyGender,
          pregnancyStartDate: payload.pregnancyStartDate,
          expectedDueDate: payload.expectedDueDate,
          pregnancyRecordId: selectedPregnancy.id
        },
        callback: (success: boolean) => {
          if (success) {
            dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: motherInfoData.id } })
          }
        }
      })
    } else {
      if (motherInfoData.id) {
        dispatch({
          type: 'CREATE_PREGNANCY_RECORD',
          payload,
          callback: (success: boolean) => {
            if (success) {
              dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: motherInfoData.id } })
            }
          }
        })
      } else {
        alert('Please create mother information first')
        setIsBabyModalOpen(false)
        setIsMotherModalOpen(true)
        return
      }
    }

    setLoading(false)
    setIsBabyModalOpen(false)
    babyForm.resetFields()
  }

  const closeMotherModal = () => {
    setIsMotherModalOpen(false)
  }

  const closeBabyModal = () => {
    setIsBabyModalOpen(false)
  }

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'good':
        return '#4caf50'
      case 'normal':
        return '#2196f3'
      case 'underlying_condition':
        return '#ff9800'
      default:
        return '#d9d9d9'
    }
  }

  const calculateWeeksOfPregnancy = (startDate) => {
    if (!startDate) return 'N/A'
    const start = dayjs(startDate)
    const today = dayjs()
    const weeks = today.diff(start, 'week')
    return `${weeks} weeks`
  }

  const calculateDaysUntilDueDate = (dueDate) => {
    if (!dueDate) return 'N/A'
    const due = dayjs(dueDate)
    const today = dayjs()
    const days = due.diff(today, 'day')
    return days > 0 ? `${days} days` : 'Past due date'
  }

  const formatDate = (date) => {
    return date ? dayjs(date).format('DD-MM-YYYY') : 'Not set'
  }

  const renderPregnancyList = () => {
    if (!pregnancyRecords.length) {
      return (
        <Empty
          image={<FaBaby className='text-6xl text-[#ff6b81]' />}
          description={<Text type='secondary'>No pregnancy records found</Text>}
        >
          <Button type='primary' icon={<FaPlus />} onClick={handleOpenBabyModal} disabled={!motherInfoData.id}>
            Add Pregnancy Record
          </Button>
        </Empty>
      )
    }

    return (
      <div className='space-y-4'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={5} className='m-0'>
            Pregnancy Records
          </Title>
          <Button type='primary' icon={<FaPlus />} onClick={handleOpenBabyModal} size='small'>
            Add New
          </Button>
        </div>
        <div className='mb-4 overflow-auto'>
          <div className='flex space-x-3 py-2'>
            {pregnancyRecords.map((record) => (
              <Card
                key={record.id}
                className={`pregnancy-card ${selectedPregnancy?.id === record.id ? 'active' : ''} flex-shrink-0 w-64`}
                onClick={() => setSelectedPregnancy(record)}
                size='small'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <Text strong>{record.babyName || 'Unnamed Baby'}</Text>
                    <div className='text-sm text-gray-500'>
                      Start: {dayjs(record.pregnancyStartDate).format('DD-MM-YYYY')}
                    </div>
                  </div>
                  <Tag color={record.babyGender === 'male' ? '#91caff' : '#ffadd2'}>
                    {record.babyGender?.toUpperCase()}
                  </Tag>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ConfigProvider theme={theme}>
      <PageWrapper>
        <div className='px-8 py-6'>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card className='profile-card' bordered={false} style={{ height: '100%' }}>
                <div className='text-center mb-6'>
                  <div className='flex justify-center mb-4'>
                    <UserAvatar src={userInfo.imageUrl} name={userInfo.fullName} size={120} />
                  </div>
                  <Title level={3} style={{ color: '#333', marginBottom: '8px' }} className='capitalize'>
                    {userInfo.fullName || 'Your Name'}
                  </Title>
                  {motherInfoData.healthStatus && (
                    <Tag
                      color={getHealthStatusColor(motherInfoData.healthStatus)}
                      style={{ borderRadius: '12px', padding: '0 12px' }}
                    >
                      {motherInfoData.healthStatus?.replace('_', ' ').toUpperCase()}
                    </Tag>
                  )}
                  <div className='mt-4 space-x-2'>
                    {motherInfoData.id ? (
                      <Button
                        type='primary'
                        icon={<FaEdit className='mr-1' />}
                        onClick={handleEditMotherProfile}
                        className='rounded-md'
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Button
                        type='primary'
                        onClick={handleOpenMotherModal}
                        className='rounded-md'
                        style={{ borderColor: '#ff6b81', color: '#ff6b81', background: 'white' }}
                      >
                        Create New Profile
                      </Button>
                    )}
                  </div>
                </div>

                <Divider style={{ borderColor: '#ffccd5' }} />

                <Descriptions column={1} className='text-sm'>
                  <Descriptions.Item
                    label={
                      <span className='flex items-center'>
                        <FaCalendarAlt className='mr-2 text-[#ff6b81]' />
                        Date of Birth
                      </span>
                    }
                  >
                    {formatDate(userInfo.dateOfBirth)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className='flex items-center'>
                        <FaHeartbeat className='mr-2 text-[#ff6b81]' />
                        Blood Type
                      </span>
                    }
                  >
                    {motherInfoData.bloodType || 'Not set'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className='flex items-center'>
                        <FaNotesMedical className='mr-2 text-[#ff6b81]' />
                        Health Status
                      </span>
                    }
                    className='capitalize'
                  >
                    {motherInfoData.healthStatus?.replace('_', ' ') || 'Not set'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className='flex items-center'>
                        <FaFileAlt className='mr-2 text-[#ff6b81]' />
                        Notes
                      </span>
                    }
                  >
                    {motherInfoData.notes || 'No notes'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              <Card className='tab-card' bordered={false}>
                {renderPregnancyList()}
                <Divider style={{ borderColor: '#ffccd5' }} />
                <Tabs defaultActiveKey='1'>
                  <TabPane
                    tab={
                      <span className='flex items-center'>
                        <FaBaby className='mr-2' />
                        Pregnancy Details
                      </span>
                    }
                    key='1'
                  >
                    {selectedPregnancy ? (
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Card
                            className='info-card'
                            title={
                              <div className='flex justify-between items-center'>
                                <span className='flex items-center text-[#ff6b81]'>
                                  <FaBaby className='mr-2' />
                                  {selectedPregnancy.babyName || 'Unnamed Baby'}
                                </span>
                                <div>
                                  <Button
                                    type='primary'
                                    icon={<FaTrash className='mr-1' />}
                                    onClick={() => {
                                      handleDeleteBabyProfile()
                                    }}
                                    className='rounded-md mr-1'
                                  >
                                    Delete baby
                                  </Button>
                                  <Button
                                    type='primary'
                                    icon={<FaEdit className='mr-1' />}
                                    onClick={() => {
                                      setEditMode(true)
                                      handleEditBabyProfile()
                                    }}
                                    className='rounded-md'
                                  >
                                    Edit Details
                                  </Button>
                                </div>
                              </div>
                            }
                            bordered={false}
                          >
                            <Row gutter={[16, 16]}>
                              <Col xs={24} md={12}>
                                <Card className='info-card' title='Baby Information'>
                                  <Descriptions column={1}>
                                    <Descriptions.Item label='Baby Name'>
                                      {selectedPregnancy.babyName || 'Not named yet'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label='Gender'>
                                      {selectedPregnancy.babyGender ? (
                                        <Tag
                                          color={selectedPregnancy.babyGender === 'male' ? '#91caff' : '#ffadd2'}
                                          className='rounded-full px-3'
                                        >
                                          {selectedPregnancy.babyGender.toUpperCase()}
                                        </Tag>
                                      ) : (
                                        'Not set'
                                      )}
                                    </Descriptions.Item>
                                  </Descriptions>
                                </Card>
                              </Col>
                              <Col xs={24} md={12}>
                                <Card className='info-card' title='Pregnancy Timeline'>
                                  <Descriptions column={1}>
                                    <Descriptions.Item label='Start Date'>
                                      {formatDate(selectedPregnancy.pregnancyStartDate)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label='Due Date'>
                                      {formatDate(selectedPregnancy.expectedDueDate)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label='Current Week'>
                                      {selectedPregnancy.gestationalAgeResponse.weeks} weeks
                                    </Descriptions.Item>
                                    <Descriptions.Item label='Days Until Due'>
                                      {calculateDaysUntilDueDate(selectedPregnancy.expectedDueDate)}
                                    </Descriptions.Item>
                                  </Descriptions>
                                </Card>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>
                    ) : (
                      <div className='text-center py-10'>
                        <FaBaby className='text-5xl text-[#ff6b81] mb-4' />
                        <Title level={4} className='text-[#ff6b81]'>
                          No Pregnancy Selected
                        </Title>
                        <Text type='secondary'>Select a pregnancy record or create a new one</Text>
                        <div className='mt-4'>
                          {motherInfoData.id ? (
                            <Button
                              type='primary'
                              onClick={handleOpenBabyModal}
                              icon={<FaPlus className='mr-1' />}
                              className='rounded-md'
                            >
                              Add Pregnancy Record
                            </Button>
                          ) : (
                            <Button type='primary' onClick={handleOpenMotherModal} className='rounded-md'>
                              Create Mother Profile First
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Mother Information Modal */}
        <Modal
          title={
            <div className='flex items-center text-[#ff6b81] border-b-2 border-[#ff6b81] pb-2'>
              <FaUser className='mr-2' />
              {editMode ? 'Edit Mother Profile' : 'Create Mother Profile'}
            </div>
          }
          width={600}
          open={isMotherModalOpen}
          onCancel={closeMotherModal}
          footer={null}
          style={{ top: 20 }}
        >
          <Form
            form={motherForm}
            onFinish={handleSubmitMotherInfo}
            layout='vertical'
            initialValues={{
              bloodType: '',
              healhStatus: '',
              notes: ''
            }}
          >
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
                  { value: 'underlying_condition', label: 'Underlying Condition' }
                ]}
              />
            </Form.Item>
            <Form.Item
              name='notes'
              label='Notes'
              rules={[{ required: false }, { max: 100, message: 'Notes should not exceed 100 characters' }]}
            >
              <Input.TextArea rows={3} showCount maxLength={100} />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                style={{ height: '40px', borderRadius: '6px' }}
              >
                {editMode ? 'Update Mother Profile' : 'Create Mother Profile'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Baby Information Modal */}
        <Modal
          title={
            <div className='flex items-center text-[#ff6b81] border-b-2 border-[#ff6b81] pb-2'>
              <FaBaby className='mr-2' />
              {editMode ? 'Edit Baby Information' : 'Add Baby Information'}
            </div>
          }
          width={600}
          open={isBabyModalOpen}
          onCancel={closeBabyModal}
          footer={null}
          style={{ top: 20 }}
        >
          <Form
            form={babyForm}
            onFinish={handleSubmitBabyInfo}
            layout='vertical'
            initialValues={{
              babyName: '',
              babyGender: ''
            }}
          >
            <Form.Item
              name='babyName'
              label='Baby Name'
              rules={[
                { required: true, message: 'Baby name is required' },
                { min: 2, message: 'Name must be at least 2 characters' },
                { max: 30, message: 'Name should not exceed 30 characters' },
                { pattern: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' }
              ]}
            >
              <Input placeholder="Enter baby's name" />
            </Form.Item>
            <Form.Item
              name='pregnancyStartDate'
              label='Pregnancy Start Date'
              rules={[
                { required: true, message: 'Start date is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || (value.isAfter(dayjs().subtract(9, 'month')) && value.isBefore(dayjs()))) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Date must be within the last 9 months and not in the future')
                  }
                })
              ]}
            >
              <DatePicker
                picker='date'
                format={'DD-MM-YYYY'}
                style={{ width: '100%' }}
                onChange={(date) => {
                  if (date) {
                    // Pregnancy typically lasts around 40 weeks (280 days)
                    const dueDate = dayjs(date).add(280, 'days')
                    babyForm.setFieldValue('expectedDueDate', dueDate)
                  }
                }}
                disabledDate={(current) => {
                  // Cannot select dates before 9 months ago or after today
                  return current && (current > dayjs().endOf('day') || current < dayjs().subtract(9, 'months'))
                }}
              />
            </Form.Item>
            <Form.Item
              name='expectedDueDate'
              label='Expected Due Date'
              rules={[{ required: true, message: 'Please enter your expected due date' }]}
            >
              <DatePicker picker='date' format={'DD-MM-YYYY'} style={{ width: '100%' }} disabled={true} />
            </Form.Item>
            <Form.Item
              name='babyGender'
              label='Baby Gender'
              rules={[{ required: true, message: 'Please enter your baby gender' }]}
            >
              <Select
                placeholder='Select Gender'
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                style={{ height: '40px', borderRadius: '6px' }}
              >
                {editMode ? 'Update Baby Information' : 'Add Baby Information'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageWrapper>
    </ConfigProvider>
  )
}
