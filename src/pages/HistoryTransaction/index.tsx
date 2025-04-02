import React, { useState, useEffect } from 'react'
import { Table, Tag, Input, Select, Space, Card, Typography, Spin, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getUserTransaction } from '../../services/planService'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@store/modules/global/selector'

const { Title } = Typography
const { Search } = Input

interface MembershipPlan {
  membershipPlanId: string
  membershipPlanName: string
  activatedAt: string
  expiryDate: string
  price: number
  isActive: boolean
}

const HistoryTransaction = () => {
  const currentUser = useSelector(selectUserInfo)
  const [transactions, setTransactions] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    setSearchQuery(searchInput.trim())
  }, [searchInput])

  useEffect(() => {
    if (currentUser?.id) {
      fetchTransactions()
    }
  }, [currentUser?.id])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const response = await getUserTransaction(currentUser?.id || '')
      if (response && Array.isArray(response)) {
        setTransactions(response)
      }
    } catch (error) {
      message.error('Failed to fetch transactions')
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (isActive: boolean) => (isActive ? 'success' : 'error')

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.membershipPlanName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === 'all' ||
        (statusFilter === 'active' && transaction.isActive) ||
        (statusFilter === 'inactive' && !transaction.isActive))
  )

  const columns: ColumnsType<MembershipPlan> = [
    {
      title: 'Plan Name',
      dataIndex: 'membershipPlanName',
      key: 'membershipPlanName'
    },
    {
      title: 'Activated Date',
      dataIndex: 'activatedAt',
      key: 'activatedAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price: number) => <span style={{ color: '#52c41a' }}>{price.toLocaleString()} VND</span>
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <Tag color={getStatusColor(isActive)}>{isActive ? 'Active' : 'Inactive'}</Tag>
    }
  ]

  return (
    <div className='p-28' style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}>
      <Title level={2}>Membership Plan History</Title>

      <Card className='mb-6'>
        <Space wrap className='w-full'>
          <Search
            placeholder='Search by plan name'
            allowClear
            enterButton={<SearchOutlined />}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            defaultValue='all'
            style={{ width: 150 }}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </Space>
      </Card>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey='membershipPlanId'
          pagination={{ pageSize: 3 }}
        />
      </Spin>
    </div>
  )
}

export default HistoryTransaction
