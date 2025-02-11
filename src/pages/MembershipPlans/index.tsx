import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlanCard } from './components/PlanCard'
import { useDispatch, useSelector } from 'react-redux'
import { selectMembershipPlans } from '@/store/modules/global/selector'

export default function MemberShipPlanPage() {
  const plans = useSelector(selectMembershipPlans)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [selectedPlan, setSelectedPlan] = useState<MODEL.PlanResponse | null>(plans[0])

  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
  }, [])

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
    navigate(
      `/checkout?planId=${selectedPlan.membershipPlanId}&planName=${encodeURIComponent(selectedPlan.planName)}&planPrice=${encodeURIComponent(selectedPlan.price)}`
    )
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
        <h4 className='text-gray-500 mb-8 lg:mb-16 px-4 lg:px-8 text-center text-sm lg:text-base'>
          Whether your time-saving automation needs are large or small, we’re here to help you scale.
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-6 justify-center mb-6 lg:mb-8'>
          <div className='flex justify-center col-start-2 col-span-4 gap-8 w-full'>
            {plans.map((plan, index) => (
              <div key={index} className='px-2'>
                <PlanCard
                  plan={plan}
                  isSelected={plan.planName === selectedPlan?.planName}
                  onSelect={() => setSelectedPlan(plan)}
                />
              </div>
            ))}
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
