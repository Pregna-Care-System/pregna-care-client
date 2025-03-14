//--Library
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
//--Components
import CardService from '@components/Card/CardService'
import CarouselTestimonials from '@components/Carousel/CarouselTestimonials'
import CollapseFAQ from '@components/Collapse/CollapseFAQ'
import CarouselMembershipPlans from '@/components/Carousel/CarouselMembershipPlans'
import useFeatureAccess from '@/hooks/useFeatureAccess'
//--Redux
import { selectMembershipPlans, selectTestimonials, selectUserInfo } from '@store/modules/global/selector'
//--Utils
import ROUTES from '@/utils/config/routes'
import { getAllFeature } from '@/services/featureService'
import { Button, message, Modal } from 'antd'
import { style } from '@/theme'

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

const StyledNotificationModal = styled(Modal)`
  .ant-modal-content {
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
  }

  .ant-modal-header {
    text-align: center;
    padding: 24px 24px 0;
    border-bottom: 10px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }

  .ant-modal-title {
    font-size: 24px !important;
    font-weight: 600;
    color: white !important;
    padding-bottom: 10px;
  }

  .ant-modal-body {
    padding: 24px;
    text-align: center;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);

    p {
      font-size: 16px;
      color: #4c1d95;
      margin: 16px 0;
      line-height: 1.6;
    }

    .notification-icon {
      width: 80%;
      height: 120px;
      margin: 0 auto 20px;
      border-radius: 8px;
    }
  }

  .ant-modal-close {
    color: white;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .ant-modal-footer {
    border-top: none;
    padding: 10px 24px 24px;
    text-align: center;
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    margin-top: 10px;

    .ant-btn {
      height: 40px;
      padding: 10px 20px;
      font-size: 15px;
      border-radius: 8px;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .ant-btn-default {
      border-color: #8b5cf6;
      color: #8b5cf6;
      background: white;

      &:hover {
        color: #7c3aed;
        border-color: #7c3aed;
        background: #f5f3ff;
        box-shadow: 0 2px 4px rgba(139, 92, 246, 0.1);
      }
    }

    .ant-btn-primary {
      background: #8b5cf6;
      border-color: #8b5cf6;
      color: white;

      &:hover {
        background: #7c3aed;
        border-color: #7c3aed;
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
      }
    }
  }

  &.ant-modal {
    .ant-modal-content {
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
    }
  }
`
const Background = styled.div`
  height: 765px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const Content = styled.div`
  transform: translate(25%, 100%);
  max-width: 50rem;
  a {
    text-align: center;
    display: block;
    width: 8rem;
  }
