import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form, Input, message } from 'antd'
import ROUTES from '@/utils/config/routes'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  plan: {
    name: string
    price: number
  }
}

export function UpgradeModal({ isOpen, onClose, plan }: UpgradeModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // Here you would typically make an API call to your backend to initiate the VNPay payment process
      // For this example, we'll simulate the process with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the VNPAY page
      navigate(
        ROUTES.VNPAY +
          `?planName=${encodeURIComponent(plan.name)}&planPrice=${encodeURIComponent(plan.price.toString())}`
      )
    } catch (error) {
      message.error('An error occurred while processing your request. Please try again.')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal title={`Upgrade to ${plan.name} Plan`} open={isOpen} onCancel={onClose} footer={null}>
      <p className='mb-4'>
        You are about to upgrade to the {plan.name} plan for {plan.price.toLocaleString('vi-VN')} ₫/month.
      </p>
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
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
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            Proceed to VNPay
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
