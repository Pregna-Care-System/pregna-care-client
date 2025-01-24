import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'

const generateMockToken = () => {
  const payload = {
    sub: 'test',
    name: 'Tina',
    email: 'tina.pham@example.com',
    image:
      'https://scontent.fvkg1-1.fna.fbcdn.net/v/t39.30808-6/473590033_1279370156615184_2203213174144053067_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=GSZTiwR5TToQ7kNvgFWSX2S&_nc_oc=AdjwJIRPcydRPUd9E_3Br943ZE-OZh4zehpOGYDQcj4QpK3i1V5piiZgV6lIbIPU8jY&_nc_zt=23&_nc_ht=scontent.fvkg1-1.fna&_nc_gid=AUBVArrrCkyV0Ob9buoRFfb&oh=00_AYC4ml1XI_lP0B5rlWtsz4GrmKxNLI-YUwYiR41jO0wvyA&oe=6798F34F',
    exp: Math.floor(Date.now() / 1000) + 60 * 60
  }
  return (
    btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })) + '.' + btoa(JSON.stringify(payload)) + '.' + btoa('signature')
  )
}

// Store mock token in localStorage for testing
if (!localStorage.getItem('accessToken')) {
  const mockToken = generateMockToken()
  localStorage.setItem('accessToken', mockToken)
}
const Wrapper = styled.div`
  .active {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item:hover {
    color: ${style.COLORS.RED.RED_5};
  }
  .header_item_profile {
    transition:
      transform 0.4s ease,
      opacity 0,
      4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      opacity: 0.9;
    }
    img {
      transition: transform 0.4s ease;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .dropdown {
    position: absolute;
    top: 65px;
    right: 0;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 0.5rem;
    padding: 0.5rem 0;
    min-width: 150px;

    .dropdown_item {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: #4a4a4a;
      cursor: pointer;
      &:hover {
        background-color: ${style.COLORS.RED.RED_5};
        color: #fff;
      }
    }

    a {
      display: block;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      color: #4a4a4a;
      text-decoration: none;
      transition:
        background-color 0.3s,
        color 0.3s;

      &:hover {
        background-color: ${style.COLORS.RED.RED_5};
        color: #fff;
      }
    }
  }
`

export default function Header() {
  // localStorage.removeItem('accessToken')
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null

  const [isDropDownOpen, setIsDropDownOpen] = useState(false)

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
  }

  const userImage = user?.image || null

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
            <div>
              <BellOutlined className='cursor-pointer text-xl' />
            </div>
            Welcome,{user.name}
            <div onClick={toggleDropDown} className='header_item_profile'>
              {userImage ? (
                <img src={userImage} alt='User Avatar' />
              ) : (
                <UserOutlined className='text-xl cursor-pointer' />
              )}
            </div>
            {isDropDownOpen && (
              <div className='dropdown'>
                <Link to={ROUTES.PROFILE}>
                  <UserOutlined /> My Profile
                </Link>
                <Link to={ROUTES.PROFILE}>
                  <SettingOutlined /> Setting
                </Link>
                <div className='dropdown_item cursor-pointer border-t border-t-gray-300' onClick={handleLogout}>
                  <LogoutOutlined /> Logout
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  )
}
