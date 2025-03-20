import { forgotPassword } from '@/services/userService'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const navigate = useNavigate()

  const onResendPassword = async (values: { email: string }) => {
    try {
      const response = await forgotPassword(values.email)
      if (response && response.success) {
        message.success('Resend password successful')
        navigate('/resend-password')
      } else {
        message.error(response.message || 'Resend password failed')
      }
    } catch (error: any) {
      message.error(error.message || 'An unexpected error occurred')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Forgot Password</h2>
        <Form onFinish={onResendPassword} layout='vertical'>
          <Form.Item name='email' label='Email' rules={[{ required: true, message: 'Please enter your email' }]}>
            <Input type='email' placeholder='Enter your email' />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='w-full bg-red-400 border-1 text-white px-4 py-2 hover:bg-black hover:text-white transition-all rounded-md'
            >
              Resend Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPassword
