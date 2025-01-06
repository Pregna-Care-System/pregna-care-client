import { Button, Divider, Form, Input, message, Typography } from 'antd'
import backgroundAuth from '~/assets/background.png'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const login = () => {
    message.success('Login sc')
  }
  return (
    <div
      className='flex justify-center items-center w-lvw h-lvh'
      style={{
        backgroundImage: `url(${backgroundAuth})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Form
        onFinish={login}
        className='text-center bg-white bg-opacity-30 rounded-2xl p-10 border-2 border-solid border-gray-200 shadow-2xl'
        labelAlign='left'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Typography.Title>Welcome to ST</Typography.Title>
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
              message: 'Please enter valid email'
            }
          ]}
          label='Email Address'
          name={'myEmail'}
          className='mb-2'
        >
          <Input prefix={<UserOutlined />} placeholder='Enter your email' allowClear />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please enter valid password'
            }
          ]}
          label='Password'
          name={'myPassword'}
          className='mb-6'
        >
          <Input.Password prefix={<LockOutlined />} placeholder='Enter your password' allowClear />
        </Form.Item>
        <Button type='primary' htmlType='submit' block className='bg-black'>
          Login
        </Button>
        <Button type='link' className='mt-4'>
          <Link to='/forgot-password' className='text-gray-600 hover:underline hover:text-gray-800 transition-colors'>
            Forgot password?
          </Link>
        </Button>
        <div className='text-center mt-8 flex justify-center items-center gap-2'>
          <span className='text-gray-800'>Don't have an account?</span>
          <Button
            type='default'
            className='border-black border-1 text-black px-4 py-1 hover:bg-black hover:text-white transition-all rounded-md'
          >
            <Link to='/register'>Sign Up</Link>
          </Button>
        </div>
      </Form>
    </div>
  )
}
