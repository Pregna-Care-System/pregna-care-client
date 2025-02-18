//--Library
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//--Components
import CardService from '@components/Card/CardService'
import CardReason from '@components/Card/CardReason'
import CarouselTestimonials from '@components/Carousel/CarouselTestimonials'
import PlanCard from '@components/Card/CardMembershipPlans'
import CollapseFAQ from '@components/Collapse/CollapseFAQ'
import { Bot } from 'lucide-react'
//--Redux
import {
  selectMembershipPlans,
  selectReasons,
  selectServices,
  selectTestimonials
} from '@store/modules/global/selector'
//--Utils
import ROUTES from '@/utils/config/routes'
import CarouselMembershipPlans from '@/components/Carousel/CarouselMembershipPlans'

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

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }
  const dispatch = useDispatch()
  //--Render
  useEffect(() => {
    dispatch({ type: 'GET_ALL_MEMBERSHIP_PLANS' })
  }, [])

  //--State redux
  const services = useSelector(selectServices)
  const reasons = useSelector(selectReasons)
  const membershipPlans = useSelector(selectMembershipPlans)
  const testimonials = useSelector(selectTestimonials)

  //--State
  const [selectedPlan, setSelectedPlan] = useState(membershipPlans[0])

  //--Services
  const renderServices = services.map((item, index) => (
    <CardService key={index} title={item.title} description={item.description} width='100%' height='100%' />
  ))

  const renderReasons = reasons.map((item, index) => {
    return <CardReason key={index} title={item.title} description={item.description} image={item.image} />
  })

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
      {/* // Then in your JSX, wrap the services section: */}
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

      {/* --Reasons */}
      <div className='bg-red-50 rounded-2xl'>
        <div className='container mx-auto p-8'>
          <div className='flex flex-col items-center'>
            <h2 className='text-5xl font-bold'>Why choose us</h2>
            <p className='py-4 text-xl text-wrap font-light'>
              We are the only service that provides all 3 services as a packaged service.
            </p>
          </div>
          <div className='flex flex-col gap-4'>{renderReasons}</div>
        </div>
      </div>

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

      {/*CHAT*/}
      <div className='fixed bottom-8 right-8 cursor-pointer' onClick={toggleChat}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          viewBox='0 0 1024 1024'
          fill='currentColor'
          className='text-black hover:text-red-600 transition-colors'
        >
          <path d='M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z'></path>
        </svg>
      </div>

      {/* Hộp Chat */}
      {isChatOpen && (
        <div className='fixed bottom-24 right-8 w-80 bg-white shadow-lg rounded-lg p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-bold text-lg'>Chat with us</h3>
            <button onClick={toggleChat} className='text-gray-500 hover:text-gray-700'>
              ✕
            </button>
          </div>
          <div className='h-64 overflow-y-auto mb-4'>
            <div className='text-sm flex items-start gap-2'>
              <Bot className='text-gray-500 mt-3' size={20} />
              <p className='bg-gray-100 p-2 rounded-lg'>Hello! How can we help you?</p>
            </div>
          </div>
          <input
            type='text'
            placeholder='Type your message...'
            className='w-full p-2 border border-gray-300 rounded-lg'
          />
        </div>
      )}
    </div>
  )
}
