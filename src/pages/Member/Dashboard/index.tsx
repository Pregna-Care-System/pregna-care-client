import { CreateModal } from '@/components/Modal'
import { selectMotherInfo } from '@/store/modules/global/selector'
import { Avatar, Button, Select, Space, Table } from 'antd'
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { TbEdit } from 'react-icons/tb'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const dataSource = useSelector(selectMotherInfo)
  const columns = [
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week'
    },
    {
      title: 'Heart Rate',
      dataIndex: 'heartRate',
      key: 'heartRate'
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight'
    },
    {
      title: 'Blood Pressure',
      dataIndex: 'bloodPressure',
      key: 'bloodPressure'
    },
    {
      title: 'Health Status',
      dataIndex: 'healthStatus',
      key: 'healthStatus'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
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

  const handleChange = (value: any) => {
    console.log(`selected ${value}`)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div className='flex-1 p-8'>
      <div className='flex justify-end items-center mb-10'>
        <h4 className='px-2 border-s-2 border-gray-300'>
          Hello, <strong>Username</strong>
        </h4>
        <div>
          <Avatar
            size={50}
            src={'https://res.cloudinary.com/drcj6f81i/image/upload/v1736877741/PregnaCare/cu1iprwqkhzbjb4ysoqk.png'}
          />
        </div>
      </div>
      <div className='flex justify-end w-full'>
        <Button type='primary' className='mb-5' danger onClick={handleOpenModal}>
          Create
        </Button>
      </div>
      <div className='bg-white p-10 rounded-xl shadow-md'>
        <h4 className='text-xl font-bold mb-5'>Mother Information</h4>
        <div className='flex justify-end mb-5'>
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
      <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
