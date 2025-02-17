import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Result, Spin } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'

export default function PaymentStatus() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const searchParams = new URLSearchParams(location.search)
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failure'>('processing')
  const planName = searchParams.get('planName')
  const planPrice = searchParams.get('planPrice')

  const user = jwtDecode(localStorage.getItem('accessToken') || '')

  useEffect(() => {
    const simulatePayment = async () => {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate success or failure (80% success rate)
      const isSuccess = searchParams.get('vnp_ResponseCode') === '00' ? true : false
      setPaymentStatus(isSuccess ? 'success' : 'failure')
      if (isSuccess) {
        dispatch({
          type: 'USER_MEMBERSHIP_PLAN',
          payload: {
            userId: user.id,
            membershipPlanId: localStorage.getItem('membershipPlanId'),
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
          }
        })
      }
      localStorage.removeItem('membershipPlanId')
    }

    simulatePayment()
  }, [location])

  const handleReturn = () => {
    navigate('/', { state: { status: paymentStatus } })
  }

  if (paymentStatus === 'processing') {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <Spin size='large' />
        <p className='mt-4 text-lg'>Processing your payment...</p>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      {paymentStatus === 'success' ? (
        <Result
          status='success'
          icon={<CheckCircleOutlined />}
          title='Payment Successful!'
          subTitle={`You have successfully upgraded to the ${planName} plan for ${parseInt(planPrice).toLocaleString('vi-VN')} ₫/month.`}
          extra={[
            <Button type='primary' key='console' onClick={handleReturn}>
              Return to Dashboard
            </Button>
          ]}
        />
      ) : (
        <Result
          status='error'
          icon={<CloseCircleOutlined />}
          title='Payment Failed'
          subTitle='There was an issue processing your payment. Please try again.'
          extra={[
            <Button type='primary' key='console' onClick={handleReturn}>
              Try Again
            </Button>
          ]}
        />
      )}
    </div>
  )
}
