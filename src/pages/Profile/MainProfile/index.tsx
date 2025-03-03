import { UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, Col, DatePicker, Select, Upload, Modal, message } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { selectUserInfo } from '@/store/modules/global/selector'
import request from '@/utils/axiosClient'
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
    display: flex;
    justify-content: end;
    margin-top: 2rem;
  }
  .edit_button .ant-btn {
    width: 7rem;
    height: 2rem;
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
  const [userImage, setUserImage] = useState<string | null>(user?.picture || null)
  const [form] = Form.useForm()
  const dispatch = useDispatch()

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

  const handleSubmit = async (values: any) => {
    const userInfo = {
      userId: user?.id,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      address: values.address,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
      imageUrl: ''
    }
    console.log('User infor', userInfo)
    dispatch({
      type: 'UPDATE_USER_INFORMATION',
      payload: userInfo
    })
  }
  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'PregnaCare')
    formData.append('cloud_name', 'dgzn2ix8w')
    try {
      const response = await request.post('https://api.cloudinary.com/v1_1/dgzn2ix8w/image/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('Upload response:', response.data)
      setUserImage(response.data.secure_url)

      form.setFieldsValue({ imageUrl: response.data.secure_url })
      message.success('Image uploaded successfully')
    } catch (error) {
      message.error('Failed to upload image')
      console.error('Upload error details', error?.response.data || error.message)
    }
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
          </div>
          <div>
            <Form form={form} onFinish={handleSubmit} className='profile_form' layout='vertical'>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label='Full Name' name='fullName' initialValue={user?.name}>
                    <Input className='bg-gray-200' placeholder='Your full name' value={user?.name} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Phone Number' name='phoneNumber' initialValue={user?.phone}>
                    <Input className='bg-gray-200' placeholder='Your phone number' value={user?.phone} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Address' name='address' initialValue={user?.address}>
                    <Input className='bg-gray-200' placeholder='Your address' value={user?.address} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Gender' name='gender' initialValue={user?.gender}>
                    <Select options={genderOptions} placeholder='Your gender' value={user?.gender} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Date of Birth'
                    name='dateOfBirth'
                    initialValue={user?.dateOfBirth ? dayjs(user.dateOfBirth) : null}
                  >
                    <DatePicker className='bg-gray-200' placeholder='Your date of birth' value={user?.dateOfBirth} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item>
                    <div className='edit_button'>
                      <Button htmlType='submit'>Edit</Button>
                    </div>
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
            <img
              className='w-60 h-60 border border-solid object-cover'
              src={userImage}
              alt='User Avatar'
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <UserOutlined className='text-5xl border border-solid rounded-full' />
          )}
        </div>
        <div className='mt-10 flex'>
          <div>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file.size > 900000) {
                    reject('File size exceeded')
                    message.error('File size exceeded')
                  } else {
                    resolve('Success')
                  }
                })
              }}
              customRequest={({ file, onSuccess, onError }) => {
                handleUpload(file)
                  .then(() => onSuccess('ok'))
                  .catch(onError)
              }}
              showUploadList={false}
            >
              <Button>Upload image</Button>
            </Upload>
          </div>
          <div className='ml-52'>
            <Button
              type='primary'
              onClick={() => {
                dispatch({
                  type: 'UPDATE_USER_INFORMATION',
                  payload: {
                    userId: user?.id,
                    fullName: form.getFieldValue('fullName') || user?.name || '',
                    phoneNumber: form.getFieldValue('phoneNumber') || user?.phone || '',
                    address: form.getFieldValue('address') || user?.address || '',
                    gender: form.getFieldValue('gender') || user?.gender || '',
                    dateOfBirth: form.getFieldValue('dateOfBirth')
                      ? dayjs(form.getFieldValue('dateOfBirth')).format('YYYY-MM-DD')
                      : user?.dateOfBirth || null,
                    imageUrl: userImage || user?.image || ''
                  }
                })
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
