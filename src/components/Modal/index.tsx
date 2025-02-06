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
          name='motherName'
          label='Mother Name'
          rules={[{ required: true, message: 'Please enter your mother name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='dateOfBirth'
          label='Date Of Birth'
          rules={[{ required: true, message: 'Please enter your date of birth' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='bloodType'
          label='Blood Type'
          rules={[{ required: true, type: 'number', message: 'Please enter your blood type' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='healthStatus'
          label='Health Status'
          rules={[{ required: true, message: 'Please enter your health status' }]}
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
