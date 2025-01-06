import { Button, Divider, Form, Input, message, Typography } from 'antd'
import backgroundAuth from '~/assets/background.png'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import signup from '~/assets/signup.jpg'

export default function Register() {
  const register = () => {
    message.success('Login sc')
  }
  return (
    <div className='flex w-lvw h-lvh'>
      <div
        className='w-1/2 h-lvh'
        style={{
          backgroundImage: `url(${signup})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Typography.Title style={{ color: 'white', fontWeight: 'bold', marginTop: '50px' }}>
          Create your account free
        </Typography.Title>
        <p className='text-white text-lg mt-4 animate-pulse'>
          Join our community and unlock unlimited potential with exclusive resources, and opportunities designed just
          for you.
        </p>
      </div>
      <div className='w-1/2 bg-purple-100'>
        <Form
          onFinish={register}
          className='text-center bg-white bg-opacity-30 p-10'
          labelAlign='left'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Typography.Title>SIGN UP</Typography.Title>
          <div className='flex justify-center gap-6 text-gray-600 font-bold text-xl'>
            <GoogleOutlined className='cursor-pointer text-red-500' onClick={register} />
            <FacebookFilled className='cursor-pointer text-blue-900' onClick={register} />
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
            className='mb-2'
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Enter your password' allowClear />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter username'
              }
            ]}
            label='Username'
            name={'myUsername'}
            className='mb-6'
          >
            <Input prefix={<UserOutlined />} placeholder='Enter your username' allowClear />
          </Form.Item>
          <Button type='primary' htmlType='submit' block className='bg-black'>
            Register
          </Button>
          <div className='text-center mt-8 flex justify-center items-center gap-2'>
            <span className='text-gray-800'>Already have an account?</span>
            <Button
              type='default'
              className='border-black border-1 text-black px-4 py-1 hover:bg-black hover:text-white transition-all rounded-md'
            >
              <Link to='/login'>Login</Link>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
