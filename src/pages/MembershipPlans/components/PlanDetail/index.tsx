import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { getPlanByName } from '@/services/planService'

export default function PlanDetail() {
  const { planName } = useParams()
  const [planDetail, setPlanDetail] = useState<MODEL.PlanResponse | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlans = async () => {
      if (!planName) return
      const data = await getPlanByName(planName)
      setPlanDetail(data)
    }
    fetchPlans()
  }, [planName])

  if (!planDetail) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-400'></div>
      </div>
    )
  }

  if (!planName) {
    return <div className='flex items-center justify-center min-h-screen text-gray-600'>Plan not found</div>
  }

  const handleUpgrade = () => {
    if (!planDetail) return
    navigate(
      `/checkout?planId=${planDetail.membershipPlanId}&planName=${encodeURIComponent(
        planDetail.planName
      )}&planPrice=${encodeURIComponent(planDetail.price)}`
    )
  }

  return (
    <div
      className='flex justify-center px-4 py-8 min-h-screen'
      style={{
        background: 'linear-gradient(135deg, #fce7e7 0%, #e9f3ff 100%)'
      }}
    >
      <div className='container mx-auto max-w-6xl'>
        <div
          className='mt-20 mb-20 overflow-hidden bg-white rounded-3xl shadow-xl transform transition-all duration-300 hover:shadow-2xl'
          style={{
            minHeight: '70vh'
          }}
        >
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between'>
              <div>
                <h1 className='font-bold text-4xl mb-3 text-gray-800 tracking-tight'>{planDetail.planName}</h1>
                <div className='mb-8'>
                  <span className='text-4xl font-bold text-rose-500'>
                    {planDetail.price.toLocaleString('vi-VN')} VND
                  </span>
                  <span className='text-gray-500 ml-2'>
                    {planDetail.planName === 'FreePlan' ? '/3 days' : '/month'}
                  </span>
                </div>
                <div className='space-y-4 mb-8'>
                  {planDetail.features.map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-3 group transition-all duration-300 hover:translate-x-1'
                    >
                      <CheckCircleOutlined className='text-rose-400 text-xl group-hover:text-rose-500' />
                      <span className='text-gray-600 text-lg'>{feature.featureName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='mt-8'>
                <Button
                  type='primary'
                  size='large'
                  className='w-full md:w-auto transition-all duration-300 hover:scale-105'
                  style={{
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #f87171 100%)',
                    border: 'none',
                    height: '50px',
                    fontSize: '1.1rem',
                    paddingLeft: '2rem',
                    paddingRight: '2rem'
                  }}
                  onClick={handleUpgrade}
                >
                  Upgrade to {planDetail.planName}
                </Button>
              </div>
            </div>

            <div className='w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gradient-to-br from-rose-50 to-blue-50'>
              <div className='relative w-full h-full max-h-[400px] overflow-hidden rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105'>
                <img src={planDetail.imageUrl} alt={planDetail.planName} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
