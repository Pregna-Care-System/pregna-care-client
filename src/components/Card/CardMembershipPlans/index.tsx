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

interface CardMembershipPlansProps {
  title: string
  description: string[]
  price: number
  isSelected: boolean
  onSelect: () => void
}

export default function CardMembershipPlans(props: CardMembershipPlansProps) {
  const { title, description, price, isSelected, onSelect } = props

  const renderDescription = description.map((item, index) => {
    return (
      <p key={index}>
        <CheckCircleOutlined className='me-2 text-red-500' />
        {item}
      </p>
    )
  })

  return (
    <CardContainer
      className={`cursor-pointer transition-all ${
        isSelected ? 'border-red-600 shadow-lg scale-105' : 'hover:border-red-500 hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div>
        <h1 className='text-red-500 text-3xl'>{title}</h1>
        <p className='text-red-500'>
          $ <span className='text-4xl'>{price}</span>
        </p>
      </div>
      <Link
        to='/register'
        className={` border border-red-400 py-2 rounded my-6 w-full block text-red-400 font-bold text-center 
          ${isSelected ? 'bg-red-500 text-white' : 'bg-white'}`}
      >
        Get started
      </Link>
      <div className=''>{renderDescription}</div>
    </CardContainer>
  )
}
