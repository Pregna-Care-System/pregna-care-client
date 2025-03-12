import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectMotherInfo, selectPregnancyRecord, selectUserInfo } from '@/store/modules/global/selector'
import { Breadcrumb, Layout, Spin, Typography } from 'antd'
import PregnancyRecordList from './components/PregnancyRecordList'

const GET_ALL_MOTHER_INFO = 'GET_ALL_MOTHER_INFO'
const GET_ALL_PREGNANCY_RECORD = 'GET_ALL_PREGNANCY_RECORD'

const FetalGrowthChart = () => {
  const pregnancyRecord = useSelector(selectPregnancyRecord)
  const motherInfo = useSelector(selectMotherInfo)
  const userInfo = useSelector(selectUserInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userInfo.id) {
      dispatch({ type: GET_ALL_MOTHER_INFO, payload: { userId: userInfo.id } })
    }
  }, [dispatch, userInfo.id])

  useEffect(() => {
    if (motherInfo?.length > 0) {
      const currentMotherInfo = motherInfo[0]
      // Use the current motherInfo directly instead of relying on the state that hasn't updated yet
      if (currentMotherInfo?.id) {
        if (pregnancyRecord.length === 0) {
          dispatch({ type: GET_ALL_PREGNANCY_RECORD, payload: { userId: currentMotherInfo.id } })
        }
      }
    }
  }, [motherInfo, dispatch])

  return (
    <>
      <Breadcrumb className={'mb-4 ps-6'}>
        <Breadcrumb.Item>Pregnancy Records</Breadcrumb.Item>
      </Breadcrumb>
      <PregnancyRecordList records={pregnancyRecord} />
    </>
  )
}

export default FetalGrowthChart
