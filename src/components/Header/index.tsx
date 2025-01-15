import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  .active {
    color: ${style.COLORS.RED.RED_1};
  }
  .header_item:hover {
    color: ${style.COLORS.RED.RED_1};
  }
`

export default function Header() {
  return (
    <Wrapper className='grid grid-cols-12 w-full p-4 bg-opacity-5 fixed'>
      <div className='col-span-2 flex gap-2 items-center'>
        <img
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
          alt='logo'
        />
        <span className='text-red-400 text-xl font-bold'>PregnaCare</span>
      </div>
      <div className='col-span-8 flex justify-center items-center gap-8 font-bold'>
        <NavLink to={ROUTES.GUEST_HOME} className='header_item'>
          Home
        </NavLink>
        <NavLink to={ROUTES.SERVICES} className='header_item'>
          Services
        </NavLink>
        <NavLink to={ROUTES.BLOG} className='header_item'>
          Blog
        </NavLink>
        <NavLink to={ROUTES.PRICING} className='header_item'>
          Pricing
        </NavLink>
        <NavLink to={ROUTES.NUTRITION_AND_FITNESS} className='header_item'>
          Nutrition and Fitness
        </NavLink>
        <NavLink to={ROUTES.COMMUNITY} className='header_item'>
          Community
        </NavLink>
        <NavLink to={ROUTES.CONTACT} className='header_item'>
          Contact Us
        </NavLink>
      </div>
      <div className='col-span-2 ms-10 flex justify-center gap-4 font-bold text-xs'>
        <Link to={ROUTES.LOGIN} className='border-red-400 border-2 bg-white text-red-400 rounded py-2 px-4'>
          Sign Up
        </Link>
        <Link to={ROUTES.LOGIN} className='bg-red-400 text-white rounded py-2 px-4'>
          Sign In
        </Link>
      </div>
    </Wrapper>
  )
}
