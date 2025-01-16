import React from 'react'
import { Card, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

interface PlanCardProps {
  plan: {
    name: string
    price: number
    features: string[]
    recommended: boolean
  }
  isSelected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <Card
      hoverable
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-lg scale-105' : 'hover:border-blue-500 hover:shadow-md'
      }`}
      onClick={onSelect}
      title={
        <div className='flex justify-between items-center'>
          <span className='text-lg font-bold'>{plan.name}</span>
          {plan.recommended && <Tag color='blue'>Recommended</Tag>}
        </div>
      }
    >
      <p className='text-3xl font-bold mb-4'>
        {plan.price.toLocaleString('vi-VN')} ₫<span className='text-base font-normal'>/month</span>
      </p>
      <ul className='space-y-2'>
        {plan.features.map((feature, index) => (
          <li key={index} className='flex items-center'>
            <CheckOutlined className='mr-2 text-green-500' />
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  )
}
