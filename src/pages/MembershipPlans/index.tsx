import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlanCard } from './components/PlanCard'
import { useSelector } from 'react-redux'
import { selectMembershipPlans } from '@/store/modules/global/selector'

export default function PlanUpgrade() {
  const plans = useSelector(selectMembershipPlans)
  const [selectedPlan, setSelectedPlan] = useState(plans[0])
  const location = useLocation()
  const navigate = useNavigate()

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
      `/checkout?planName=${encodeURIComponent(selectedPlan.name)}&planPrice=${encodeURIComponent(selectedPlan.price.toString())}`
    )
  }

  return (
    <div
      className='px-4 py-36 flex justify-center'
      style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}
    >
      <div
        className='border border-solid rounded-3xl w-10/12 shadow-md py-8'
        style={{
          background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)'
        }}
      >
        <h1 className='text-3xl font-bold mb-4 text-center'>Features and Pricing</h1>
        <h4 className='text-gray-500 mb-16 px-8 text-center'>
          Whether your time-saving automation needs are large or small, we’re here to help you scale.
        </h4>
        <div className='grid md:grid-cols-6 justify-center mb-8'>
          <div className='flex justify-center col-start-2 col-span-4 gap-8 w-full'>
            {plans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                isSelected={plan.name === selectedPlan.name}
                onSelect={() => setSelectedPlan(plan)}
              />
            ))}
          </div>
        </div>
        <div className='text-center mb-4'>
          <Button type='primary' size='large' onClick={handleUpgrade} danger>
            Upgrade to {selectedPlan.name}
          </Button>
        </div>
      </div>
    </div>
  )
}
