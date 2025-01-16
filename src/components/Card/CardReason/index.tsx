import React from 'react'
import styled from 'styled-components'
//--
import { style } from '@/theme'
import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { animated, useSpring } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'

interface CardProps {
  title: string
  description: string[]
  image: string
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
  const { title, description, image, width, height } = props

  // Add intersection observer
  const [ref, inView] = useInView({
    threshold: 0.2,
    rootMargin: '-50px'
  })

  // Slide-in animation
  const slideAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateX(0)' : 'translateX(-100px)',
    config: { tension: 280, friction: 20 },
    reset: true
  })

  // Hover animation
  const [hover, setHover] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 }
  }))

  const renderDescription = description.map((item, index) => {
    return (
      <p key={index} className='flex items-center p-2'>
        <CheckOutlined className='logo' />
        <span className='font-light'>{item}</span>
      </p>
    )
  })

  return (
    <animated.div
      ref={ref}
      style={{
        ...slideAnimation,
        ...hover
      }}
      onMouseEnter={() => setHover({ scale: 1.02 })}
      onMouseLeave={() => setHover({ scale: 1 })}
    >
      <CardContainer width={width} height={height} className='bg-white'>
        <div className='text-red-500 font-bold text-xl'>
          <DoubleRightOutlined className='bg-red-500 text-white p-1 me-4' style={{ borderRadius: '50%' }} />
          {title}
        </div>
        <div className='flex justify-between'>
          <div className='ps-7'>
            <div className='content'>{renderDescription}</div>
          </div>
          <div className='w-1/2 flex justify-center'>
            <img src={image} alt='pregnancy' />
          </div>
        </div>
      </CardContainer>
    </animated.div>
  )
}
