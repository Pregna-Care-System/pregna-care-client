import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Input, message, Modal } from 'antd'
import { CheckCircleOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { getPlanByName, hasFreePlan, upgradeFreePlan } from '@/services/planService'
import { selectMemberInfo, selectUserInfo } from '@/store/modules/global/selector'
import { useSelector } from 'react-redux'

export default function PlanDetail() {
  const { planName } = useParams()
  const [planDetail, setPlanDetail] = useState<MODEL.PlanResponse | null>(null)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const member = useSelector(selectMemberInfo)
  const user = useSelector(selectUserInfo)
  const userId = user?.id
  const currentPlanName = member?.planName || ''
  const [form] = Form.useForm()
  const [hasFreePlanState, setHasFreePlanState] = useState(false)
  useEffect(() => {
    const fetchPlans = async () => {
      if (!planName) return
      const data = await getPlanByName(planName)
      setPlanDetail(data)
    }
    fetchPlans()
  }, [planName])
  useEffect(() => {
    const checkFreePlan = async () => {
      const res = await hasFreePlan(userId)
      setHasFreePlanState(res.data.hasFreePlan)
    }
    checkFreePlan()
  }, [userId])
  if (!planDetail) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400'></div>
      </div>
    )
  }

  if (!planName) {
    return <div className='flex items-center justify-center min-h-screen text-gray-600'>Plan not found</div>
  }

  const handleUpgrade = () => {
    if (planDetail.planName === currentPlanName) {
      message.warning('You are using this plan')
      return
    }
    if (hasFreePlanState && planDetail.planName === 'FreePlan') {
      message.warning('You already upgraded Free Plan before! Choose another plan to upgrade now.')
      return
    }
    if (planDetail.planName === 'FreePlan') {
      setIsModalOpen(true)
    } else {
      navigate(
        `/checkout?planId=${planDetail.membershipPlanId}&planName=${encodeURIComponent(planDetail.planName)}&planPrice=${encodeURIComponent(planDetail.price)}`
      )
    }
  }
  const handleConfirmUpgrade = async () => {
    try {
      if (!userId) {
        message.error('User ID not found. Please log in again.')
        return
      }
      await upgradeFreePlan(userId)
      message.success('Successfully upgraded to Free Plan!')
      setIsModalOpen(false)
    } catch (error) {
      message.error('Failed to upgrade plan. Please try again.')
    }
  }
  return (
    <div
      className='flex justify-center px-4 py-8 min-h-screen'
      style={{
        background: 'linear-gradient(135deg, #fce7e7 0%, #e9f3ff 100%)'
      }}
    >
      <div className='container mx-auto max-w-6xl'>
        <div
          className='mt-20 mb-20 overflow-hidden bg-white rounded-3xl shadow-xl transform transition-all duration-300 hover:shadow-2xl'
          style={{
            minHeight: '70vh'
          }}
        >
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between'>
              <div>
                <h1 className='font-bold text-4xl mb-3 text-gray-800 tracking-tight'>{planDetail.planName}</h1>
                <div className='mb-8'>
                  <span className='text-4xl font-bold text-rose-500'>
                    {planDetail.price.toLocaleString('vi-VN')} VND
                  </span>
                  <span className='text-gray-500 ml-2'>
                    {planDetail.planName === 'FreePlan' ? '/3 days' : '/month'}
                  </span>
                </div>
                <div className='space-y-4 mb-8'>
                  {planDetail.features.map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 group transition-all duration-300 hover:translate-x-1'
                    >
                      <CheckCircleOutlined className='text-rose-400 text-xl group-hover:text-rose-500' />
                      <span className='text-gray-600 text-lg'>{feature.featureName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='mt-8'>
                <Button
                  type='primary'
                  size='large'
                  className='w-full md:w-auto transition-all duration-300 hover:scale-105'
                  style={{
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #f87171 100%)',
                    border: 'none',
                    height: '50px',
                    fontSize: '1.1rem',
                    paddingLeft: '2rem',
                    paddingRight: '2rem'
                  }}
                  onClick={handleUpgrade}
                >
                  Upgrade to {planDetail.planName}
                </Button>
              </div>
            </div>

            <div className='w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-rose-50 to-blue-50'>
              <div className='relative w-full h-full max-h-[400px] overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105'>
                <img src={planDetail.imageUrl} alt={planDetail.planName} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={
          <div className='text-center pb-6 border-b border-gray-200'>
            <h1 className='text-2xl font-semibold text-red-400'>Enter Your Information</h1>
            <p className='text-sm text-gray-500 mt-2'>Please fill in your details to continue</p>
          </div>
        }
        open={isModalOpen}
        onOk={handleConfirmUpgrade}
        onCancel={() => setIsModalOpen(false)}
        width={480}
        centered
        className='[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-6'
        footer={null}
      >
        <div className='py-6'>
          <Form form={form} layout='vertical' className='space-y-4'>
            <Form.Item
              label={<span className='text-gray-700 font-medium'>Full Name</span>}
              name='fullName'
              rules={[{ required: true, message: 'Please enter your full name' }]}
              className='mb-6'
            >
              <Input
                prefix={<UserOutlined className='text-gray-400' />}
                placeholder='Enter your full name'
                className='h-11 text-base rounded-lg [&_.ant-input-prefix]:mr-2
                  [&_.ant-input]:placeholder-gray-400 border-gray-200
                  hover:border-blue-400 focus:border-blue-400'
              />
            </Form.Item>

            <Form.Item
              label={<span className='text-gray-700 font-medium'>Email Address</span>}
              name='email'
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
              className='mb-6'
            >
              <Input
                prefix={<MailOutlined className='text-gray-400' />}
                placeholder='Enter your email'
                className='h-11 text-base rounded-lg [&_.ant-input-prefix]:mr-2
                  [&_.ant-input]:placeholder-gray-400 border-gray-200
                  hover:border-blue-400 focus:border-blue-400'
              />
            </Form.Item>

            <Form.Item
              label={<span className='text-gray-700 font-medium'>Phone Number</span>}
              name='phone'
              rules={[{ required: true, message: 'Please enter your phone number' }]}
              className='mb-6'
            >
              <Input
                prefix={<PhoneOutlined className='text-gray-400' />}
                placeholder='Enter your phone number'
                className='h-11 text-base rounded-lg [&_.ant-input-prefix]:mr-2
                  [&_.ant-input]:placeholder-gray-400 border-gray-200
                  hover:border-blue-400 focus:border-blue-400'
              />
            </Form.Item>

            <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
              <Button
                onClick={() => setIsModalOpen(false)}
                className='px-6 h-10 text-gray-600 border-gray-300 hover:border-gray-400
                  hover:text-gray-800 transition-colors'
              >
                Cancel
              </Button>
              <Button
                type='primary'
                onClick={handleConfirmUpgrade}
                className='px-6 h-10 bg-blue-500 hover:bg-blue-600 border-none
                  transition-colors'
                danger
              >
                Upgrade
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
