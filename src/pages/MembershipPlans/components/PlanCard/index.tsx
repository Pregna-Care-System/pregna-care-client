import { Button, Card, Tag } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import './style.css'

interface PlanCardProps {
  plan: {
    planName: string
    price: number
    imageUrl: string
    features: string[]
    isRecommend: boolean
    currentPlanName: string
  }
  isSelected: boolean
  onSelect: () => void
  isRecommended: boolean
}

export function PlanCard({ plan, isSelected, onSelect, currentPlanName, isRecommended }: PlanCardProps) {
  const navigate = useNavigate()

  const handleMoreClick = () => {
    navigate(`${ROUTES.DETAIL_PLAN}/${plan.planName}`)
  }

  return (
    <Card
      hoverable
      className={`cursor-pointer border-red-400 transition-all ${
        isSelected ? 'border-red-400 shadow-lg scale-105' : 'hover:border-red-400 hover:shadow-md'
      }`}
      style={{ width: 300 }}
      onClick={onSelect}
      title={
        <div className='flex justify-between items-center'>
          <span className='text-lg font-bold'>{plan.planName}</span>
          {plan.planName === currentPlanName && <Tag color='green'>Your Plan</Tag>}
          {isRecommended && <Tag color='red'>Recommended</Tag>}
        </div>
      }
    >
      <img src={plan.imageUrl} alt={plan.planName} className='w-full h-40 object-cover rounded-md mb-4' />
      <p className='text-3xl font-bold mb-4'>
        {plan.price.toLocaleString('vi-VN')} ₫<span className='text-base font-normal'></span>
      </p>
      <ul className='space-y-2'>
        {plan.features.map((feature, index) => (
          <li key={index} className='flex items-center'>
            <CheckOutlined className='mr-2 text-green-500' />
            {feature}
          </li>
        ))}
      </ul>
      <Button type='primary' className='mt-4' onClick={handleMoreClick} danger>
        More
      </Button>
    </Card>
  )
}

interface CarouselMembershipPlansProps {
  membershipPlans: MODEL.PlanResponse[]
  selectedPlan: MODEL.PlanResponse | null
  onSelectPlan: (plan: MODEL.PlanResponse) => void
  currentPlanName: string
  recommend: string
}

export default function CarouselMembershipPlans({
  membershipPlans,
  selectedPlan,
  onSelectPlan,
  currentPlanName,
  recommend
}: CarouselMembershipPlansProps) {
  const renderMembershipPlans = membershipPlans.map((plan: MODEL.PlanResponse) => (
    <SwiperSlide key={plan.membershipPlanId}>
      <PlanCard
        plan={plan}
        isSelected={selectedPlan?.membershipPlanId === plan.membershipPlanId}
        onSelect={() => onSelectPlan(plan)}
        currentPlanName={currentPlanName}
        isRecommended={recommend === plan.membershipPlanId}
      />
    </SwiperSlide>
  ))

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={20}
      pagination={{
        clickable: true
      }}
      breakpoints={{
        640: {
          slidesPerView: 1
        },
        1024: {
          slidesPerView: 3
        }
      }}
      modules={[Grid, Pagination]}
      className='mySwiper'
    >
      {renderMembershipPlans}
    </Swiper>
  )
}
