import { useEffect, useState } from 'react'
import { Button, Form, Input, message, Modal } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectMemberInfo, selectMembershipPlans, selectUserInfo } from '@/store/modules/global/selector'
import CarouselMembershipPlans from '@/components/Carousel/CarouselMembershipPlans'
import { hasFreePlan, upgradeFreePlan } from '@/services/planService'
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'

export default function MemberShipPlanPage() {
  const plans = useSelector(selectMembershipPlans)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedPlan, setSelectedPlan] = useState<MODEL.PlanResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useSelector(selectUserInfo)
  const userId = user?.id
  const [form] = Form.useForm()
  const member = useSelector(selectMemberInfo)
  const currentPlanName = member?.planName || ''
  const [hasFreePlanState, setHasFreePlanState] = useState(false)
  const recommendPlanId = plans.find((plan) => plan.planName === 'StandardPlan')?.membershipPlanId || null
  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
  }, [dispatch])

  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0])
    }
  }, [plans, selectedPlan])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const status = searchParams.get('status')
    if (status === 'success') {
      message.success('Your plan has been successfully upgraded!')
    } else if (status === 'failure') {
      message.error('There was an issue with your payment. Please try again.')
    }
  }, [location])

  useEffect(() => {
    const checkFreePlan = async () => {
      const res = await hasFreePlan(userId)
      setHasFreePlanState(res.data.hasFreePlan)
    }
    checkFreePlan()
  }, [userId])
  const handleUpgrade = async () => {
    if (!selectedPlan) {
      message.error('Please select a plan before upgrading')
      return
    }
    if (selectedPlan.planName === currentPlanName) {
      message.warning('You are using this plan')
      return
    }
    if (hasFreePlanState && selectedPlan.planName === 'FreePlan') {
      message.warning('You already upgraded Free Plan before! Choose another plan to upgrade now.')
      return
    }
    if (selectedPlan.planName === 'FreePlan') {
      // Nếu chọn Free Plan thì mở modal xác nhận
      setIsModalOpen(true)
    } else {
      // Nếu chọn plan khác thì điều hướng đến trang checkout
      navigate(
        `/checkout?planId=${selectedPlan.membershipPlanId}&planName=${encodeURIComponent(selectedPlan.planName)}&planPrice=${encodeURIComponent(selectedPlan.price)}`
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
      className='px-4 py-36 flex justify-center'
      style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}
    >
      <div className='border border-solid rounded-3xl w-11/12 lg:w-10/12 shadow-2xl py-6 bg-white'>
        <h1 className='text-2xl lg:text-3xl text-[#ff6b81] font-bold mb-3 text-center'>Features and Pricing</h1>
        <h4 className='text-gray-500 mb-8 px-4 lg:px-8 text-center text-sm lg:text-base'>
          Whether your time-saving automation needs are large or small, we're here to help you scale.
        </h4>

        <div className='grid grid-cols-12'>
          <div className='col-span-10 col-start-2'>
            <CarouselMembershipPlans
              membershipPlans={plans}
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              currentPlanName={currentPlanName}
              recommend={recommendPlanId}
            />
          </div>
        </div>
        <div className='text-center mb-4'>
          <Button
            type='primary'
            size='large'
            onClick={handleUpgrade}
            danger
            disabled={selectedPlan && selectedPlan.price < (member?.planPrice || 0)}
          >
            Upgrade to {selectedPlan ? selectedPlan.planName : 'a plan'}
          </Button>
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
