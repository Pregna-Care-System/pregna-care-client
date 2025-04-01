import { animated, useSpring } from '@react-spring/web'
import { Rate, Button } from 'antd'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'

const CardContainer = styled(animated.div)`
  background-color: white;
  width: 100%;
  height: 16rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  margin: 1rem;
  overflow: hidden;
`

const ContentContainer = styled.div`
  position: relative;
  overflow: hidden;
`

interface CardTestimonialsProps {
  rating: number
  email: string
  content: string
}

export default function CardTestimonials(props: CardTestimonialsProps) {
  const { rating, email, content } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setShowMore(isOverflowing)
    }
  }, [content])

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
        boxShadow: hover.shadow,
        height: isExpanded ? 'auto' : '16rem'
      }}
      onMouseEnter={() => {
        api.start({ scale: 1.02, shadow: '0px 10px 25px rgba(0,0,0,0.15)' })
      }}
      onMouseLeave={() => {
        api.start({ scale: 1, shadow: '0px 5px 15px rgba(0,0,0,0.1)' })
      }}
    >
      <ContentContainer>
        <div className='mb-8'>
          <Rate disabled defaultValue={rating} className='mb-4' />
          <div ref={contentRef} className={`${!isExpanded ? 'line-clamp-4' : ''}`}>
            <animated.p className='m-0 break-words whitespace-pre-wrap'>{content}</animated.p>
          </div>
          {showMore && (
            <Button 
              type="link" 
              className='p-0 text-red-500 hover:text-red-600'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'More'}
            </Button>
          )}
        </div>
      </ContentContainer>
      <div className='flex justify-between'>
        <div className='text-xs'>
          <p className='m-0'>{email}</p>
        </div>
      </div>
    </CardContainer>
  )
}
