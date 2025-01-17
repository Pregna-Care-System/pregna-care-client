import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
// import required modules
import './style.css'
import CardTestimonials from '@/components/Card/CardTestimonials'

interface CarouselTestimonialsProps {
  testimonials: Testimonial[]
}

interface Testimonial {
  rating: number
  userInfo: {
    name: string
    profession: string
    location: string
    avatar: string
  }
  content: string
}

export default function CarouselTestimonials(props: CarouselTestimonialsProps) {
  const { testimonials } = props
  const renderTestimonials = testimonials.map((item, index) => {
    return (
      <SwiperSlide key={index}>
        <CardTestimonials rating={item.rating} userInfo={item.userInfo} content={item.content} />
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
        // when window width is >= 640px
        640: {
          slidesPerView: 1
        },
        // when window width is >= 1024px
        1024: {
          slidesPerView: 3
        }
      }}
      modules={[Grid, Pagination]}
      className='mySwiper'
    >
      {renderTestimonials}
    </Swiper>
  )
}
