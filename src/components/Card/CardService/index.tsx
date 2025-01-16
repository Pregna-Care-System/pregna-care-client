import React from 'react'
import styled from 'styled-components'
import { RadarChartOutlined, RightCircleOutlined } from '@ant-design/icons'
import { style } from '@/theme'
import { Link } from 'react-router-dom'
import { animated, useSpring } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'

interface CardProps {
  title: string
  description: string
}

const CardContainer = styled.div<STYLES.IStyles>`
  border: 2px solid ${style.COLORS.RED.RED_1};
  border-radius: 10px 100px 10px 10px;
  padding: 30px;
  margin: 8px;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: 2rem;
  margin: 1rem;
  gap: 1.5rem;

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
  // Add intersection observer
  const [ref, inView] = useInView({
    threshold: 0.4,
    rootMargin: '-50px'
  })

  // Scroll animation
  const scrollAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 20 },
    reset: true
  })

  // Hover animation
  const [hover, setHover] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 }
  }))

  return (
    <animated.div
      ref={ref}
      style={{
        ...scrollAnimation,
        ...hover,
        margin: '0 1rem'
      }}
      onMouseEnter={() => setHover({ scale: 1.05 })}
      onMouseLeave={() => setHover({ scale: 1 })}
    >
      <CardContainer width={width} height={height}>
        <div className='logo bg-red-400'>
          <RadarChartOutlined className='text-4xl text-white' />
        </div>
        <div className='content'>
          <h5 className='font-bold text-xl'>{title}</h5>
          <p className='m-0 font-light pt-4'>{description}</p>
        </div>
        <div className='actions'>
          <Link to={''} className='text-red-500 font-bold'>
            Explore more
            <RightCircleOutlined className='ms-2 text-xs' />
          </Link>
        </div>
      </CardContainer>
    </animated.div>
  )
}
