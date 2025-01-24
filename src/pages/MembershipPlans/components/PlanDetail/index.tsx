import React from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectMembershipPlans } from '@/store/modules/global/selector'

export default function PlanDetail() {
  const { planName } = useParams()
  const plans = useSelector(selectMembershipPlans)
  const plan = plans.find((p) => p.name === planName)

  if (!plan) {
    return <div>Plan not found</div>
  }

  return (
    <div
      className=' flex justify-center px-4 py-8'
      style={{
        background: 'linear-gradient(to bottom, #f6e3e1, #f0f8ff)',
        minHeight: '100vh'
      }}
    >
      <div
        className='container mx-auto border border-solid rounded-3xl w-10/12 shadow-md mt-20 mb-20 flex flex-col md:flex-row items-center'
        style={{
          background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)',
          minHeight: '70vh'
        }}
      >
        <div className='w-full md:w-1/2 p-6 text-left'>
          <h1 className='font-bold text-4xl mb-5'>{plan.name}</h1>
          <p className='text-3xl font-bold mb-4'>
            {plan.price.toLocaleString('vi-VN')} ₫<span className='text-base font-normal'> {plan.duration}</span>
          </p>
          <ul className='space-y-2 mb-6'>
            {plan.features.map((feature, index) => (
              <li key={index} className='flex items-center'>
                <CheckOutlined className='mr-2 text-green-500' />
                {feature}
              </li>
            ))}
          </ul>
          <div className='text-left'>
            <Button
              type='primary'
              size='large'
              style={{
                borderColor: '#f87171',
                color: '#f87171',
                backgroundColor: 'transparent',
                borderWidth: '1px'
              }}
            >
              Upgrade to {plan.name}
            </Button>
          </div>
        </div>

        <div className='w-full md:w-1/2 p-6'>
          <img
            src={plan.image}
            alt={plan.name}
            className='w-full h-60 object-cover rounded-md'
            style={{ maxHeight: '300px', borderRadius: '12px' }}
          />
        </div>
      </div>
    </div>
  )
}
