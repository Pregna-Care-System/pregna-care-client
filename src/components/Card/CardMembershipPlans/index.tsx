import { Button, Card, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'

interface PlanCardProps {
  plan: {
    planName: string
    price: number
    image: string
    features: string[]
    recommended: boolean
  }
  isSelected: boolean
  onSelect: () => void
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const navigate = useNavigate()

  const handleMoreClick = () => {
    navigate(`${ROUTES.DETAIL_PLAN}/${plan.planName}`)
  }

  return (
    <Card
      hoverable
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-red-400 shadow-lg scale-105' : 'hover:border-red-400 hover:shadow-md'
      }`}
      style={{ width: 300 }}
      onClick={onSelect}
      title={
        <div className='flex justify-between items-center'>
          <span className='text-lg font-bold'>{plan.planName}</span>
          {plan.recommended && <Tag color='red'>Recommended</Tag>}
        </div>
      }
    >
      <img src={plan.image} alt={plan.planName} className='w-full h-40 object-cover rounded-md mb-4' />
      <p className='text-3xl font-bold mb-4'>
        {plan.price.toLocaleString('vi-VN')} ₫<span className='text-base font-normal'></span>
      </p>
      <ul className='space-y-2'>
        {plan.features.map((feature, index) => (
          <li key={index} className='flex items-center'>
            <CheckOutlined className='mr-2 text-green-500' />
            {feature.featureName}
          </li>
        ))}
      </ul>
      <Button type='primary' className='mt-4' onClick={handleMoreClick} danger>
        More
      </Button>
    </Card>
  )
}
