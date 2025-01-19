import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, Steps, Button, Form, Input, Radio, Space, message } from 'antd'
import { WalletOutlined, CreditCardOutlined, BankOutlined } from '@ant-design/icons'
import { QRCodeSVG } from 'qrcode.react'
import { StyledRadioGroup, StyledSteps } from './Checkout.styled'

const { Step } = Steps

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
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [selectedMethod, setSelectedMethod] = useState('vnpay')
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const planName = searchParams.get('planName') || 'Selected Plan'
  const planPrice = searchParams.get('planPrice') || '0'

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields()
      }
      if (currentStep === 1 && selectedMethod === 'vnpay') {
        // Generate QR code for VNPAY
        const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${planPrice}&planName=${encodeURIComponent(planName)}`
        setQrCodeData(paymentUrl)
      } else if (currentStep === 1) {
        // Handle other payment methods (not implemented in this demo)
        message.info(`${selectedMethod} payment is not implemented in this demo.`)
        return
      }
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleMethodChange = (e: any) => {
    setSelectedMethod(e.target.value)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} layout='vertical'>
            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='phone'
              label='Phone Number'
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        )
      case 1:
        return (
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
        )
      case 2:
        return (
          <div className='flex flex-col items-center'>
            {qrCodeData && (
              <>
                <QRCodeSVG value={qrCodeData} size={200} />
                <p className='mt-4 text-center'>Scan the QR code with your VNPAY app to complete the payment.</p>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='container mx-auto px-4 py-32 max-w-2xl'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Checkout</h1>
      <Card className='mb-6'>
        <p className='text-lg mb-2'>
          Selected Plan: <strong className='text-red-500'>{planName}</strong>
        </p>
        <p className='text-lg'>
          Price: <strong className='text-red-500'>{parseInt(planPrice).toLocaleString('vi-VN')} ₫/month</strong>
        </p>
      </Card>
      <StyledSteps current={currentStep} className='mb-8'>
        <Step title='User Info' />
        <Step title='Payment Method' />
        <Step title='Confirm Payment' />
      </StyledSteps>
      <div className='mb-8'>{renderStepContent()}</div>
      <div className='flex justify-between'>
        {currentStep > 0 && (
          <Button onClick={handlePrev} danger variant='outlined'>
            Previous
          </Button>
        )}
        {currentStep < 2 && (
          <Button type='primary' danger onClick={handleNext}>
            {currentStep === 1 ? 'Proceed to Payment' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  )
}
