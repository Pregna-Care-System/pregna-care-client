import { logout } from '@/services/userService'
import { style } from '@/theme'
import ROUTES from '@/utils/config/routes'
import { UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Avatar, Button, Modal, Tooltip } from 'antd'
import NotificationButton from '@/pages/Notification/NotificationButton'
import { FaCheck, FaHistory, FaSignOutAlt, FaTachometerAlt, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectMemberInfo, selectUserInfo, selectIsAuthenticated } from '@store/modules/global/selector'
import { resetState } from '@store/modules/global/slice'
import UserAvatar from '../common/UserAvatar'

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
      width: 40px;
      height: 40px;
    }
  }
  .avatar-wrapper {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
  .dropdown {
    position: absolute;
    top: 65px;
    right: 24px;
    background-color: white;
    border-radius: 0.75rem;
    padding: 0.5rem;
    min-width: 200px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(255, 107, 129, 0.1);
    z-index: 45;

    a,
    .dropdown_item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #4a4a4a;
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      width: 100%;
      cursor: pointer;

      svg {
        margin-right: 0.75rem;
        font-size: 1rem;
        color: #ff6b81;
      }

      &:hover {
        background-color: #fff1f3;
        color: #ff6b81;
      }
    }

    .dropdown_item.logout {
      border-top: 1px solid #f0f0f0;
      margin-top: 0.5rem;
      color: #ff6b81;
      cursor: pointer;

      &:hover {
        background-color: #fff1f3;
      }
    }
  }
`
const AnimatedUpgradeButton = styled(Button)`
  position: relative;
  overflow: hidden;
  z-index: 1;
  min-width: 80px;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 6px;
    z-index: -1;
    background: linear-gradient(90deg, #ff6b81, #a855f7, #000000, #954dd9, #ff6b81);
    background-size: 400% 400%;
    animation: borderAnimation 3s ease infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: white;
    border-radius: 6px;
    z-index: -1;
  }

  @keyframes borderAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &.ant-btn {
    border: none !important;
    color: #ff6b81;
    font-weight: 600;
    padding: 4px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 2;

    .days-text {
      font-size: 12px;
      opacity: 0.9;
    }

    .upgrade-text {
      font-size: 14px;
      font-weight: bold;
    }

    &:hover {
      color: #a855f7;
      transform: scale(1.02);
      transition: transform 0.2s ease;
    }
  }
`

export default function Header() {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  //Hooks
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //Seclectors state
  const userInfor = useSelector(selectUserInfo)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const memberInfo = useSelector(selectMemberInfo)

  useEffect(() => {
    fetchMembers()
  }, [dispatch])

  const fetchMembers = () => {
    if (userInfor) {
      dispatch({
        type: 'GET_MEMBER_WITH_PLAN_DETAIL',
        payload: { userId: userInfor.id }
      })
    }
  }

  const handleMouseLeave = () => {
    const newTimer = setTimeout(() => setIsDropDownOpen(false), 1000)
    setTimer(newTimer)
  }

  const handleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
  }

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
    dispatch(resetState())
  }
  const handleNavClick = (path: string) => {
    if (memberInfo?.role !== 'Member') {
      setIsModalVisible(true)
    } else {
      navigate(path)
    }
  }

  return (
    <Wrapper className='grid grid-cols-12 w-full p-4 bg-white fixed z-10'>
      <div className='col-span-2 flex gap-2 items-center cursor-pointer' onClick={() => navigate(ROUTES.GUEST_HOME)}>
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
        <NavLink to={ROUTES.COMMUNITY} className='header_item'>
          Community
        </NavLink>
        <NavLink to={ROUTES.CONTACT} className='header_item'>
          Contact Us
        </NavLink>
        <NavLink to={ROUTES.FAQ} className='header_item'>
          FAQ
        </NavLink>
      </div>
      <div className='col-span-2 ms-10 flex justify-center gap-4 text-xs items-center'>
        {!userInfor || !isAuthenticated ? (
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
            <Tooltip
              title={
                memberInfo && memberInfo.remainingDate
                  ? `Your Plan: ${memberInfo.planName || 'N/A'} - Remaining: ${memberInfo.remainingDate || 0} days`
                  : 'Upgrade to access premium features'
              }
            >
              <div>
                {memberInfo?.remainingDate ? (
                  <AnimatedUpgradeButton>
                    <div className='text-red-500 font-bold'>{memberInfo.remainingDate} days left</div>
                  </AnimatedUpgradeButton>
                ) : (
                  <AnimatedUpgradeButton onClick={() => navigate(ROUTES.MEMBESHIP_PLANS)}>
                    Upgrade
                  </AnimatedUpgradeButton>
                )}
              </div>
            </Tooltip>

            <NotificationButton />
            <div className='avatar-wrapper' onClick={toggleDropDown} onMouseEnter={handleMouseEnter}>
              <UserAvatar src={memberInfo.imageUrl} name={memberInfo.fullName} size={40} />
            </div>
            {isDropDownOpen && (
              <div className='dropdown' onMouseLeave={handleMouseLeave}>
                <button className='dropdown_item' onClick={() => navigate(ROUTES.PROFILE)}>
                  <FaUser /> My Profile
                </button>
                <button className='dropdown_item' onClick={() => handleNavClick(ROUTES.MEMBER.DASHBOARD)}>
                  <FaTachometerAlt /> Member Dashboard
                </button>
                <button className='dropdown_item' onClick={() => handleNavClick(ROUTES.MEMBER.HISTORY_TRANSACTION)}>
                  <FaHistory /> History Transaction
                </button>
                <div className='dropdown_item logout' onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </>
        )}
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
    </Wrapper>
  )
}
