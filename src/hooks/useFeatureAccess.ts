import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@store/modules/global/selector'
import { getAllFeatureByUserId } from '@/services/featureService'

export default function useFeatureAccess() {
  const user = useSelector(selectUserInfo)
  const userId = user?.id
  const [userFeatures, setUserFeatures] = useState([])

  useEffect(() => {
    if (!userId) return

    const fetchUserFeatures = async () => {
      try {
        const res = await getAllFeatureByUserId(userId)
        if (res.status === 200) {
          setUserFeatures(res.data.response)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserFeatures()
  }, [userId])

  const hasAccess = (featureId, featureName) => {
    return userFeatures.some((feature) => {
      if (featureId && feature.featureId === featureId) return true
      if (featureName && feature.featureName?.trim().toLowerCase() === featureName.trim().toLowerCase()) return true
      return false
    })
  }

  return { hasAccess }
}
