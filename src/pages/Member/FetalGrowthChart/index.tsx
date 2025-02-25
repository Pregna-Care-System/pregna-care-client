import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectPregnancyRecord } from '@/store/modules/global/selector'
import { Breadcrumb, Layout, Typography } from 'antd'
import PregnancyRecordList from './components/PregnancyRecordList'

const { Content } = Layout
const { Title } = Typography

const FetalGrowthChart = () => {
  const pregnancyRecord = useSelector(selectPregnancyRecord)

  return (
    <Content>
      <Breadcrumb className='mb-4 ps-6'>
        <Breadcrumb.Item>Pregnancy Records</Breadcrumb.Item>
      </Breadcrumb>
      <PregnancyRecordList records={pregnancyRecord} />
    </Content>
  )
}

export default FetalGrowthChart
