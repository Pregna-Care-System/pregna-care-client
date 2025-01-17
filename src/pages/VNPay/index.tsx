import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Result, Spin } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

export default function VNPayPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failure'>('processing')

  useEffect(() => {
    const simulatePayment = async () => {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate success or failure (80% success rate)
      const isSuccess = Math.random() < 0.8
      setPaymentStatus(isSuccess ? 'success' : 'failure')
    }

    simulatePayment()
  }, [])

  const handleReturn = () => {
    navigate('/', { state: { status: paymentStatus } })
  }

  const searchParams = new URLSearchParams(location.search)
  const planName = searchParams.get('planName') || 'Selected Plan'
  const planPrice = searchParams.get('planPrice') || '0'

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
