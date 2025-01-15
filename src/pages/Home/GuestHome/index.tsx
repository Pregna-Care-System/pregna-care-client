//--Library
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//--Components
import CardService from '@/components/Card/CardService'
//--Redux
import { selectMembershipPlans } from '@/store/modules/global/selector'
//--Utils
import ROUTES from '@/utils/config/routes'
import CardReason from '@/components/Card/CardReason'
import CarouselTestimonials from '@/components/Carousel/CarouselTestimonials'
import CollapseFAQ from '@/components/Collapse/CollapseFAQ'
import CardMembershipPlans from '@/components/Card/CardMembershipPlans'

const Background = styled.div`
  height: 930px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const Content = styled.div`
  transform: translate(35%, 100%);
  max-width: 50rem;
  a {
    text-align: center;
    display: block;
    width: 8rem;
  }
`

export default function GuestHome() {
  const membershipPlans = useSelector(selectMembershipPlans)

  const renderMembershipPlans = membershipPlans.map((item, index) => {
    return <CardService key={index} title={item.title} description={item.description} width='100%' height='100%' />
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
            className='bg-white border-2 border-red-400 text-red-400 rounded py-2 px-4 mt-6 ms-1'
          >
            Get started
          </Link>
        </Content>
      </Background>

      {/* --Services */}
      <div className='container mx-auto p-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-5xl font-bold'>See our services for member</h2>
          <p className='py-4 text-xl text-wrap font-light'>
            Make your data invisible by generating unlimited identities. The next-level in privacy protection for online
            and travel.
          </p>
        </div>
        <div className='flex justify-center'>{renderMembershipPlans}</div>
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
          <div className='flex flex-col gap-4'>
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
          </div>
        </div>
      </div>

      {/* --Pricing */}
      <div className='container mx-auto p-8'>
        <div className='flex flex-col items-center mb-8'>
          <h2 className='text-5xl font-bold'>
            Our <span className='text-red-400'>Pricing</span> Package
          </h2>
        </div>
        <div className='container mx-auto'>
          <div className='grid grid-cols-3 gap-4 mx-20'>
            <CardMembershipPlans />
            <CardMembershipPlans />
            <CardMembershipPlans />
          </div>
        </div>
      </div>

      {/* --FAQ */}
      <div className='container mx-auto p-8'>
        <h1 className='font-bold text-5xl my-8 flex items-center justify-center gap-4'>
          <div className='bg-red-300 w-16 h-1'></div>FAQs<div className='bg-red-300 w-16 h-1'></div>
        </h1>
        <div>
          <CollapseFAQ />
        </div>
      </div>

      {/* Testimonials */}
      <div className='bg-red-50 p-8 rounded-xl'>
        <h1 className='font-bold text-5xl my-8 flex items-center justify-center gap-4'>
          <div className='bg-red-300 w-16 h-1'></div>Testimonials<div className='bg-red-300 w-16 h-1'></div>
        </h1>
        <CarouselTestimonials />
      </div>

      {/* --Contact */}
      <div className='container mx-auto p-8 grid grid-cols-2 gap-4'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-5xl my-8 flex items-center gap-4'>
            <div className='bg-red-300 w-16 h-1'></div>Contact Us<div className='bg-red-300 w-16 h-1'></div>
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
            <input
              type='submit'
              className='bg-gradient-to-r from-red-400 to-red-200 px-4 py-2 rounded-2xl text-white font-bold'
            />
          </form>
        </div>
      </div>

      {/* --Start free trial */}
      <div className='container mx-auto p-8 flex flex-col items-center'>
        <h1 className='text-5xl font-semibold'>Be part of the future of</h1>
        <h1 className='text-5xl font-semibold'>PregnaCare</h1>
        <img
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736864690/PregnaCare/iwmdaoarqzdv9fxyxmik.png'
          alt=''
        />
        <Link
          to={ROUTES.REGISTER}
          className='bg-gradient-to-r from-red-400 to-red-200 px-4 py-2 rounded-lg text-white font-bold mt-4'
        >
          Start free trial
        </Link>
      </div>
    </div>
  )
}
