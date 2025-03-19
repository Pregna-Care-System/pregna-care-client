import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Pagination } from 'swiper/modules'
import PlanCard from '@/components/Card/CardMembershipPlans'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
// import required modules
import './style.css'

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
console.log('hhh',recommend)
  const renderMembershipPlans = membershipPlans.map((plan: MODEL.PlanResponse) => {
    console.log('huhu', plan.membershipPlanId)
    return (
      <SwiperSlide key={plan.membershipPlanId}>
        <PlanCard
          plan={plan}
          isSelected={selectedPlan?.membershipPlanId === plan.membershipPlanId}
          onSelect={() => onSelectPlan(plan)}
          currentPlanName={currentPlanName}
          isRecommended={recommend === plan.membershipPlanId}
        />
      </SwiperSlide>
    )
  })

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
