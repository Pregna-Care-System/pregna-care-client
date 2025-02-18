import type React from 'react'
import { Button, Tag, Tooltip } from 'antd'
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import styled, { createGlobalStyle } from 'styled-components'
import { style } from '@/theme'

const GlobalStyle = createGlobalStyle`
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
    border: transparent;
  }
`

const StyledCard = styled.div<{ isSelected: boolean }>`
  width: 280px;
  height: 500px;
  border-radius: 8px;
  box-shadow:
    rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  transition: all 0.1s ease-out;
  cursor: pointer;
  background: white;
  overflow: hidden;

  ${({ isSelected }) =>
    isSelected &&
    `
    border: 2px solid ${style.COLORS.RED.RED_2};
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  `}

  &:hover {
    ${({ isSelected }) =>
      !isSelected &&
      `
      border: 2px solid ${style.COLORS.RED.RED_2};
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    `}
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

const PlanName = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
`

const ScrollableContent = styled.div`
  height: 192px;
  overflow-y: auto;
  padding: 0 16px;
`

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
`

const FeatureText = styled.span`
  flex: 1;
`

const FeatureInfo = styled.span`
  margin-left: 4px;
  color: #1890ff;
  cursor: pointer;
`

interface Feature {
  id: string | number
  featureName: string
  featureDescription?: string
}

interface PlanCardProps {
  plan: {
    planName: string
    price: number
    image: string
    features: Feature[]
    recommended: boolean
  }
  isSelected: boolean
  onSelect: () => void
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const navigate = useNavigate()

  const handleMoreClick = (planName: string) => {
    navigate(`${ROUTES.MEMBESHIP_PLANS}/${planName}`)
  }

  return (
    <>
      <GlobalStyle />
      <StyledCard isSelected={isSelected} onClick={onSelect}>
        <CardHeader>
          <PlanName>{plan.planName}</PlanName>
          {plan.recommended && <Tag color='red'>Recommended</Tag>}
        </CardHeader>
        <img src={plan.image || '/placeholder.svg'} alt={plan.planName} className='w-full h-28 object-cover mb-4 p-2' />
        <p className='text-3xl font-bold mb-4 px-4'>
          {plan.price.toLocaleString('vi-VN')} ₫<span className='text-base font-normal'></span>
        </p>
        <ScrollableContent className='custom-scrollbar'>
          <FeatureList>
            {plan.features.map((feature) => (
              <FeatureItem key={feature.id}>
                <CheckOutlined className='mr-2 text-green-500 flex-shrink-0 mt-1' />
                <FeatureText>{feature.featureName}</FeatureText>
                {feature.featureDescription && (
                  <Tooltip title={feature.featureDescription}>
                    <FeatureInfo>
                      <InfoCircleOutlined />
                    </FeatureInfo>
                  </Tooltip>
                )}
              </FeatureItem>
            ))}
          </FeatureList>
        </ScrollableContent>
        <div className='px-4 mt-4'>
          <Button onClick={() => handleMoreClick(plan.planName)} danger block>
            More
          </Button>
        </div>
      </StyledCard>
    </>
  )
}
