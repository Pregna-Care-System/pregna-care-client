import { Rate } from 'antd'
import React from 'react'
import styled from 'styled-components'

const CardContainer = styled.div`
  background-color: white;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  margin: 1rem;
`

export default function CardTestimonials() {
  return (
    <CardContainer>
      <div className='mb-8'>
        <Rate disabled defaultValue={4} className='mb-4' />
        <p className='m-0'>
          "Absolutely love this app! It's been my daily pregnancy companion, offering personalized tips and updates.
          Can't wait for the official release! ”
        </p>
      </div>
      <div className='flex justify-between'>
        <div className='text-xs'>
          <p className='m-0'>Jessica Thompson</p>
          <p className='m-0 font-light'>Nurse</p>
          <p className='m-0 font-light'>NY, USA</p>
        </div>
        <img
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'
          alt='avatar'
        />
      </div>
    </CardContainer>
  )
}
