import { createContact } from '@/services/contactService'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'

export default function ContactPage() {
  const [form] = useForm()

  const handleCreate = async (values) => {
    try {
      await createContact(values.fullName, values.email, values.message)
      message.success('Your message has been sent successfully!')
      form.resetFields() 
    } catch (error) {
      message.error('Failed to send your message. Please try again later.')
      console.error('Error creating contact:', error)
    }
  }

  return (
    <div
      className='min-h-screen py-8 px-4 sm:px-6 lg:px-8'
      style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}
    >
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-center text-4xl font-light text-white mb-8'>Contact Us</h1>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-3xl font-bold text-[#69275c] mb-4 text-center'>Contact Us</h2>
            <Form form={form} onFinish={handleCreate} className='space-y-6' layout='vertical'>
              <Form.Item name='fullName' label='Name' rules={[{ required: true, message: 'Please enter your name!' }]}>
                <Input
                  placeholder='Enter Your Name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#69275c]'
                />
              </Form.Item>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  placeholder='Enter Your Email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#69275c]'
                />
              </Form.Item>
              <Form.Item
                name='message'
                label='Message'
                rules={[{ required: true, message: 'Please enter your message!' }]}
              >
                <TextArea
                  placeholder='Your Message'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#69275c]'
                  rows={4}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='w-full bg-[#c7a2c0] text-white py-2 px-4 rounded-full hover:bg-[#97359c] transition duration-300'
                >
                  Send <i className='fas fa-paper-plane ml-2'></i>
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className='w-full md:w-1/2 bg-[#f0f4f8] flex items-center justify-center p-8'>
            <img
              src='https://res.cloudinary.com/dgzn2ix8w/image/upload/v1739897900/pregnaCare/mrwhqkhxyo60rnpafzti.png'
              alt='Contact'
              className='max-w-full h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
