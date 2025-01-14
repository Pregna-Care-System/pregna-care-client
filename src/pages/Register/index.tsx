import { Button, Divider, Form, Input, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import signup from '@/assets/register.jpg'

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
      </div>
      <div className='w-1/2 bg-red-50'>
        <Form
          onFinish={register}
          className='text-center bg-white bg-opacity-30 p-10 pt-0 pb-0'
          labelAlign='left'
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Typography.Title style={{color: '#e57373'}}>SIGN UP</Typography.Title>
          <div className='flex justify-center gap-6 text-gray-600 font-bold text-xl'>
            <GoogleOutlined className='cursor-pointer text-red-500' onClick={register} />
            <FacebookFilled className='cursor-pointer text-blue-900' onClick={register} />
          </div>
          <Divider className='border-black border-solid'>OR</Divider>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter Fullname'
              }
            ]}
            label='Fullname'
            name={'myFullName'}
            className='mb-2 mt-0'
          >
            <Input prefix={<UserOutlined />} placeholder='Enter your fullname' allowClear />
          </Form.Item>
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
                message: 'Please enter valid password'
              }
            ]}
            label='ConfirmPassword'
            name={'myPassword'}
            className='mb-6'
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Enter your confirm password' allowClear />
          </Form.Item>
          <Button type='primary' htmlType='submit' block className='bg-red-400'>
            Register
          </Button>
          <div className='text-center mt-8 flex justify-center items-center gap-2'>
            <span className='text-gray-800'>Already have an account?</span>
            <Button
              type='default'
              className='border-red-400 border-1 text-black px-4 py-1 hover:bg-black hover:text-white transition-all rounded-md'
            >
              <Link to='/login'>Login</Link>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
