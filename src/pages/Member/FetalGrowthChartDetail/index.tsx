import { useEffect, useState } from 'react'
import ApexCharts from 'react-apexcharts'
import { FiDownload } from 'react-icons/fi'
import FetusInfo from './Components/FetalInfo'
import { useDispatch, useSelector } from 'react-redux'
import { selectBabyInfo } from '@/store/modules/global/selector'
import { useLocation, useParams } from 'react-router-dom'

const FetalGrowthChartDetail = () => {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useDispatch()
  const param = useParams()

  useEffect(() => {
    dispatch({ type: 'GET_FETAL_GROWTH_RECORDS', payload: param.pregnancyRecordId })
  }, [param.pregnancyRecordId])

  const fetalWeightData = {
    series: [
      {
        name: '2024',
        data: [300, 600, 1200, 1800, 2500, 3000]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 300
      },
      stroke: {
        width: 2
      },
      xaxis: {
        categories: ['6-12', '16-20', '24-28', '32-34', '36', '38-40'],
        title: {
          text: 'Weeks'
        }
      },
      yaxis: {
        title: {
          text: 'Weight (g)'
        }
      },
      legend: {
        position: 'top'
      }
    }
  }

  const fetalMeasurementsData = {
    series: [
      {
        name: 'Head Circumference',
        data: [18, 22, 26.5, 30, 33]
      },
      {
        name: 'Abdominal Circumference',
        data: [16, 20, 23.8, 28, 32]
      },
      {
        name: 'Femur Length',
        data: [3, 4, 5.2, 6, 7]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 300
      },
      stroke: {
        width: 2
      },
      xaxis: {
        categories: ['6-12', '16-20', '24-28', '32-34', '36', '38-40'],
        title: {
          text: 'Weeks'
        }
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  const babyInfo = useSelector(selectBabyInfo)

  const mockData = {
    gestationalAge: 28,
    estimatedWeight: 1500,
    headCircumference: 26.5,
    abdominalCircumference: 23.8,
    femurLength: 5.2,
    dueDate: babyInfo[0]?.expectedDueDate
  }

  return (
    <>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Fetal growth</h1>
          <button
            className={`flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
            <span className='text-[#EE7A7A] font-semibold'>Report</span>
          </button>
        </div>

        <FetusInfo data={mockData} />

        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Fetal Weight Growth</h2>
            <ApexCharts options={fetalWeightData.options} series={fetalWeightData.series} type='line' />
          </div>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Fetal Measurements</h2>
            <ApexCharts options={fetalMeasurementsData.options} series={fetalMeasurementsData.series} type='line' />
          </div>
        </div>
      </div>
    </>
  )
}

export default FetalGrowthChartDetail
