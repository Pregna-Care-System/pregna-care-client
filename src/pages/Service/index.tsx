import { getAllFeature } from '@/services/featureService'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Modal, Skeleton } from 'antd'
import { FaBaby } from 'react-icons/fa'
import styled from 'styled-components'
import ROUTES from '@/utils/config/routes'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/modules/global/selector'
import { style } from '@/theme'

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #ffffff, #f3e8ff);
  transition: colors 0.3s ease;
`

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`

const HeaderSection = styled(motion.header)`
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 3rem;
  background: linear-gradient(to right, #ff6b81, #ff8e9e);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`

const HeaderOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.1);
`

const HeaderContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 1rem;
`

const HeaderTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.75rem);
  font-weight: bold;
  margin-bottom: 1rem;
`

const HeaderSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.25rem);
  opacity: 0.9;
`
const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    text-align: center;
    padding: 24px 24px 0;
    border-bottom: none;
  }

  .ant-modal-title {
    font-size: 24px !important;
    font-weight: 600;
    color: ${style.COLORS.RED.RED_5};
  }

  .ant-modal-body {
    padding: 24px;
  }

  .membership-content {
    text-align: center;
  }

  .membership-image {
    width: 180px;
    height: 180px;
    margin: 0 auto 24px;
  }

  .membership-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
  }

  .benefits-list {
    text-align: left;
    margin: 20px 0;
    padding: 0;
    list-style: none;

    li {
      margin: 12px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #444;
      font-size: 15px;

      svg {
        color: ${style.COLORS.RED.RED_5};
        font-size: 16px;
      }
    }
  }

  .ant-modal-footer {
    border-top: none;
    padding: 0 24px 24px;
    text-align: center;

    .ant-btn {
      height: 40px;
      padding: 0 24px;
      font-size: 15px;
      border-radius: 8px;
    }

    .ant-btn-default {
      border-color: ${style.COLORS.RED.RED_5};
      color: ${style.COLORS.RED.RED_5};

      &:hover {
        color: ${style.COLORS.RED.RED_4};
        border-color: ${style.COLORS.RED.RED_4};
      }
    }

    .ant-btn-primary {
      background: ${style.COLORS.RED.RED_5};
      border-color: ${style.COLORS.RED.RED_5};

      &:hover {
        background: ${style.COLORS.RED.RED_4};
        border-color: ${style.COLORS.RED.RED_4};
      }
    }
  }
`
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const ServiceCard = styled(motion.button)`
  width: 100%;
  text-align: left;
`

const CardContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ff6b81;
`

const ServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #1f2937;
`

const ServiceDescription = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

interface Feature {
  id: string
  featureName: string
  description: string
}

const featureRoutes: { [key: string]: string } = {
  'Generate baby name': ROUTES.BABY_NAME,
  'Shoppe for mommy': ROUTES.BABY_SHOP,
  Blog: ROUTES.BLOG,
  Community: ROUTES.COMMUNITY,
  'Tracking Pregnancy': ROUTES.MEMBER.DASHBOARD,
  'Remider schedule': ROUTES.MEMBER.SCHEDULE
}
const MommyServicesPage = () => {
  const [featureList, setFeatureList] = useState<Feature[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const userInfor = useSelector(selectUserInfo)
  const navigate = useNavigate()

  const getListFeature = async () => {
    try {
      setIsLoading(true)
      const res = await getAllFeature()
      if (res.status === 200) {
        setFeatureList(res.data.response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getListFeature()
  }, [])

  const getIcon = (index: number) => {
    const icons = [FaBaby]
    const Icon = icons[index % icons.length]
    return <Icon />
  }

  const handleFeatureClick = (feature: Feature) => {
    if (userInfor?.role !== 'Member') {
      setIsModalVisible(true)
    } else {
      const route =
      featureRoutes[feature.featureName] || `/service/${feature.featureName.toLowerCase().replace(/\s+/g, '-')}`
    navigate(route)
    }
  }
  return (
    <PageContainer>
      <ContentContainer>
        <HeaderSection initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <HeaderOverlay />
          <HeaderContent>
            <HeaderTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Mommy Services
            </HeaderTitle>
            <HeaderSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Comprehensive care for every stage of your motherhood journey
            </HeaderSubtitle>
          </HeaderContent>
        </HeaderSection>

        <ServicesGrid>
          {isLoading
            ? [...Array(3)].map((_, index) => (
                <CardContent key={index}>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </CardContent>
              ))
            : featureList.map((feature, index) => (
                <ServiceCard
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CardContent>
                    <ServiceIcon>{getIcon(index)}</ServiceIcon>
                    <ServiceTitle>{feature.featureName}</ServiceTitle>
                    <ServiceDescription>{feature.description}</ServiceDescription>
                  </CardContent>
                </ServiceCard>
              ))}
        </ServicesGrid>
      </ContentContainer>
      <StyledModal
        title='Become a PregnaCare Member'
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setIsModalVisible(false)}>
            Later
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setIsModalVisible(false)
              navigate(ROUTES.MEMBESHIP_PLANS)
            }}
          >
            View Membership Plans
          </Button>
        ]}
      >
        <div className='membership-content'>
          <img
            src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
            alt='Membership'
            className='membership-image'
          />

          <div className='membership-subtitle'>Join our community to experience exclusive features</div>
        </div>
      </StyledModal>
    </PageContainer>
  )
}

export default MommyServicesPage
