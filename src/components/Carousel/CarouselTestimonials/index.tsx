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

export default function CarouselTestimonials() {
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
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
      <SwiperSlide>
        <CardTestimonials />
      </SwiperSlide>
    </Swiper>
  )
}
