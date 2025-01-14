import { Button, Checkbox, Divider, Form, Input, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import loginBg from '@/assets/register.jpg'

export default function LoginPage() {
  const login = () => {
    message.success('Login successful')
  }

  return (
    <div className='flex w-lvw h-lvh'>
      <div
        className='w-1/2 h-lvh'
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className='w-1/2 bg-red-50'>
        <Form
          onFinish={login}
          className='text-center bg-white w-full h-full bg-opacity-30 p-10 pt-0 pb-0'
          labelAlign='left'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Typography.Title style={{ color: '#e57373', marginBottom: '10px' }}>Welcome to PregnaCare</Typography.Title>
          <div className='flex justify-center gap-6 text-gray-600 font-bold text-xl'>
            <GoogleOutlined className='cursor-pointer text-red-500' onClick={login} />
            <FacebookFilled className='cursor-pointer text-blue-900' onClick={login} />
          </div>
          <Divider className='border-black border-solid'>OR</Divider>
          <Form.Item
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please enter a valid email'
              }
            ]}
            label='Email Address'
            name='email'
            className='mb-4'
          >
            <Input prefix={<UserOutlined />} placeholder='Enter your email' allowClear />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter a valid password'
              }
            ]}
            label='Password'
            name='password'
            className='mb-8'
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Enter your password' allowClear />
          </Form.Item>
          <Button type='primary' htmlType='submit' block className='bg-red-400'>
            Login
          </Button>
          <Form.Item className='w-full flex items-center justify-between mt-4'>
            <Button type='link' className='text-gray-600'>
              <Link to='/forgot-password' className='hover:text-red-300'>
                Forgot password?
              </Link>
            </Button>
          </Form.Item>
          <div className='text-center mt-8 flex justify-center items-center gap-2'>
            <span className='text-gray-800'>Don't have an account?</span>
            <Button
              type='default'
              className='border-red-400 border-1 text-black px-4 py-1 hover:bg-black hover:text-white transition-all rounded-md'
            >
              <Link to='/register'>Sign Up</Link>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
