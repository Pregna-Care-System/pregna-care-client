import { Carousel } from 'antd'
import React from 'react'
import styled from 'styled-components'

interface CarouselProps {
  banners: any[]
}

const Content = styled.div`
  height: 600px;
  color: #fff;
  line-height: 160px;
  text-align: center;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid red;
`

export default function CarouselImage(props: CarouselProps) {
  const { banners } = props

  const renderBanner = () => {
    return banners.map((item: any, index: number) => {
      return (
        <div key={index}>
          <Content style={{ backgroundImage: `url(${item.picture})` }}></Content>
        </div>
      )
    })
  }
  return (
    <>
      <Carousel effect='fade'>{renderBanner()}</Carousel>
    </>
  )
}
