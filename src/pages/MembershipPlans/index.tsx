import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { useLocation } from 'react-router-dom'
import { PlanCard } from './components/PlanCard'
import { UpgradeModal } from './components/UpgradeModal'
const plans = [
  {
    name: 'Free Trial',
    price: 0,
    image: 'https://vnmanpower.com/images/blog/2024/08/01/original/1702703460phpkdvijb_1722525919.jpeg',
    duration: '3 Days',
    features: ['Access to all basic', 'No credit card required', 'Experience the platform'],
    recommended: false
  },
  {
    name: 'Each Month',
    price: 19,
    image:
      'https://static.vecteezy.com/system/resources/previews/011/426/917/non_2x/profitable-pricing-strategy-price-formation-promo-action-clearance-shopping-idea-design-element-cheap-products-advertisement-customers-attraction-vector.jpg',
    duration: '/month',
    features: ['Full access to all', 'Priority customer support', 'Cancel anytime with no extra charges'],
    recommended: true
  },
  {
    name: 'Lifetime Package',
    price: 199,
    image:
      'https://cdn.prod.website-files.com/62137861fa1d2b19482bbe20/661f4d3ebe29f59f7a1ca27d_660ee5e0cde21d6398a37cfc_Dynamic%2520Pricing%2520vs%2520Surge%2520Pricing.webp',
    duration: '/year',
    features: ['All features unlocked', 'Exclusive lifetime', 'No recurring payments'],
    recommended: false
  }
]

export default function MemberShipPlanPage() {
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
    <div
      className='container flex justify-center mx-auto px-4 py-8'
      style={{
        background: 'linear-gradient(to bottom, #f6e3e1, #f0f8ff)',
        minHeight: '100vh'
      }}
    >
      <div
        className='border border-solid rounded-3xl w-10/12 shadow-md mt-20 mb-20'
        style={{
          background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)',
          minHeight: '100vh'
        }}
      >
        <h1 className='text-3xl font-bold mb-4 text-left text-red-400 px-8 pt-8'>Features and Pricing</h1>
        <h4 className='text-gray-500 text-left mb-16 px-8'>
          Whether your time-saving automation needs are large or small, we’re here to help you scale.
        </h4>

        <div className='grid grid-cols-1 md:grid-cols-3 justify-center mb-8'>
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
          <Button
            type='primary'
            size='large'
            style={{
              backgroundColor: '#f87171',
              color: '#fff',
              marginBottom: '40px',
              marginTop: '40px'
            }}
            onClick={handleUpgrade}
          >
            Upgrade to {selectedPlan.name}
          </Button>
        </div>
      </div>
      <UpgradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} plan={selectedPlan} />
    </div>
  )
}
