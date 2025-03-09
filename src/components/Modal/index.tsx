import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form, Input, message } from 'antd'

interface CreateModalProps {
  title: string
  isOpen: boolean
  formItem: []
  onClose: () => void
  handleSubmit: (values: any) => void
  form: any
  loading: boolean
  buttonName: string
}

export function CreateModal({
  isOpen,
  title,
  formItem,
  onClose,
  handleSubmit,
  form,
  loading,
  buttonName
}: CreateModalProps) {
  const renderForm = () => {
    return formItem.map((item: any, index: number) => {
      return (
        <Form.Item
          name={item.name}
          label={item.label}
          rules={[{ required: true, message: item.message }]}
          key={index}
          hidden={item.hidden}
        >
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
            {buttonName}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
