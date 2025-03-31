import { getPlanById } from '@/services/planService'
import { selectFeatureInfoInfo, selectMembershipPlans, selectMostUsedPlan } from '@/store/modules/global/selector'
import request from '@/utils/axiosClient'
import { StarOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Statistic, Table, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { TbEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'

export default function MemberShipPlanAdminPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [featureList, setFeatureList] = useState<MODEL.Feature[]>([])
  const [plans, setPlans] = useState<MODEL.PlanResponse[]>([])
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [mostPlan, setMostPlan] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const plansResponse = useSelector(selectMembershipPlans) || []
  const mostPlanResponse = useSelector(selectMostUsedPlan)
  const featuresResponse = useSelector(selectFeatureInfoInfo) || []
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<MODEL.PlanResponse[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
    dispatch({ type: 'GET_ALL_FEATURES' })
    dispatch({ type: 'GET_MOST_USED_PLAN' })
  }, [dispatch])

  useEffect(() => {
    if (Array.isArray(plansResponse) && plansResponse.length > 0) {
      setPlans(plansResponse)
    }
    if (Array.isArray(featuresResponse) && featuresResponse.length > 0) {
      setFeatureList(featuresResponse)
    }
    if (mostPlanResponse) {
      setMostPlan(mostPlanResponse)
    }
  }, [plansResponse, featuresResponse, mostPlanResponse])

  useEffect(() => {
    if (Array.isArray(plansResponse)) {
      setFilteredData(plansResponse)
    }
  }, [plansResponse])

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => (
        <img src={imageUrl} alt='Plan Image' className='w-14 h-14 object-cover rounded-full' />
      )
    },
    {
      title: 'Plan Name',
      dataIndex: 'planName',
      key: 'planName'
    },
    {
      title: 'Feature',
      dataIndex: 'features',
      key: 'features',
      render: (_: any, record: MODEL.PlanResponse) => (
        <ul className='list-disc pl-4'>
          {record.features?.map((feature, index) => <li key={index}>{feature.featureName}</li>)}
        </ul>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VND`
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} days`
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: MODEL.PlanResponse) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handleUpdate(record.membershipPlanId)}>
            <TbEdit />
          </Button>
          <Button danger onClick={() => handleDelete(record.membershipPlanId)}>
            <FiTrash2 />
          </Button>
        </Space>
      )
    }
  ]

  const handleModalClick = () => {
    setIsUpdateMode(false)
    setIsModalOpen(true)
    form.resetFields()
    setImageUrl('')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setIsUpdateMode(false)
    setSelectedPlanId(null)
    setImageUrl('')
  }

  const onCreatePlan = async (values: MODEL.PlanValues) => {
    try {
      dispatch({
        type: 'CREATE_MEMBERSHIP_PLANS',
        payload: {
          planName: values.planName,
          price: values.price,
          duration: values.duration,
          description: values.description,
          imageUrl: imageUrl,
          featuredIds: values.features.map((id) => String(id))
        }
      })
      setIsModalOpen(false)
      form.resetFields()
      setImageUrl('')
    } catch (error) {
      message.error('Failed to create plan')
    }
  }

  const onUpdatePlan = async (values: MODEL.PlanValues) => {
    if (!selectedPlanId) return
    try {
      dispatch({
        type: 'UPDATE_MEMBERSHIP_PLANS',
        payload: {
          planId: selectedPlanId,
          planName: values.planName,
          price: values.price,
          duration: values.duration,
          description: values.description,
          imageUrl: imageUrl,
          featuredIds: values.features.map((id) => String(id))
        }
      })
      setIsModalOpen(false)
      form.resetFields()
      setSelectedPlanId(null)
      setImageUrl('')
    } catch (error) {
      message.error('Failed to update plan')
    }
  }

  const handleModalSubmit = () => {
    form.validateFields().then((values) => {
      if (isUpdateMode) {
        onUpdatePlan(values)
      } else {
        onCreatePlan(values)
      }
    })
  }

  const handleDelete = async (planId: string) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: 'This plan will be deleted permanently',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          dispatch({
            type: 'DELETE_MEMBERSHIP_PLANS',
            payload: { planId }
          })
        } catch (error) {
          message.error('Failed to delete plan')
        }
      }
    })
  }

  const handleUpdate = async (planId: string) => {
    try {
      const planResponse = await getPlanById(planId)
      if (planResponse) {
        form.setFieldsValue({
          planName: planResponse.planName,
          price: planResponse.price,
          duration: planResponse.duration,
          description: planResponse.description,
          imageUrl: planResponse.imageUrl,
          features: planResponse.features?.map((feature) => feature.featureName)
        })
        setImageUrl(planResponse.imageUrl)
        setIsModalOpen(true)
        setIsUpdateMode(true)
        setSelectedPlanId(planId)
      }
    } catch (error) {
      console.error('Error while fetching plan:', error)
      message.error('Failed to fetch plan details for update')
    }
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'PregnaCare')
    formData.append('cloud_name', 'dgzn2ix8w')

    try {
      const response = await request.post('https://api.cloudinary.com/v1_1/dgzn2ix8w/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setImageUrl(response.data.secure_url)
      message.success('Image uploaded successfully')
    } catch (error) {
      message.error('Failed to upload image')
      console.error('Upload error:', error)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === '') {
      setFilteredData(plansResponse)
    } else {
      const filtered = plansResponse.filter((item) => item.planName?.toLowerCase().includes(query))
      setFilteredData(filtered)
    }
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800'>Membership Plans</h1>
        <button
          className={`flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleModalClick}
        >
          <MdOutlineCreateNewFolder className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold text-sm'>Create</span>
        </button>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <Card className='shadow-lg'>
          <Statistic
            title={
              <span>
                <UserOutlined className='mr-2 text-2xl' />
                Total Plans
              </span>
            }
            value={plans.length}
          />
        </Card>
        <Card className='shadow-lg'>
          <Statistic
            title={
              <span>
                <StarOutlined className='mr-2 text-2xl' />
                Most Used Plan
              </span>
            }
            value={mostPlan || 'N/A'}
          />
        </Card>
      </div>

      <div className='bg-white p-6 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Input
            className='w-1/4'
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            placeholder='Search by plan name'
            suffix={<FaSearch className='text-gray-400' />}
          />
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey='membershipPlanId'
          pagination={{ pageSize: 8 }}
          loading={!plansResponse}
        />
      </div>

      <Modal
        title={isUpdateMode ? 'Update Membership Plan' : 'Create Membership Plan'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleModalSubmit}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout='horizontal' preserve={false}>
          <Row gutter={24}>
            <Col span={14}>
              <Form.Item
                label='Plan Name'
                name='planName'
                rules={[
                  { required: true, message: 'Please input the plan name!' },
                  { min: 5, message: 'Plan name must be at least 5 characters' },
                  { max: 100, message: 'Plan name must not exceed 100 characters' }
                ]}
              >
                <Input placeholder='Enter plan name' />
              </Form.Item>

              <Form.Item
                label='Price (VND)'
                name='price'
                rules={[
                  { required: true, message: 'Please input the price!' },
                  {
                    validator: (_, value) => {
                      if (value && value < 100000) {
                        return Promise.reject('Price must be at least 100,000 VND')
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <Input type='number' placeholder='Enter price (e.g., 100000)' />
              </Form.Item>

              <Form.Item
                label='Duration (days)'
                name='duration'
                rules={[
                  { required: true, message: 'Please input the duration!' },
                  {
                    validator: (_, value) => {
                      if (value < 3) {
                        return Promise.reject('Duration must be at least 3 days')
                      }
                      if (value > 365) {
                        return Promise.reject('Duration must not exceed 365 days')
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <Input type='number' placeholder='Enter duration (days)' />
              </Form.Item>

              <Form.Item
                label='Description'
                name='description'
                rules={[
                  { required: true, message: 'Please input the description!' },
                  { min: 10, message: 'Description must be at least 10 characters' },
                  { max: 500, message: 'Description must not exceed 500 characters' }
                ]}
              >
                <Input.TextArea rows={4} placeholder='Enter description' />
              </Form.Item>

              <Form.Item
                label='Features'
                name='features'
                rules={[{ required: true, message: 'Please select at least one feature!' }]}
              >
                <Select
                  mode='multiple'
                  placeholder='Select features'
                  options={featureList.map((feature) => ({
                    label: feature.featureName,
                    value: feature.id
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label='Plan Image' name='imageUrl'>
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/')
                    if (!isImage) {
                      message.error('You can only upload image files!')
                      return false
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2
                    if (!isLt2M) {
                      message.error('Image must smaller than 2MB!')
                      return false
                    }
                    handleUpload(file)
                    return false
                  }}
                  showUploadList={false}
                >
                  <Button>Click to Upload</Button>
                </Upload>
                {imageUrl && (
                  <div className='mt-4'>
                    <img src={imageUrl} alt='Plan preview' className='w-full h-40 object-contain border rounded' />
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
