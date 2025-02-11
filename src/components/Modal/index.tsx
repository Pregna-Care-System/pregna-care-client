import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form, Input, message } from 'antd'

interface CreateModalProps {
  title: string
  isOpen: boolean
  formItem: []
  onClose: () => void
  handleSubmit: (values: any) => void
}

export function CreateModal({ isOpen, title, formItem, onClose, handleSubmit }: CreateModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const renderForm = () => {
    return formItem.map((item: any) => {
      return (
        <Form.Item name={item.name} label={item.label} rules={[{ required: true, message: item.message }]}>
          <Input />
        </Form.Item>
      )
    })
  }

  return (
    <Modal title={title} open={isOpen} onCancel={onClose} footer={null}>
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        {renderForm()}
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
