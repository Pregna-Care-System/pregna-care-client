import { Button, Tag, Tooltip } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/utils/config/routes'
import styled, { createGlobalStyle } from 'styled-components'
import { style } from '@/theme'
import { FaInfoCircle } from 'react-icons/fa'

const GlobalStyle = createGlobalStyle`
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.3);
    border-radius: 20px;
    border: transparent;
  }
`

const StyledCard = styled.div<{ isSelected: boolean }>`
  height: 450px;
  border-radius: 16px;
  box-shadow: ${({ isSelected }) =>
    isSelected
      ? 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
      : 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'};
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  overflow: hidden;
  position: relative;
  border: ${({ isSelected }) => (isSelected ? `2px solid ${style.COLORS.RED.RED_2}` : '1px solid #e5e7eb')};
  &:hover {
    transform: translateY(-4px);
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    border: 2px solid ${style.COLORS.RED.RED_2};
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: ${({ theme }) => theme.backgroundColor || '#fff'};
`

const PlanName = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`

const PriceSection = styled.div`
  padding: 20px 24px;
  text-align: center;
  background: #fcfcfc;
`

const Price = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1;

  span {
    font-size: 1rem;
    font-weight: normal;
    color: #6b7280;
    margin-left: 4px;
  }
`

const ScrollableContent = styled.div`
  height: 200px;
  overflow-y: auto;
  padding: 20px 24px;
`

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  color: #4b5563;
  font-size: 0.95rem;
`

const FeatureText = styled.span`
  flex: 1;
  line-height: 1.5;
`

const FeatureInfo = styled.span`
  margin-left: 8px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #6b7280;
  }
`

const StyledTag = styled(Tag)`
  border-radius: 12px;
  padding: 2px 12px;
  font-weight: 500;
`

const ActionButton = styled(Button)`
  height: 42px;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 8px;
  margin-top: 8px;

  &:hover {
    transform: translateY(-1px);
  }
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
    duration: number
    imageUrl: string
    features: Feature[]
    recommended: boolean
  }
  isSelected: boolean
  onSelect: () => void
  currentPlanName: string
}

export default function PlanCard({ plan, isSelected, onSelect, currentPlanName }: PlanCardProps) {
  const navigate = useNavigate()

  const handleMoreClick = (e: React.MouseEvent, planName: string) => {
    e.stopPropagation()
    navigate(`${ROUTES.MEMBESHIP_PLANS}/${planName}`)
  }

  return (
    <>
      <GlobalStyle />
      <StyledCard isSelected={isSelected} onClick={onSelect}>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <PlanName>{plan.planName}</PlanName>
            {plan.planName === currentPlanName && <StyledTag color='success'>Your current Plan</StyledTag>}
          </div>
          {plan.recommended && <StyledTag color='error'>Recommended</StyledTag>}
        </CardHeader>

        <PriceSection>
          <Price>
            {plan.price.toLocaleString('vi-VN')}₫<span>/{plan.duration} days</span>
          </Price>
        </PriceSection>

        <ScrollableContent className='custom-scrollbar'>
          <FeatureList>
            {plan.features.map((feature) => (
              <FeatureItem key={feature.id}>
                <CheckOutlined className='mr-3 text-green-500 flex-shrink-0 mt-1' />
                <FeatureText>{feature.featureName}</FeatureText>
                {feature.featureDescription && (
                  <Tooltip title={feature.featureDescription} placement='right'>
                    <FeatureInfo>
                      <FaInfoCircle />
                    </FeatureInfo>
                  </Tooltip>
                )}
              </FeatureItem>
            ))}
          </FeatureList>
        </ScrollableContent>

        <div className='px-6 pb-6'>
          <ActionButton onClick={(e) => handleMoreClick(e, plan.planName)} danger block>
            More
          </ActionButton>
        </div>
      </StyledCard>
    </>
  )
}
