import { style } from '@/theme'
import { CheckCircleOutlined } from '@ant-design/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CardContainer = styled.div`
  background-color: ${style.COLORS.RED.RED_4};
  border: 1px solid ${style.COLORS.RED.RED_1};
  border-radius: 0.75rem;
  padding: 2rem;
`

export default function CardMembershipPlans() {
  return (
    <CardContainer>
      <div>
        <h1 className='text-red-500 text-3xl'>Free Trial (3 days)</h1>
        <p className='text-red-500'>
          $ <span className='text-4xl'>9.99</span>
        </p>
      </div>
      <Link
        to='/register'
        className='bg-white border border-red-400 py-2 rounded my-6 w-full block text-red-400 font-bold text-center'
      >
        Get started
      </Link>
      <div className=''>
        <p>
          <CheckCircleOutlined className='me-2 text-red-500' />
          Access to all basic features
        </p>
        <p>
          <CheckCircleOutlined className='me-2 text-red-500' />
          No credit card required
        </p>
        <p>
          <CheckCircleOutlined className='me-2 text-red-500' />
          Experience the platform risk-free
        </p>
      </div>
    </CardContainer>
  )
}
