import { UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, Col, DatePicker, Select, Upload, Modal, message } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  .avatar_profile {
    transition:
      transform 0.4s ease,
      opacity 0.4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140px;
    height: 140px;
    margin-top: -50px;
    margin-left: 20px;
    border: 4px solid white;
    border-radius: 50%;
    background-color: #f0f0f0;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      scale: calc(1.1);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .profile_info {
    text-align: left;
    padding-left: 20px;
    margin-top: 10px;
    h2 {
      font-size: 1.5rem;
      margin: 8px 0;
      font-weight: bold;
    }
    p {
      font-size: 1rem;
      color: #888;
      margin-bottom: 16px;
    }
  }

  .edit_button {
    position: absolute;
    top: 85%;
    right: 150px;
    transform: translateY(-60%);
  }
  .edit_button .ant-btn {
    background-color: black;
    border-color: black;
    color: white;
  }
  .edit_button .ant-btn:hover {
    background-color: #e26b80;
    border-color: #333;
  }
  .profile_form {
    margin-top: 50px;
    padding: 20px;
  }
  .ant-select-selector {
    background-color: #e5e7eb !important;

    &:hover {
      background-color: #ffffff !important;
    }
  }
`

export default function MainProfile() {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null
  const [userImage, setUserImage] = useState<string | null>(user?.image || null)

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ]

  const [isModalOpen, setModalOpen] = useState(false)

  const showModal = () => {
    setModalOpen(true)
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return
    }
    if (info.file.status === 'done') {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserImage(reader.result as string)
      }
      reader.readAsDataURL(info.file.originFileObj as RcFile)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }

  const uploadProps = {
    name: 'file',
    action: 'https://httpbin.org/post',
    showUploadList: false,
    onChange: handleChange
  }

  return (
    <Wrapper
      className='px-4 py-36 flex justify-center'
      style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}
    >
      <div className='border border-solid rounded-3xl w-11/12 shadow-2xl py-2 bg-slate-100'>
        <div className='m-10 bg-white'>
          <div className='w-full h-60' style={{ background: 'linear-gradient(to right, #e26b80, #dd87f1)' }}></div>
          <div className='flex'>
            <div className='avatar_profile' onClick={showModal}>
              {userImage ? (
                <img src={userImage} alt='User Avatar' />
              ) : (
                <UserOutlined className='text-5xl cursor-pointer' />
              )}
            </div>
            <div className='profile_info'>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
            <div className='edit_button'>
              <Button type='primary'>Edit</Button>
            </div>
          </div>
          <div>
            <Form className='profile_form' layout='vertical'>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label='Full Name'>
                    <Input className='bg-gray-200' placeholder='Your full name' value={user.name} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Phone Number'>
                    <Input className='bg-gray-200' placeholder='Your phone number' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Address'>
                    <Input className='bg-gray-200' placeholder='Your address' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Gender'>
                    <Select options={genderOptions} placeholder='Your gender' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Date of Birth'>
                    <DatePicker className='bg-gray-200' placeholder='Your date of birth' />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
      <Modal title='Edit Avatar' open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div className='flex flex-col justify-center items-center w-full'>
          {userImage ? (
            <img className='w-2/3 h-2/3 border border-solid rounded-full' src={userImage} alt='User Avatar' />
          ) : (
            <UserOutlined className='text-5xl border border-solid rounded-full' />
          )}
        </div>
        <div className='mt-10 flex'>
          <div>
            <Upload {...uploadProps}>
              <Button style={{ background: 'black', color: 'white' }}>Upload Avatar</Button>
            </Upload>
          </div>
          <div className='ml-52'>
            <Button
              type='primary'
              onClick={() => {
                message.success('Avatar updated successfully')
                handleCancel()
              }}
            >
              Edit
            </Button>
            <Button type='default' onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </Wrapper>
  )
}
