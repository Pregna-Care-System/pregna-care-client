import ROUTES from '@/utils/config/routes'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <div className=' bg-red-100 place-content-center border-t-2 border-red-300'>
      <div className='container mx-auto py-6'>
        <div className='grid grid-cols-12 pt-2 pb-6'>
          <div className='col-span-2 flex'>
            <img
              src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
              alt='logo'
              style={{ width: '80px', height: '70px' }}
            />
            <div className='ms-4'>
              <h5 className='text-red-500 font-bold text-xl'>PregnaCare</h5>
              <p className='m-0 text-sm font-light'>Pregnancy tracker and woman health website</p>
            </div>
          </div>

          <div className='col-start-6 col-span-2 flex flex-col gap-2 font-bold'>
            <Link to={ROUTES.HOME} className='hover:text-red-500'>
              About us
            </Link>
            <Link to={ROUTES.CONTACT} className='hover:text-red-500'>
              Contact us
            </Link>
            <Link to={ROUTES.SERVICES} className='hover:text-red-500'>
              Features
            </Link>
            <Link to={ROUTES.COMMUNITY} className='hover:text-red-500'>
              FAQs
            </Link>
            <Link to={ROUTES.HOME} className='hover:text-red-500'>
              Testimonials
            </Link>
          </div>
          <div className='col-start-12 col-span-1'>
            <Link to={ROUTES.HOME} className='bg-red-300 text-white rounded-lg py-2 px-2 flex items-center gap-1'>
              <span className='text-xs font-semibold w-full inline-block'>Get the app</span>
              <img
                src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736862738/PregnaCare/dzlhyj9iyxr8xvuxkztl.png'
                alt='QR'
              />
            </Link>
            <Link to={ROUTES.HOME} className='bg-black flex rounded-lg py-2 px-1 mt-2 items-center gap-1'>
              <img
                src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736862861/PregnaCare/osy55ewyfe7p6q8xhauo.png'
                alt='App store'
              />
              <div className='ms-2'>
                <p className='font-light text-[10px] text-white m-0'>Download on the</p>
                <p className='text-white text-xs m-0'>App Store</p>
              </div>
            </Link>
            <Link to={ROUTES.HOME} className='bg-black flex rounded-lg py-2 px-1 mt-2 items-center gap-1'>
              <img
                src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736862909/PregnaCare/fkxnuevdhjtzpj0zxyki.png'
                alt='App store'
              />
              <div className='ms-2'>
                <p className='font-light text-[10px] text-white m-0'>Get it on</p>
                <p className='text-white text-xs m-0'>Google Play</p>
              </div>
            </Link>
          </div>
        </div>
        <div className='col-span-12 text-center border-t-2 border-red-200 py-2'>
          <p className='text-sm text-gray-500'>&copy; 2025 PregnaCare. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
