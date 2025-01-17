import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { useLocation } from 'react-router-dom'
import { PlanCard } from './components/PlanCard'
import { UpgradeModal } from './components/UpgradeModal'

const plans = [
  {
    name: 'Basic',
    price: 199000,
    features: ['1 user', '10 projects', '5GB storage', 'Basic support'],
    recommended: false
  },
  {
    name: 'Pro',
    price: 399000,
    features: ['5 users', 'Unlimited projects', '50GB storage', 'Priority support'],
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 999000,
    features: ['Unlimited users', 'Unlimited projects', '500GB storage', '24/7 dedicated support'],
    recommended: false
  }
]

export default function PlanUpgrade() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation()

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
    setIsModalOpen(true)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
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
        <Button type='primary' size='large' onClick={handleUpgrade}>
          Upgrade to {selectedPlan.name}
        </Button>
      </div>
      <UpgradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} plan={selectedPlan} />
    </div>
  )
}
