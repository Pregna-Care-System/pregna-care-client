import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { getAllFeature } from '@/services/featureService'
import { createPlan, deletePlan, getAllPlan, getPlanById, updatePlan } from '@/services/planService'
import { FileAddFilled } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Select, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { TbEdit } from 'react-icons/tb'

export default function MemberShipPlanAdminPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [featureList, setFeatureList] = useState([])
  const [plans, setPlans] = useState<MODEL.PlanResponse[]>([])
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await getAllPlan()
        const featuresResponse = await getAllFeature()

        setPlans(plansResponse || [])
        setFeatureList(featuresResponse || [])
      } catch (error) {
        message.error('Failed to load data.')
      }
    }

    fetchData()
  }, [])

  const columns = [
    {
      title: 'Plan Name',
      dataIndex: 'planName',
      key: 'planName'
    },
    {
      title: 'Feature',
      dataIndex: 'features',
      key: 'features',
      render: (_, record) => (
        <ul className='list-disc pl-4'>
          {record.features?.map((feature, index) => <li key={index}> {feature.featureName} </li>)}
        </ul>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration'
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
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary' onClick={() => handleUpdate(record.membershipPlanId)}>
            <TbEdit />
          </Button>
          <Button danger variant='outlined' onClick={() => handleDelete(record.membershipPlanId)}>
            <FiTrash2 />
          </Button>
        </Space>
      )
    }
  ]
  const handleModalClick = () => {
    setIsUpdateMode(false)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setIsUpdateMode(false)
    setSelectedPlanId(null)
  }

  const onCreatePlan = async (values: MODEL.PlanValues) => {
    const response = await createPlan(
      values.planName,
      values.price,
      values.duration,
      values.description,
      values.features.map((id) => String(id))
    )
    if (response) {
      message.success('Plan created successfully')

      const newPlan = {
        planName: values.planName,
        price: values.price,
        duration: values.duration,
        description: values.description,
        features: values.features.map((id) => {
          const feature = featureList.find((f) => f.id === id)
          return feature ? { featureName: feature.featureName } : { featureName: 'Unknown' }
        }),
        createdAt: new Date().toLocaleString()
      }

      setPlans((prevPlans) => [newPlan, ...prevPlans])
      setIsModalOpen(false)
      form.resetFields()
    } else {
      message.error('Failed to create plan')
    }
  }

  const onUpdatePlan = async (values: MODEL.PlanValues) => {
    if (!selectedPlanId) return
    const response = await updatePlan(
      selectedPlanId,
      values.planName,
      values.price,
      values.duration,
      values.description,
      values.features.map((id) => String(id))
    )
    if (response) {
      message.success('Plan updated successfully')

      const updatedPlans = plans.map((plan) =>
        plan.membershipPlanId === selectedPlanId
          ? {
              ...plan,
              planName: values.planName,
              price: values.price,
              duration: values.duration,
              description: values.description,
              features: values.features.map((id) => {
                const feature = featureList.find((f) => f.id === id)
                return feature ? { featureName: feature.featureName } : { featureName: 'Unknown' }
              })
            }
          : plan
      )
      setPlans(updatedPlans)
      setIsModalOpen(false)
      form.resetFields()
      setSelectedPlanId(null)
    } else {
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
      content: 'This plan will be deleted forever',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await deletePlan(planId)
          message.success('Plan deleted successfully')
          const updatedPlans = await getAllPlan()
          setPlans(updatedPlans)
        } catch (error) {
          message.error('Failed to delete plan')
        }
      }
    })
  }

  const handleUpdate = async (planId: string) => {
    if (!planId) {
      message.error('Plan ID is not defined')
      return
    }
    try {
      const planResponse = await getPlanById(planId)
      form.setFieldsValue({
        planName: planResponse.planName,
        price: planResponse.price,
        duration: planResponse.duration,
        description: planResponse.description,
        features: planResponse.features.map((feature) => feature.featureName)
      })

      setIsModalOpen(true)
      setIsUpdateMode(true)
      setSelectedPlanId(planId)
    } catch (error) {
      console.error('Error while fetching plan:', error)
      message.error('Failed to fetch plan details for update')
    }
  }

  return (
    <>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Membership Plans</h1>
        <div className='flex space-x-4'>
          <button
            onClick={handleModalClick}
            className='flex items-center bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all'
          >
            <FileAddFilled className='w-5 h-5 text-[#7aeecb] mr-2' />
            <span className='text-[#7aeecb] font-semibold'>Create</span>
          </button>
          <button
            className={`flex items-center bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
            <span className='text-[#EE7A7A] font-semibold'>Report</span>
          </button>
        </div>
      </div>
      <div className='bg-white p-10 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Input.Search className='w-1/3 mr-4' placeholder='Search' />
          <Select
            defaultValue='newest'
            style={{ width: 120 }}
            options={[
              { value: 'jack', label: 'Jack' },
              { value: 'newest', label: 'Newest' },
              { value: 'Yiminghe', label: 'Yiminghe' }
            ]}
          />
        </div>
        <Table dataSource={plans} columns={columns} pagination={{ pageSize: 8 }} />
      </div>

      <Modal
        title={isUpdateMode ? 'Update Membership Plan' : 'Create Membership Plan'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleModalSubmit}
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Plan Name'
            name='planName'
            rules={[{ required: true, message: 'Please input the plan name' }]}
          >
            <Input placeholder='Enter plan name' />
          </Form.Item>
          <Form.Item label='Price' name='price' rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input placeholder='Enter price (e.g., $10.00)' />
          </Form.Item>
          <Form.Item
            label='Duration'
            name='duration'
            rules={[{ required: true, message: 'Please input the duration!' }]}
          >
            <Input placeholder='Enter duration' />
          </Form.Item>
          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input placeholder='Enter description' />
          </Form.Item>
          <Form.Item
            label='Features'
            name='features'
            rules={[{ required: true, message: 'Please select at least one feature!' }]}
          >
            <Select
              mode='multiple'
              placeholder='Select features'
              options={featureList.map((feature) => ({ label: feature.featureName, value: feature.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
