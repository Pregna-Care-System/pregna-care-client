import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { getPlanByName } from '@/services/planService'

export default function PlanDetail() {
  const { planName } = useParams()
  const [planDetail, setPlanDetail] = useState<MODEL.PlanResponse | null>(null)
  console.log('Plan Name:', planName)
  useEffect(() => {
    const fetchPlans = async () => {
      if (!planName) return
      const data = await getPlanByName(planName)
      console.log(data)
      setPlanDetail(data)
    }
    fetchPlans()
  }, [planName])

  if (!planDetail) {
    return <div>Loading...</div>
  }
  if (!planName) {
    return <div>Plan not found</div>
  }

  return (
    <div
      className=' flex justify-center px-4 py-8'
      style={{
        background: 'linear-gradient(to bottom, #f6e3e1, #f0f8ff)',
        minHeight: '100vh'
      }}
    >
      <div
        className='container mx-auto border border-solid rounded-3xl w-10/12 shadow-md mt-20 mb-20 flex flex-col md:flex-row items-center'
        style={{
          background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)',
          minHeight: '70vh'
        }}
      >
        <div className='w-full md:w-1/2 p-6 text-left'>
          <h1 className='font-bold text-4xl mb-5'>{planDetail.planName}</h1>
          <p className='text-3xl font-bold mb-4'>{planDetail.price.toLocaleString('vi-VN')}</p>
          <ul className='space-y-2 mb-6'>
            {planDetail.features.map((feature, index) => (
              <li key={index} className='flex items-center'>
                <CheckOutlined className='mr-2 text-green-500' />
                {feature.featureName}
              </li>
            ))}
          </ul>
          <div className='text-left'>
            <Button
              type='primary'
              size='large'
              style={{
                borderColor: '#f87171',
                color: '#f87171',
                backgroundColor: 'transparent',
                borderWidth: '1px'
              }}
            >
              Upgrade to {planDetail.planName}
            </Button>
          </div>
        </div>

        <div className='w-full md:w-1/2 p-6'>
          <img
            src={planDetail.imageUrl}
            alt={planDetail.planName}
            className='w-full h-60 object-cover rounded-md'
            style={{ maxHeight: '300px', borderRadius: '12px' }}
          />
        </div>
      </div>
    </div>
  )
}
