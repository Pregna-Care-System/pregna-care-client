import React from 'react'
import styled from 'styled-components'
import { RadarChartOutlined, RightCircleOutlined } from '@ant-design/icons'
import { style } from '@/theme'
import { Link } from 'react-router-dom'

interface CardProps {
  title: string
  description: string
}

const CardContainer = styled.div<STYLES.IStyles>`
  border: 2px solid ${style.COLORS.RED.BG_1};
  border-radius: 10px 100px 10px 10px;
  padding: 30px;
  margin: 8px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};

  .logo {
    width: 15%;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    padding: 6px;
  }
  .content {
    padding: 16px 0;
  }
`

export default function CardService(props: CardProps & STYLES.IStyles) {
  const { title, description, width, height } = props
  return (
    <CardContainer width={width} height={height}>
      <div className='logo bg-red-400'>
        <RadarChartOutlined className='text-4xl text-white' />
      </div>
      <div className='content'>
        <h5 className='font-bold text-xl'>{title}</h5>
        <p className='m-0 font-light pt-4'>{description}</p>
      </div>
      <div className='actions'>
        <Link to={''} className='text-red-400 font-bold'>
          Explore more
          <RightCircleOutlined className='ms-2 text-xs' />
        </Link>
      </div>
    </CardContainer>
  )
}
