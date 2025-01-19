import React from 'react'
import { Button, Card, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface PlanCardProps {
  plan: {
    name: string
    price: number
    image: string
    features: string[]
    recommended: boolean
  }
  isSelected: boolean
  onSelect: () => void
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const navigate = useNavigate()
  const handleMoreClick = () => {
    navigate(`/detail-plan/${plan.name}`)
  }

  return (
    <Card
      hoverable
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 shadow-lg scale-105' : 'hover:border-blue-500 hover:shadow-md'
      }`}
      style={{ width: '300px' }}
      onClick={onSelect}
      title={
        <div className='flex justify-between items-center'>
          <span className='text-lg font-bold'>{plan.name}</span>
          {plan.recommended && <Tag color='red'>Recommended</Tag>}
        </div>
      }
    >
      <img src={plan.image} alt={plan.name} className='w-full h-40 object-cover rounded-md mb-4' />
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
      <Button type='primary' onClick={handleMoreClick} className='mt-4'>
        More
      </Button>
    </Card>
  )
}
