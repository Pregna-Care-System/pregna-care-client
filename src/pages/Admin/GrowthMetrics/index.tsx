import { useEffect, useState } from 'react'
import { Form, Input, Select, Table } from 'antd'
import { MdOutlineCreateNewFolder } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { selectGrowthMetrics } from '@/store/modules/global/selector'
import { CreateModal } from '@/components/Modal'
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
      <CreateModal
        isOpen={isOpen}
        title='Create Growth Metrics'
        formItem={growthMetricsFormItem}
        onClose={() => setIsOpen(false)}
        handleSubmit={handleCreate}
        form={form}
        loading={loading}
      />
    </>
  )
}
