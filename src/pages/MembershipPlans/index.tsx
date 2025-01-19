import React, { useState } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PlanCard } from './components/PlanCard'
import { useSelector } from 'react-redux'
import { selectMembershipPlans } from '@/store/modules/global/selector'

export default function PlanUpgrade() {
  const plans = useSelector(selectMembershipPlans)
  const [selectedPlan, setSelectedPlan] = useState(plans[0])
  const navigate = useNavigate()

  const handleUpgrade = () => {
    navigate(
      `/checkout?planName=${encodeURIComponent(selectedPlan.name)}&planPrice=${encodeURIComponent(selectedPlan.price.toString())}`
    )
  }

  return (
    <div className='container mx-auto px-4 py-36'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Upgrade Your Plan</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            isSelected={plan.name === selectedPlan.name}
            onSelect={() => setSelectedPlan(plan)}
          />
        ))}
      </div>
      <div className='text-center'>
        <Button type='primary' size='large' onClick={handleUpgrade} danger>
          Upgrade to {selectedPlan.name}
        </Button>
      </div>
    </div>
  )
}
