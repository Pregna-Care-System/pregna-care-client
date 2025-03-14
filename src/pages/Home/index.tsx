//--Library
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//--Components
import CardService from '@components/Card/CardService'
import CarouselTestimonials from '@components/Carousel/CarouselTestimonials'
import CollapseFAQ from '@components/Collapse/CollapseFAQ'
import CarouselMembershipPlans from '@/components/Carousel/CarouselMembershipPlans'
import useFeatureAccess from '@/hooks/useFeatureAccess'
//--Redux
import {
  selectMembershipPlans,
  selectTestimonials,
} from '@store/modules/global/selector'
//--Utils
import ROUTES from '@/utils/config/routes'
import { getAllFeature } from '@/services/featureService'
import { message, Modal } from 'antd'

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

    if (!hasAccess(feature.id, feature.featureName)) {
      setModalContent(`Bạn cần nâng cấp để sử dụng tính năng "${feature.featureName}".`)
      setIsModalOpen(true)
    } else {
      message.success(`Bạn đã truy cập vào ${feature.featureName}!`)
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
      <Modal
        title='Thông báo'
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText='Nâng cấp ngay'
        cancelText='Đóng'
      >
        <p>{modalContent}</p>
      </Modal>
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
