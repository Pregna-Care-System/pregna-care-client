import AdminSidebar from '@/layouts/SideBarLayout/AdminSidebar'
import { selectFeatureInfoInfo, selectMembershipPlansAdminInfo } from '@/store/modules/global/selector'
import { FileAddFilled } from '@ant-design/icons'
import { Avatar, Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useState } from 'react'
import { FiDownload, FiTrash2 } from 'react-icons/fi'
import { TbEdit } from 'react-icons/tb'
import { useSelector } from 'react-redux'

export default function MemberShipPlanAdminPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const dataSource = useSelector(selectMembershipPlansAdminInfo)
  const featureList = useSelector(selectFeatureInfoInfo) || []

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName'
    },
    {
      title: 'Features',
      dataIndex: 'feature',
      key: 'feature',
      render: (features) => (
        <ul className='list-disc pl-4'>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Date create',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button type='primary'>
            <TbEdit />
          </Button>
          <Button danger variant='outlined'>
            <FiTrash2 />
          </Button>
        </Space>
      )
    }
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: any) => {
    console.log(`selected ${value}`)
  }
  const handleModalClick = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  const handleModalSubmit = () => {
    form.validateFields().then((values) => {

    const newPlan = {
      ...values,
      createdAt: new Date().toLocaleString()
    }
    setDataSource((prev)=> [...prev, newPlan])
    console.log("Form Values:", values)
    console.log('NEW', newPlan)
      setIsModalOpen(false)
      form.resetFields()
    })
  }
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-gray-800 text-white p-6 '>
        <AdminSidebar />
      </div>
      <div className='flex-1 p-8'>
        <div className='flex justify-end items-center mb-10'>
          <h4 className='px-2 border-s-2 border-gray-300'>
            Hello, <strong>UserName</strong>
          </h4>
          <div>
            <Avatar
              size={50}
              src={'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'}
            />
          </div>
        </div>
        <div className=' flex items-center justify-between mb-5'>
          <h1 className='text-3xl font-bold text-gray-800 mb-5'>Membership Plans</h1>
          <div className='flex space-x-4'>
            <button
              onClick={handleModalClick}
              className='flex items-center bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all '
            >
              <FileAddFilled className='w-5 h-5 text-[#7aeecb] mr-2' />
              <span className='text-[#7aeecb] font-semibold'>Create</span>
            </button>
            <button
              className={`flex items-center bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
              <span className='text-[#EE7A7A] font-semibold'>Report</span>
            </button>
          </div>
        </div>
        <div className='bg-white p-10 rounded-xl shadow-md'>
          <div className='flex justify-end mb-5'>
            <Input.Search className='w-1/3 mr-4' placeholder='Search' />
            <Select
              defaultValue='newest'
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: 'jack', label: 'Jack' },
                { value: 'newest', label: 'Newest' },
                { value: 'Yiminghe', label: 'yiminghe' }
              ]}
            />
          </div>
          <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} />
        </div>
      </div>
      <Modal title='Create Membership Plan' open={isModalOpen} onCancel={handleCancel} onOk={handleModalSubmit}>
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Package Name'
            name='packageName'
            rules={[{ required: true, message: 'Please input the package name' }]}
          >
            <Input placeholder='Enter package name' />
          </Form.Item>
          <Form.Item label='Price' name='price' rules={[{ required: true, message: 'Please input the price!' }]}>
            <Input placeholder='Enter price (e.g., $10.00)' />
          </Form.Item>
          <Form.Item
            label='Features'
            name='features'
            rules={[{ required: true, message: 'Please select at least one feature!' }]}
          >
            <Select
              mode='multiple'
              placeholder='Select features'
              options={featureList.map((feature) => ({ label: feature, value: feature }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
