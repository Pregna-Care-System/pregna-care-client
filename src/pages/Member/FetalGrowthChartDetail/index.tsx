import type React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Layout } from 'antd'
import { selectUserInfo } from '@/store/modules/global/selector'
import FetalGrowthScreen from './Components/FetalGrowthScreen'
import { mockFetalGrowthData } from '@/utils/constants/mock-data'
import { getPregnancyRecordById } from '@/services/pregnancyRecordService'

const { Content } = Layout

const FetalGrowthChartDetail: React.FC = () => {
  const dispatch = useDispatch()
  const param = useParams()

  const userInfo = useSelector(selectUserInfo)

  // Local state
  const [selectedPregnancy, setSelectedPregnancy] = useState(null)

  // Fetch pregnancy records when component mounts
  const getPregrancyInfo = async () => {
    try {
      if (userInfo.id && param.pregnancyRecordId) {
        const res = await getPregnancyRecordById(param.pregnancyRecordId)
        if (res.success) {
          setSelectedPregnancy(res.response)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    getPregrancyInfo()
  }, [param.pregnancyRecordId])

  return (
    <Content>
      <FetalGrowthScreen data={mockFetalGrowthData} selectedPregnancy={selectedPregnancy} />
    </Content>
  )
}

export default FetalGrowthChartDetail
