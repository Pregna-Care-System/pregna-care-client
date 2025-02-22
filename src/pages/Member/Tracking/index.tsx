import { CreateModal } from '@/components/Modal'
import { selectGrowthMetricsOfWeek, selectPregnancyRecord } from '@/store/modules/global/selector'
import { ClockCircleOutlined, FileAddFilled } from '@ant-design/icons'
import { Button, Collapse, CollapseProps, Form, message, Modal, Progress, Select, Space, Table, Tag } from 'antd'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const CollapseContainer = styled.div`
  .collapse-container {
    height: 500px; /* Set fixed height */
    overflow-y: auto; /* Enable scrolling */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 8px;
    background-color: #fafafa;
  }
`

export default function Tracking() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const [pregnancyInfor, setPregnancyInfor] = React.useState([])
  const [selectedPregnancyId, setSelectedPregnancyId] = React.useState<string | null>(null)
  const dispatch = useDispatch()
  const pregnancyResponse = useSelector(selectPregnancyRecord)
  const growthMetricsOfWeek = useSelector(selectGrowthMetricsOfWeek)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    if (user?.id) {
      dispatch({ type: 'GET_ALL_PREGNANCY_RECORD', payload: { userId: user.id } })
    }
  }, [dispatch])

  useEffect(() => {
    if (pregnancyResponse) {
      setPregnancyInfor(pregnancyResponse)
    }
  }, [pregnancyResponse])

  const handleOpenModal = (week: number) => {
    dispatch({
      type: 'GET_ALL_GROWTH_METRICS_OF_WEEK',
      payload: { week: week }
    })
    setIsModalOpen(true)
  }
  const handleSubmit = (values: any) => {
    if (!selectedPregnancyId) {
      message.error('No pregnancy record selected!')
      return
    }
    setLoading(true)
    const token = localStorage.getItem('accessToken')
    const user = token ? jwtDecode(token) : null
    dispatch({
      type: 'CREATE_FETAL_GROWTH_RECORD',
      payload: {
        userId: user?.id,
        pregnancyRecordId: selectedPregnancyId,
        name: values.name,
        unit: values.unit,
        description: values.description,
        week: values.week,
        value: values.value,
        note: values.note
      }
    })
    setLoading(false)
    setIsModalOpen(false)
    form.resetFields()
  }

  const onClose = () => {
    setIsModalOpen(false)
  }

  const week = [
    {
      id: '1',
      number: 1,
      status: 'process',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    },
    {
      id: '2',
      number: 2,
      status: 'process',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    },
    {
      id: '3',
      number: 3,
      status: 'success',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    },
    {
      id: '4',
      number: 4,
      status: 'success',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    },
    {
      id: '5',
      number: 5,
      status: 'success',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    },
    {
      id: '6',
      number: 6,
      status: 'success',
      items: [
        { id: '1', fieldName: 'Weight', value: '200 gram' },
        { id: '2', fieldName: 'Notes', value: 'Baby 2' },
        { id: '3', fieldName: 'Baby 3', value: 'Baby 3' }
      ]
    }
  ]

  const renderTag = (status: string | boolean, week: number) => {
    if (status === 'waiting') {
      return (
        <Tag icon={<ClockCircleOutlined />} color='default'>
          waiting
        </Tag>
      )
    }
    if (status === 'process') {
      return (
        <div>
          <Tag icon={<ClockCircleOutlined />} color='processing'>
            process
          </Tag>
          <Button
            type='primary'
            className='ms-2'
            danger
            size='small'
            onClick={(e) => {
              e.stopPropagation()
              handleOpenModal(week)
            }}
          >
            <FileAddFilled />
          </Button>
        </div>
      )
    }
    if (status === 'success') {
      return (
        <Tag icon={<ClockCircleOutlined />} color='success'>
          success
        </Tag>
      )
    }
  }

  const itemsNest: CollapseProps['items'] = week.map((item) => ({
    key: item.id,
    label: (
      <div className='flex justify-between items-center'>
        <p className='m-0'>Week: {item.number}</p>
        {renderTag(item.status, item.number)}
      </div>
    ),
    children: item.items.map((subItem) => (
      <div key={subItem.id}>
        <p>
          {subItem.fieldName}: {subItem.value}
        </p>
      </div>
    )),
    collapsible: item.status === 'waiting' ? 'disabled' : undefined,
    onChange: () => handleOpenModal(item.id)
  }))

  const renderCollapse = () => {
    return (
      <div className=' grid grid-cols-2 gap-4'>
        {pregnancyResponse.map((item: { id: string; babyName: string }) => {
          return (
            <CollapseContainer>
              <Collapse
                key={item.id}
                activeKey={[item.id]}
                items={[
                  {
                    key: item.id,
                    label: (
                      <div className='flex justify-between items-center'>
                        <p className='m-0'>Baby name: {item.babyName}</p>
                        <Progress percent={30} type='circle' size={40} />
                      </div>
                    ),
                    children: <Collapse items={itemsNest} />
                  }
                ]}
              />
            </CollapseContainer>
          )
        })}
      </div>
    )
  }

  const fetusRecordFormItem = growthMetricsOfWeek.map((item) => {
    return {
      name: item.name,
      label: item.name,
      message: 'Please enter'
    }
  })

  return (
    <>
      {renderCollapse()}
      <CreateModal
        isOpen={isModalOpen}
        title='Create fetal growth record'
        formItem={fetusRecordFormItem}
        onClose={onClose}
        handleSubmit={handleSubmit}
        form={form}
        loading={loading}
      />
    </>
  )
}
