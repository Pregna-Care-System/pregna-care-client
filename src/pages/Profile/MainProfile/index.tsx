import UserAvatar from '@/components/common/UserAvatar'
import { selectCurrentLoginUser } from '@/store/modules/global/selector'
import request from '@/utils/axiosClient'
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Upload } from 'antd'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'GET_CURRENT_LOGIN_USER',
      payload: user?.id
    })
  }, [dispatch, user?.id])

  const currentUserLogin = useSelector(selectCurrentLoginUser)
  const [userImage, setUserImage] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    if (currentUserLogin) {
      form.setFieldsValue({
        fullName: currentUserLogin.fullName,
        phoneNumber: currentUserLogin.phoneNumber,
        address: currentUserLogin.address,
        gender: currentUserLogin.gender,
        dateOfBirth: currentUserLogin.dateOfBirth ? dayjs(currentUserLogin.dateOfBirth) : null
      })

      setFullName(currentUserLogin.fullName)
      setUserImage(currentUserLogin.imageUrl)
    }
  }, [currentUserLogin, form])

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
    setFullName(`${values.fullName}`)
    const userInfo = {
      userId: currentUserLogin?.id,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      address: values.address,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null,
      imageUrl: userImage
    }

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
      setUserImage(response.data.secure_url)

      form.setFieldsValue({ imageUrl: response.data.secure_url })
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
              <UserAvatar src={userImage} name={fullName} size={130} />
            </div>
            <div className='profile_info'>
              <h2>{fullName}</h2>
              <p>{currentUserLogin?.email}</p>
            </div>
          </div>
          <div>
            <Form form={form} onFinish={handleSubmit} className='profile_form' layout='vertical'>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <Form.Item label='Full Name' name='fullName' initialValue={currentUserLogin?.fullName}>
                    <Input className='bg-gray-200' placeholder='Your full name' value={currentUserLogin?.fullName} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Phone Number' name='phoneNumber' initialValue={currentUserLogin?.phoneNumber}>
                    <Input
                      className='bg-gray-200'
                      placeholder='Your phone number'
                      value={currentUserLogin?.phoneNumber}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Address' name='address' initialValue={currentUserLogin?.address}>
                    <Input className='bg-gray-200' placeholder='Your address' value={currentUserLogin?.address} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='Gender' name='gender' initialValue={currentUserLogin?.gender}>
                    <Select options={genderOptions} placeholder='Your gender' value={currentUserLogin?.gender} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Date of Birth'
                    name='dateOfBirth'
                    initialValue={currentUserLogin?.dateOfBirth ? dayjs(currentUserLogin.dateOfBirth) : null}
                  >
                    <DatePicker
                      className='bg-gray-200'
                      placeholder='Your date of birth'
                      value={currentUserLogin?.dateOfBirth}
                    />
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
          <UserAvatar src={userImage} name={fullName} size={130} />
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
                    userId: currentUserLogin?.id,
                    fullName: form.getFieldValue('fullName') || currentUserLogin?.fullName || '',
                    phoneNumber: form.getFieldValue('phoneNumber') || currentUserLogin?.phoneNumber || '',
                    address: form.getFieldValue('address') || currentUserLogin?.address || '',
                    gender: form.getFieldValue('gender') || currentUserLogin?.gender || '',
                    dateOfBirth: form.getFieldValue('dateOfBirth')
                      ? dayjs(form.getFieldValue('dateOfBirth')).format('YYYY-MM-DD')
                      : currentUserLogin?.dateOfBirth || null,
                    imageUrl: userImage || currentUserLogin?.imageUrl || ''
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
