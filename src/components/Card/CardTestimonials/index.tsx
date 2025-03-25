import { animated, useSpring } from '@react-spring/web'
import { Rate } from 'antd'
import styled from 'styled-components'

const CardContainer = styled(animated.div)`
  // Convert to animated div
  background-color: white;
  width: 100%;
  height: 16rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  margin: 1rem;
`

interface CardTestimonialsProps {
  rating: number
  email: string
  content: string
}

export default function CardTestimonials(props: CardTestimonialsProps) {
  const { rating, email, content } = props

  // Fade in animation
  const fadeIn = useSpring({
    from: { opacity: 1, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  })

  // Hover animation
  const [hover, api] = useSpring(() => ({
    scale: 1,
    shadow: '0px 5px 15px rgba(0,0,0,0.1)',
    config: { tension: 300, friction: 20 }
  }))

  return (
    <CardContainer
      style={{
        ...fadeIn,
        transform: hover.scale.to((s) => `scale(${s})`),
        boxShadow: hover.shadow
      }}
      onMouseEnter={() => {
        api.start({ scale: 1.02, shadow: '0px 10px 25px rgba(0,0,0,0.15)' })
      }}
      onMouseLeave={() => {
        api.start({ scale: 1, shadow: '0px 5px 15px rgba(0,0,0,0.1)' })
      }}
    >
      <div className='mb-8'>
        <Rate disabled defaultValue={rating} className='mb-4' />
        <animated.p className='m-0'>{content}</animated.p>
      </div>
      <div className='flex justify-between'>
        <div className='text-xs'>
          <p className='m-0'>{email}</p>
        </div>
      </div>
    </CardContainer>
  )
}
