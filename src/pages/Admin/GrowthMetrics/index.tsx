import { useEffect, useState } from 'react'
import { Form, Input, Select, Table, Modal, Button } from 'antd'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { selectGrowthMetrics } from '@/store/modules/global/selector'
import { FaSearch } from 'react-icons/fa'

export default function GrowthMetrics() {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const dataSource = useSelector(selectGrowthMetrics)
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'GET_ALL_GROWTH_METRICS' })
  }, [])

  useEffect(() => {
    setFilteredData(dataSource)
  }, [dataSource])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Min value',
      dataIndex: 'minValue',
      key: 'minValue'
    },
    {
      title: 'Max value',
      dataIndex: 'maxValue',
      key: 'maxValue'
    },
    {
      title: 'Week',
      dataIndex: 'week',
      key: 'week'
    }
  ]

  const growthMetricsFormItem = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      message: 'Please enter name'
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'number',
      message: 'Please enter unit'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      message: 'Please enter description'
    },
    {
      name: 'minValue',
      label: 'Min value',
      type: 'number',
      message: 'Please enter min value'
    },
    {
      name: 'maxValue',
      label: 'Max value',
      type: 'number',
      message: 'Please enter max value'
    },
    {
      name: 'week',
      label: 'Week',
      type: 'text',
      message: 'Please enter week'
    }
  ]

  const uniqueWeeks = Array.from(new Set(dataSource.map((item: any) => item.week)))
    .sort((a, b) => a - b) // Sort by order
    .map((week) => ({
      value: week,
      label: `Week ${week}`
    }))

  const handleSearch = () => {
    const filtered = dataSource.filter(
      (item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by 'name'
    )
    setFilteredData(filtered)
  }
  const handleChange = (value: string) => {
    const filtered = dataSource.filter((item: any) => item.week === value)
    setFilteredData(filtered)
  }

  const handleCreate = (values: any) => {
    dispatch({ type: 'CREATE_GROWTH_METRIC', payload: values })
    form.resetFields()
    setIsOpen(false)
  }

  return (
    <>
      <div className='flex justify-between mb-5'>
        <h1 className='text-3xl font-bold text-gray-800 mb-5'>Growth Metrics</h1>
        <button
          className={`flex items-center h-1/3 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
        >
          <MdOutlineCreateNewFolder className='w-5 h-5 text-[#EE7A7A] mr-2' />
          <span className='text-[#EE7A7A] font-semibold text-sm'>Create</span>
        </button>
      </div>
      <div className='bg-white p-5 rounded-xl shadow-md'>
        <div className='flex justify-end mb-5'>
          <Input
            className='w-1/4 mr-4'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            allowClear
            placeholder='Search'
          />
          <button className='text-gray-500 rounded-lg mr-5' onClick={handleSearch}>
            <FaSearch />
          </button>
          <Select
            defaultValue=''
            style={{ width: 120 }}
            onChange={handleChange}
            options={[{ value: '', label: 'All Weeks' }, ...uniqueWeeks]}
          />
        </div>
        <Table dataSource={filteredData} columns={columns} pagination={{ pageSize: 5 }} loading={loading} />
      </div>
      <Modal
        title='Create Growth Metrics'
        open={isOpen}
        onCancel={() => {
          setIsOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleCreate}>
          <Form.Item
            name='name'
            label='Name'
            rules={[
              { required: true, message: 'Please enter name' },
              { min: 5, message: 'Name must be at least 5 characters' },
              { max: 255, message: 'Name cannot exceed 255 characters' }
            ]}
          >
            <Input placeholder='Enter metric name' />
          </Form.Item>

          <Form.Item
            name='unit'
            label='Unit'
            rules={[
              { required: true, message: 'Please enter unit' },
              { min: 1, message: 'Unit must be at least 1' },
              { max: 50, message: 'Unit cannot exceed 50 characters' },
              { pattern: /^[a-zA-Z]+$/, message: 'Unit should only contain letters' }
            ]}
          >
            <Input placeholder='Enter unit (e.g., mm, g, bpm)' />
          </Form.Item>

          <Form.Item
            name='description'
            label='Description'
            rules={[
              { required: true, message: 'Please enter description' },
              { min: 10, message: 'Description must be at least 10 characters' },
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]}
          >
            <Input.TextArea rows={4} placeholder='Enter description' />
          </Form.Item>

          <Form.Item
            name='minValue'
            label='Min Value'
            rules={[
              { required: true, message: 'Please enter minimum value' },
              {
                validator: (_, value) => {
                  if (value < 0) {
                    return Promise.reject('Minimum value cannot be negative')
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input type='number' placeholder='Enter minimum value' />
          </Form.Item>

          <Form.Item
            name='maxValue'
            label='Max Value'
            rules={[
              { required: true, message: 'Please enter maximum value' },
              {
                validator: (_, value) => {
                  if (value < 0) {
                    return Promise.reject('Maximum value cannot be negative')
                  }
                  return Promise.resolve()
                }
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('minValue') <= value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Maximum value must be greater than minimum value'))
                }
              })
            ]}
          >
            <Input type='number' placeholder='Enter maximum value' />
          </Form.Item>

          <Form.Item
            name='week'
            label='Week'
            rules={[
              { required: true, message: 'Please enter week number' },
              {
                validator: (_, value) => {
                  if (value < 1 || value > 40) {
                    return Promise.reject('Week must be between 1 and 40')
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input type='number' placeholder='Enter week number (1-40)' />
          </Form.Item>

          <div className='flex justify-end gap-2'>
            <Button
              onClick={() => {
                setIsOpen(false)
                form.resetFields()
              }}
            >
              Cancel
            </Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              Create
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