`
const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 100px;
  border-radius: 50%;
  background-color: pink;
  color: white;
  width: 50px;
  height: 50px;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  cursor: pointer;
  font-size: 24px;
`

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false)
  const [featureList, setFeatureList] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const { hasAccess } = useFeatureAccess()
  const userInfor = useSelector(selectUserInfo)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()

  const getListFeature = async () => {
    try {
      const res = await getAllFeature()
      if (res.status === 200) {
        setFeatureList(res.data.response)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getListFeature()
  }, [])

  const handleFeatureClick = (feature) => {
    if (userInfor?.role !== 'Member') {
      setIsModalVisible(true)
      return
    }
    if (!hasAccess(feature.id, feature.featureName)) {
      setModalContent(`You need to upgrade membership plan to use the  "${feature.featureName}".`)
      setIsModalOpen(true)
    } else {
      message.success(`${feature.featureName}!`)
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsScrollButtonVisible(true)
    } else {
      setIsScrollButtonVisible(false)
    }
  }
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const dispatch = useDispatch()
  //--Render
  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
  }, [])

  //--State redux
  const membershipPlans = useSelector(selectMembershipPlans)
  const testimonials = useSelector(selectTestimonials)

  //--State
  const [selectedPlan, setSelectedPlan] = useState(membershipPlans[0])

  //--Services
  const renderServices = featureList.map((item, index) => (
    <div key={index} onClick={() => handleFeatureClick(item)} className='cursor-pointer'>
      <CardService title={item.featureName} description={item.description} width='100%' height='100%' />
    </div>
  ))

  return (
    <div className='bg-white'>
      {/* --Background image */}
      <Background
        style={{
          backgroundImage:
            'url(https://res.cloudinary.com/drcj6f81i/image/upload/v1736741890/PregnaCare/orwee2xgtheisvm300ht.png)'
        }}
        className='w-full'
      >
        <Content className=''>
          <h1 className='font-bold text-5xl m-0'>Crafted for optimal pregnancy tracking.</h1>
          <h5 className='mt-8 ps-1'>
            Welcome to Prega Care!, your trusted companion on the beautiful journey of pregnancy.
          </h5>
          <Link
            to={ROUTES.REGISTER}
            className='bg-white border-2 border-red-400 text-red-500 rounded py-2 px-4 mt-6 ms-1 font-bold'
          >
            Get started
          </Link>
        </Content>
      </Background>

      {/* --Services */}
      <div className='container mx-auto p-16'>
        <div className='flex flex-col items-center'>
          <h2 className='text-5xl font-bold'>See our services for member</h2>
          <p className='py-4 text-xl text-wrap font-light'>
            Make your data invisible by generating unlimited identities. The next-level in privacy protection for online
            and travel.
          </p>
        </div>
        <div className='flex justify-center'>{renderServices}</div>
      </div>
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
      <StyledNotificationModal
        title='Upgrade Notification'
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false)
          navigate(ROUTES.MEMBESHIP_PLANS)
        }}
        onCancel={() => setIsModalOpen(false)}
        okText='Upgrade now'
        cancelText='Cancel'
      >
        <div>
          <img
            src='https://res.cloudinary.com/dgzn2ix8w/image/upload/v1741944505/pregnaCare/bj5e3vtzer8wk3zpkkvx.jpg'
            alt='Upgrade Notification'
            className='notification-icon'
          />
          <p>{modalContent}</p>
        </div>
      </StyledNotificationModal>
      {/* --Pricing */}
      <div className='container mx-auto p-8'>
        <div className='flex flex-col items-center mb-8'>
          <h2 className='text-5xl font-bold'>
            Our <span className='text-red-500'>Pricing</span> Package
          </h2>
        </div>
        <div className='container mx-auto'>
          <div className='grid grid-cols-12'>
            <div className='col-span-10 col-start-2'>
              <CarouselMembershipPlans
                membershipPlans={membershipPlans}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --FAQ */}
      <div className='container mx-auto p-8'>
        <h1 className='font-bold text-5xl my-8 flex items-center justify-center gap-4'>
          <div className='bg-red-500 w-16 h-1'></div>FAQs<div className='bg-red-500 w-16 h-1'></div>
        </h1>
        <div>
          <CollapseFAQ />
        </div>
      </div>

      {/* Testimonials */}
      <div className='bg-red-50 p-8 rounded-xl'>
        <h1 className='font-bold text-5xl my-8 flex items-center justify-center gap-4'>
          <div className='bg-red-500 w-16 h-1'></div>Testimonials<div className='bg-red-500 w-16 h-1'></div>
        </h1>
        <CarouselTestimonials testimonials={testimonials} />
      </div>

      {/* --Contact */}
      <div className='container mx-auto p-8 grid grid-cols-2 gap-4'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-5xl my-8 flex items-center gap-4'>
            <div className='bg-red-500 w-16 h-1'></div>Contact Us<div className='bg-red-500 w-16 h-1'></div>
          </h1>
          <p className='font-light'>We are honoured to receive your comments and suggestions.</p>
          <p className='m-0 font-light'>Please feel free to contact us.</p>
        </div>
        <div>
          <form action='' className='flex flex-col gap-4'>
            <label htmlFor='fullName' className='font-bold'>
              Name*
            </label>
            <input type='text' name='fullName' placeholder='' className='border border-gray-400 rounded-2xl p-1' />
            <label htmlFor='email' className='font-bold'>
              Email*
            </label>
            <input type='text' name='email' placeholder='' className='border border-gray-400 rounded-2xl p-1' />
            <label htmlFor='message' className='font-bold'>
              Message*
            </label>
            <textarea
              rows={'4'}
              cols={'15'}
              name='message'
              className='border border-gray-400 rounded-2xl p-1'
            ></textarea>
            <input type='submit' className='bg-red-500 px-4 py-2 rounded-2xl text-white font-bold' />
          </form>
        </div>
      </div>

      {/* --Start free trial */}
      <div className='container mx-auto p-20 flex flex-col items-center'>
        <h1 className='text-5xl font-semibold'>Be part of the future of</h1>
        <h1 className='text-5xl font-semibold'>PregnaCare</h1>
        <img
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736864690/PregnaCare/iwmdaoarqzdv9fxyxmik.png'
          alt=''
        />
        <Link to={ROUTES.REGISTER} className='bg-red-500 px-4 py-2 rounded-lg text-white font-bold mt-4'>
          Start free trial
        </Link>
      </div>
      <ScrollToTopButton isVisible={isScrollButtonVisible} onClick={scrollToTop}>
        ↑
      </ScrollToTopButton>
    </div>
  )
}
