import React from 'react'
import styled from 'styled-components'
//--
import { style } from '@/theme'
import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons'

interface CardProps {
  title: string
  description: string
}

const CardContainer = styled.div<STYLES.IStyles>`
  border: 2px solid ${style.COLORS.RED.RED_1};
  border-radius: 10px;
  padding: 30px;
  margin: 8px;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};

  .logo {
    border: 2px solid ${style.COLORS.RED.RED_1};
    border-radius: 50%;
    color: ${style.COLORS.RED.RED_1};
    font-size: 0.5rem;
    font-weight: bold;
    padding: 4px;
    margin-right: 12px;
  }
  .content {
    padding: 16px 0;
  }
`

export default function CardReason(props: CardProps & STYLES.IStyles) {
  const { title, description, width, height } = props

  return (
    <CardContainer width={width} height={height} className='bg-white'>
      <div className='text-red-400 font-bold text-xl'>
        <DoubleRightOutlined className='bg-red-400 text-white p-1 me-4' style={{ borderRadius: '50%' }} />
        {title}
      </div>
      <div className='flex justify-between'>
        <div className='ps-7'>
          <p className='flex items-center p-2'>
            <CheckOutlined className='logo' />
            <span className='font-light'>{description}</span>
          </p>
          <p className='flex items-center p-2'>
            <CheckOutlined className='logo' />
            <span className='font-light'>{description}</span>
          </p>
          <p className='flex items-center p-2'>
            <CheckOutlined className='logo' />
            <span className='font-light'>{description}</span>
          </p>
          <p className='flex items-center p-2'>
            <CheckOutlined className='logo' />
            <span className='font-light'>{description}</span>
          </p>
        </div>
        <div className='w-1/2 flex justify-center'>
          <img
            src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736848318/PregnaCare/oa3zuazyvqgi2y9ef7ec.png'
            alt='pregnancy'
          />
        </div>
      </div>
    </CardContainer>
  )
}
