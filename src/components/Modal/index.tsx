import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form, Input } from 'antd'

interface CreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    console.log(values)
  }

  return (
    <Modal title={`Mother Information`} open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          name='week'
          label='Week'
          rules={[{ required: true, type: 'number', message: 'Please enter a valid week' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='heartRate'
          label='Heart rate'
          rules={[{ required: true, message: 'Please enter your heart rate' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='weight'
          label='Weight'
          rules={[{ required: true, type: 'number', message: 'Please enter a valid weight' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='bloodPressure'
          label='Blood Pressure'
          rules={[{ required: true, message: 'Please enter your blood pressure' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='healthStatus'
          label='Health Status'
          rules={[{ required: true, type: 'string', message: 'Please enter a valid health status' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='notes' label='Notes' rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
