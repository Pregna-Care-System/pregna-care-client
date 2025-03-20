import { Button, Col, Form, Input, Row } from 'antd'
import { SendIcon } from 'lucide-react'

export default function ChatForm({ chatHistory, setChatHistory, generateChatResponse }) {
  const [form] = Form.useForm()

  const handleSubmit = (values: any) => {
    console.log('Form values:', values.message)
    if (!values.message?.trim()) return

    setChatHistory((history) => [...history, { role: 'user', text: values.message }])
    form.resetFields()

    setTimeout(() => setChatHistory((history) => [...history, { role: 'mode', text: 'Thinking...' }]))
    form.resetFields()

    generateChatResponse([...chatHistory, { role: 'user', text: values.message }])
  }
  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={2}>
          <Col flex='auto'>
            <Form.Item name='message'>
              <Input
                type='text'
                placeholder='Type your message...'
                className='w-11/12 p-2 border border-gray-200 rounded-lg ml-4'
              />
            </Form.Item>
          </Col>
          <Col>
            <Button htmlType='submit' icon={<SendIcon />} className='mr-2 mt-1' style={{ border: 'none' }} />
          </Col>
        </Row>
      </Form>
    </div>
  )
}
