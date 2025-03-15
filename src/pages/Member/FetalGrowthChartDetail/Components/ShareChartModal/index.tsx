import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Switch, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { selectTagInfo, selectUserInfo } from '@/store/modules/global/selector'

interface ShareChartModalProps {
  isOpen: boolean
  onClose: () => void
  chartData: string // JSON stringified chart data
  chartType: string
  previewImage: string
}

const ShareChartModal: React.FC<ShareChartModalProps> = ({ isOpen, onClose, chartData, chartType, previewImage }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const tags = useSelector(selectTagInfo) || []
  const user = useSelector(selectUserInfo)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagsLoading, setTagsLoading] = useState(true)

  // Load tags when modal opens
  useEffect(() => {
    if (isOpen && (!tags || tags.length === 0)) {
      setTagsLoading(true)
      dispatch({ type: 'GET_ALL_TAGS' })
    } else {
      setTagsLoading(false)
    }
  }, [isOpen, dispatch, tags])

  const handleSubmit = () => {
    setIsSubmitting(true)
    form
      .validateFields()
      .then((values) => {
        // Create blog post with chart data
        dispatch({
          type: 'CREATE_BLOG',
          payload: {
            ...values,
            userId: user.id,
            featuredImageUrl:
              previewImage ||
              'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1740588447/PregnaCare/ypdcsuzin5hbi37lquec.jpg',
            type: 'community',
            status: 'pending', // Blog needs approval
            sharedChartData: chartData,
            content: values.shortDescription // Use shortDescription as content for simplicity
          }
        })

        message.success('Chart shared successfully! It will be reviewed by admin before publishing.')
        form.resetFields()
        onClose()
      })
      .catch((error) => {
        console.error('Form validation error:', error)
        message.error('Please complete all required fields')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Modal
      title='Share Chart'
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key='cancel' onClick={onClose}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' onClick={handleSubmit} loading={isSubmitting}>
          Share
        </Button>
      ]}
      width={600}
    >
      <div className='mb-4'>
        <img
          src={previewImage}
          alt='Chart Preview'
          className='w-full h-64 object-contain rounded-md border border-gray-200'
        />
      </div>

      <Form form={form} layout='vertical' initialValues={{ isVisible: true }}>
        <Form.Item name='tagIds' label='Tags' rules={[{ required: true, message: 'Please select at least one tag' }]}>
          <Select
            mode='tags'
            placeholder='Select tags'
            loading={tagsLoading}
            notFoundContent={tagsLoading ? 'Loading tags...' : 'No tags found'}
          >
            {tags.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='pageTitle'
          label='Title'
          rules={[{ required: true, message: 'Please enter a title for your shared chart' }]}
        >
          <Input placeholder={`My ${chartType} Chart`} />
        </Form.Item>

        <Form.Item
          name='shortDescription'
          label='Description'
          rules={[{ required: true, message: 'Please provide a brief description' }]}
        >
          <Input.TextArea
            placeholder="Share what this chart shows and why it's important"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item name='heading' initialValue={`${chartType} Chart`} hidden>
          <Input />
        </Form.Item>

        <Form.Item name='isVisible' valuePropName='checked' initialValue={true} label='Make public'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ShareChartModal
