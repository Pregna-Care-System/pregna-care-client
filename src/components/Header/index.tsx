import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { UserOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  .active {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item:hover {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item_profile {
    border: 2px solid ${style.COLORS.BLACK};
    border-radius: 50%;
    transition: all 0.4s;
    &:hover {
      color: ${style.COLORS.RED.RED_5};
      border: 2px solid ${style.COLORS.RED.RED_5};
    }
  }
`

export default function Header() {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null

  return (
    <Wrapper className='grid grid-cols-12 w-full p-4 bg-white fixed z-10'>
      <div className='col-span-2 flex gap-2 items-center'>
        <img
          src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
          alt='logo'
          style={{ width: '60px' }}
        />
        <span className='text-red-500 text-xl font-bold'>PregnaCare</span>
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
        <NavLink to={ROUTES.MEMBESHIP_PLANS} className='header_item'>
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
      <div className='col-span-2 ms-10 flex justify-center gap-4 font-bold text-xs items-center'>
        {user === null ? (
          <>
            <Link to={ROUTES.REGISTER} className='border-red-400 border-2 bg-white text-red-500 rounded py-2 px-4'>
              Sign Up
            </Link>
            <Link to={ROUTES.LOGIN} className='bg-red-500 text-white rounded py-2 px-4 border-red-500 border-2'>
              Sign In
            </Link>
          </>
        ) : (
          <>
            <Link to={ROUTES.PROFILE} className='header_item_profile p-2'>
              <UserOutlined className='text-xl' />
            </Link>
          </>
        )}
      </div>
    </Wrapper>
  )
}
