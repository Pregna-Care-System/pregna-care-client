import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Card, Radio, Space } from 'antd'
import { StyledRadioGroup } from './Checkout.styled'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/modules/global/selector'

const paymentMethods = [
  {
    key: 'vnpay',
    logo: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1737276276/PregnaCare/hfvj27biqqhpdvyiqfhw.png',
    disable: false
  },
  {
    key: 'momo',
    logo: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1737283999/PregnaCare/ewdjmy2oji5rienylmnz.svg',
    disable: true
  },
  {
    key: 'paypal',
    logo: 'https://res.cloudinary.com/drcj6f81i/image/upload/v1737283999/PregnaCare/e2uoz1c00yccl5xnjklj.svg',
    disable: true
  }
]

export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState('vnpay')
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const planId = searchParams.get('planId')
  const planName = searchParams.get('planName')
  const planPrice = searchParams.get('planPrice')
  const dispatch = useDispatch()

  const user = useSelector(selectUserInfo)

  const handleSubmit = async () => {
    try {
      if (user) {
        dispatch({
          type: 'PAYMENT_VNPAY',
          payload: { userId: user.id, membershipPlanId: planId, userEmail: user.email }
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleMethodChange = (e: any) => {
    setSelectedMethod(e.target.value)
  }

  return (
    <div className='flex justify-center' style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}>
      <div className='container mx-auto px-4 py-32 max-w-2xl'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Checkout</h1>
        <Card className='mb-6'>
          <p className='text-lg mb-2'>
            Selected Plan: <strong className='text-red-500'>{planName}</strong>
          </p>
          <p className='text-lg'>
            Price:
            <strong className='text-red-500'>{parseInt(planPrice || '0').toLocaleString('vi-VN')} ₫/month</strong>
          </p>
        </Card>
        <div className='mb-8'>
          <StyledRadioGroup onChange={handleMethodChange} value={selectedMethod} className='w-full'>
            <Space direction='horizontal' size='middle' className='w-full'>
              {paymentMethods.map((method) => (
                <Radio key={method.key} value={method.key} className='w-full' disabled={method.disable}>
                  <Card hoverable className={`w-full ${selectedMethod === method.key ? 'border-red-400' : ''}`}>
                    <div className='flex items-center'>
                      <img src={method.logo} alt={method.key} style={{ width: 50 }} />
                    </div>
                  </Card>
                </Radio>
              ))}
            </Space>
          </StyledRadioGroup>
        </div>
        <div className='flex justify-between'>
          <Button type='primary' danger onClick={handleSubmit}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
