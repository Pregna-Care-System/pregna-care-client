import { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectMembershipPlans } from '@/store/modules/global/selector'
import CarouselMembershipPlans from '@/components/Carousel/CarouselMembershipPlans'

export default function MemberShipPlanPage() {
  const plans = useSelector(selectMembershipPlans)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedPlan, setSelectedPlan] = useState<MODEL.PlanResponse | null>(null)

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

  const handleUpgrade = () => {
    if (selectedPlan) {
      navigate(
        `/checkout?planId=${selectedPlan.membershipPlanId}&planName=${encodeURIComponent(selectedPlan.planName)}&planPrice=${encodeURIComponent(selectedPlan.price)}`
      )
    } else {
      message.error('Please select a plan before upgrading.')
    }
  }

  return (
    <div
      className='px-4 py-36 flex justify-center'
      style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}
    >
      <div
        className='border border-solid rounded-3xl w-11/12 lg:w-10/12 shadow-md py-6'
        style={{
          background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)'
        }}
      >
        <h1 className='text-2xl lg:text-3xl font-bold mb-3 text-center'>Features and Pricing</h1>
        <h4 className='text-gray-500 mb-8 px-4 lg:px-8 text-center text-sm lg:text-base'>
          Whether your time-saving automation needs are large or small, we're here to help you scale.
        </h4>

        <div className='grid grid-cols-12'>
          <div className='col-span-10 col-start-2'>
            <CarouselMembershipPlans
              membershipPlans={plans}
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
            />
          </div>
        </div>
        <div className='text-center mb-4'>
          <Button type='primary' size='large' onClick={handleUpgrade} danger>
            Upgrade to {selectedPlan ? selectedPlan.planName : 'a plan'}
          </Button>
        </div>
      </div>
    </div>
  )
}
