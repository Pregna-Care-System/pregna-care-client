import ROUTES from '@/utils/config/routes'
import { LucideBaby } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FaCalendarAlt, FaPenNib, FaSignOutAlt } from 'react-icons/fa'
import { GoPerson } from 'react-icons/go'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useFeatureAccess from '@/hooks/useFeatureAccess'
import { Modal } from 'antd'

const SidebarWrapper = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 107, 129, 0.1);
  box-shadow: 0 0 20px rgba(255, 107, 129, 0.05);

  .logo-section {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 107, 129, 0.1);
    background: white;

    .brand-name {
      background: linear-gradient(135deg, #ff6b81 0%, #ff8296 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .sub-text {
      color: #666;
      font-size: 0.75rem;
    }

    img {
      filter: none;
      transition: transform 0.2s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .nav-item {
    position: relative;
    transition: all 0.3s ease;
    color: #666;
    margin: 0.25rem 0;

    &:hover {
      background: #fff1f3;
      color: #ff6b81;

      .nav-icon {
        color: #ff6b81;
      }
    }

    &.active {
      background: #fff1f3;
      color: #ff6b81;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #ff6b81;
        border-radius: 0 4px 4px 0;
      }

      .nav-icon {
        color: #ff6b81;
      }

      .nav-text {
        color: #ff6b81;
        font-weight: 600;
      }
    }

    .nav-icon {
      color: #666;
      transition: color 0.3s ease;
    }

    .nav-text {
      color: #444;
      transition: color 0.3s ease;
      font-size: 0.9375rem;
    }
  }

  .footer {
    padding: 1rem;
    color: #666;
    font-size: 0.75rem;
    border-top: 1px solid rgba(255, 107, 129, 0.1);
    background: white;
  }

  nav {
    background: rgba(255, 255, 255, 0.95);
  }
`

const MenuToggle = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 107, 129, 0.2);
  color: #ff6b81;
  transition: all 0.3s ease;
  display: none;
  box-shadow: 0 2px 8px rgba(255, 107, 129, 0.1);

  &:hover {
    background: #fff1f3;
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
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

interface MemberSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function MemberSidebar({ isOpen, onToggle }: MemberSidebarProps) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const location = useLocation()
  const { hasAccess } = useFeatureAccess()

  const menuItems = useMemo(
    () => [
      {
        title: 'Mother Information',
        icon: <GoPerson size={20} />,
        path: ROUTES.MEMBER.DASHBOARD,
        featureName: 'Tracking Pregnancy'
      },
      {
        title: 'Fetal Growth',
        icon: <LucideBaby size={20} />,
        path: ROUTES.MEMBER.FETALGROWTHCHART,
        featureName: 'Tracking Pregnancy'
      }
    ],
    []
  )

  const getCurrentMenuFromPath = useMemo(
    () => (path: string) => {
      const menuItem = menuItems.find((item) => item.path === path)
      return menuItem ? menuItem.title : 'Mother Information'
    },
    [menuItems]
  )

  const [activeMenu, setActiveMenu] = useState(getCurrentMenuFromPath(location.pathname))

  useEffect(() => {
    setActiveMenu(getCurrentMenuFromPath(location.pathname))
  }, [location.pathname, getCurrentMenuFromPath])

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleMenuItemClick = (title: string, path: string, featureName: string) => {
    if (hasAccess(undefined, featureName)) {
      setActiveMenu(title)
      navigate(path)
      if (window.innerWidth < 1024) {
        onToggle()
      }
    } else {
      setModalContent(`You need to upgrade membership plan to use the  "${featureName}".`)
      setIsModalOpen(true)
    }
  }

  return (
    <SidebarWrapper>
      <MenuToggle onClick={onToggle} aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          {isOpen ? (
            <>
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </>
          ) : (
            <>
              <line x1='3' y1='12' x2='21' y2='12' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <line x1='3' y1='18' x2='21' y2='18' />
            </>
          )}
        </svg>
      </MenuToggle>

      <div className='flex flex-col h-full'>
        <div className='logo-section'>
          <div className='flex items-center justify-center space-x-3 cursor-pointer' onClick={handleLogoClick}>
            <img
              src='https://res.cloudinary.com/drcj6f81i/image/upload/v1736744602/PregnaCare/mgxvbwz2fggrx7brtjgo.svg'
              alt='logo'
              className='w-8 h-8'
            />
            <div className='flex flex-col'>
              <span className='brand-name text-2xl'>PregnaCare</span>
              <span className='sub-text'>Modern Member Dashboard</span>
            </div>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto py-4'>
          <ul className='space-y-1 px-3'>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(item.title, item.path, item.featureName)}
                  className={`nav-item w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                    activeMenu === item.title ? 'active' : ''
                  }`}
                  aria-label={item.title}
                >
                  <span className='nav-icon'>{item.icon}</span>
                  <span className='nav-text ml-3'>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to={ROUTES.HOME}
          className='nav-item w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out'
        >
          <button className='nav-item w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out'>
            <span className='nav-icon'>
              <FaSignOutAlt size={20} />
            </span>
            <span className='nav-text ml-3'>Back landing page</span>
          </button>
        </Link>

        <div className='footer text-center'>
          <p>PregnaCare © 2025</p>
        </div>
      </div>
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
    </SidebarWrapper>
  )
}
