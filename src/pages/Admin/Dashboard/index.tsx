import { useCallback, useEffect, useRef, useState } from 'react'
import ApexCharts from 'react-apexcharts'
import { FiArrowDown, FiArrowUp, FiDollarSign, FiDownload, FiPieChart, FiUserCheck, FiUsers } from 'react-icons/fi'
import { ApexOptions } from 'apexcharts'
import {
  fetchMembershipPlanStats,
  fetchRecentTransactionStats,
  fetchStatistics,
  fetchTotalRevenueStats
} from '@/services/statisticsService'
import { formatDateTime, formatNumber, generateRandomColor, getInitials } from '@/utils/helper'
import { Avatar } from 'antd'

const iconMap = {
  FiUserCheck: <FiUserCheck className='w-6 h-6 text-[#EE7A7A]' />,
  FiUsers: <FiUsers className='w-6 h-6 text-[#EE7A7A]' />,
  FiPieChart: <FiPieChart className='w-6 h-6 text-[#EE7A7A]' />,
  FiDollarSign: <FiDollarSign className='w-6 h-6 text-[#EE7A7A]' />
}

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState([])
  const [membershipPlanStats, setMembershipPlanStats] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [totalRevenue, setTotalRevenue] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const [timeframe, setTimeframe] = useState('month')
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [offset, setOffset] = useState(1)
  const [limit] = useState(5)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastTransactionRef = useRef<HTMLDivElement | null>(null)

  const loadMoreTransactions = useCallback(async () => {
    if (!hasMore || isFetching) return

    setIsFetching(true)

    const nextOffset = offset + limit // Lưu giá trị offset mới
    const response = await fetchRecentTransactionStats(offset, limit)

    if (response.success && response.response.transactions.length > 0) {
      setRecentTransactions((prev) => [...prev, ...response.response.transactions])
      setOffset(nextOffset)
    } else {
      setHasMore(false)
    }

    setIsFetching(false)
  }, [limit, hasMore, isFetching])

  useEffect(() => {
    if (!lastTransactionRef.current) return

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreTransactions()
        }
      },
      { threshold: 0.5 }
    )

    if (lastTransactionRef.current) {
      observer.current.observe(lastTransactionRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loadMoreTransactions])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchTotalRevenueStats()
      const statsArray = Array.isArray(response.response)
        ? response.response.map((item) => ({
            ...item,
            bgColor: generateRandomColor()
          }))
        : []

      setTotalRevenue(statsArray)

      console.log(statsArray)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchMembershipPlanStats()
      const statsArray = Array.isArray(response.response)
        ? response.response.map((item) => ({
            ...item,
            bgColor: generateRandomColor()
          }))
        : []

      setMembershipPlanStats(statsArray)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { members, users, transactions, revenue } = await fetchStatistics()
      const statsArray = [members.response, users.response, transactions.response, revenue.response].map((item) => ({
        ...item,
        iconComponent: iconMap[item.icon] || <FiPieChart className='w-6 h-6 text-gray-500' />, // Fallback icon nếu key không tồn tại
        bgColor: 'bg-[#EE7A7A]-100',
        description: 'vs. last 30 days',
        formattedValue: formatNumber(item.total)
      }))

      setStatistics(statsArray)
    }

    fetchData()
  }, [])

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      width: '100%'
    },
    labels: membershipPlanStats.map((plan) => plan.name),
    colors: membershipPlanStats.map((plan) => plan.bgColor),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%'
          }
        }
      }
    ]
  }

  const totalRevenueData = {
    series: totalRevenue.map((item) => ({
      name: item.year,
      data: item.totalRevenueByMonth
    })),
    options: {
      chart: {
        type: 'line',
        height: 300
      },
      stroke: {
        width: 2
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        title: {
          text: 'Revenue ($)'
        }
      },
      legend: {
        position: 'top'
      },
      colors: totalRevenue.map((item) => item.bgColor)
    }
  }

  const totalNewMembersData = {
    series: [
      {
        name: 'New Members',
        data:
          timeframe === 'month'
            ? [200, 300, 250, 150, 180, 220, 300, 350, 400, 450, 500, 550]
            : [50, 60, 55, 40, 35, 70, 60, 80, 75, 100, 120, 130]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 300
      },
      xaxis: {
        categories:
          timeframe === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      },
      yaxis: {
        title: {
          text: 'New Members'
        }
      },
      legend: {
        position: 'top'
      }
    }
  }

  const chartSeries = membershipPlanStats?.length
    ? membershipPlanStats.map((plan) => plan.users)
    : [{ name: 'No Data', data: [] }]

  return (
    <div className='flex-1 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Dashboard Overview</h1>
          <button
            className={`flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FiDownload className='w-5 h-5 text-[#EE7A7A] mr-2' />
            <span className='text-[#EE7A7A] font-semibold'>Report</span>
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statistics.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}
            >
              <div className='flex items-start justify-between'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-800 mt-2'>
                    {stat.formattedValue} {stat.title === 'Total Revenue' ? '$' : ''}
                  </h2>
                  <p className='text-gray-600 text-sm font-medium'>{stat.title}</p>
                  <div className='flex items-center mt-2'>
                    {stat.isIncrease ? (
                      <FiArrowUp className='w-4 h-4 text-green-500 mr-1' />
                    ) : (
                      <FiArrowDown className='w-4 h-4 text-red-500 mr-1' />
                    )}
                    <span className='text-gray-500 text-sm font-medium'>{stat.percentageChange} %</span>
                    <span className='text-gray-500 text-xs ml-1'>{stat.description}</span>
                  </div>
                </div>
                <div className='p-3 rounded-full bg-[#EE7A7A]/15'>{stat.iconComponent}</div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Membership Plans</h2>
            <div className='flex justify-center'>
              <ApexCharts options={chartOptions} series={chartSeries} type='donut' height={300} />
            </div>
            {membershipPlanStats.map((plan, index) => (
              <div key={index} className='relative pt-1'>
                <div className='flex mb-2 items-center justify-between'>
                  <div>
                    <span
                      style={{ backgroundColor: `${plan.bgColor}` }}
                      className='text-white text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200'
                    >
                      {plan.name}
                    </span>
                  </div>
                  <div className='text-right'>
                    <span className='text-black-600 text-xs font-semibold inline-block'>{plan.users} users</span>
                  </div>
                </div>
                <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200'>
                  <div
                    style={{ width: `${(plan.users / 5000) * 100}%`, backgroundColor: `${plan.bgColor}` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${plan.color}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Recent Transactions</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Plan
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center'>
                          {transaction.imageUrl ? (
                            <img
                              className='w-8 h-8 rounded-full mr-2'
                              src={transaction.imageUrl}
                              alt={transaction.fullName}
                            />
                          ) : (
                            <Avatar
                              size={32}
                              style={{
                                backgroundColor: generateRandomColor(),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px'
                              }}
                            >
                              {getInitials(transaction.fullName)}
                            </Avatar>
                          )}
                          {transaction.fullName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {transaction.membershipPlan}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatNumber(transaction.price)} $
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'In Progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDateTime(transaction.buyDate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className='px-6 py-4 text-center text-sm text-gray-500'>
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={5} className='text-center py-4'>
                      <div ref={lastTransactionRef} className='flex justify-center items-center h-10'>
                        {hasMore && isFetching && (
                          <div className='w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Total Revenue</h2>
            <ApexCharts options={totalRevenueData.options} series={totalRevenueData.series} type='line' height={300} />
          </div>
          <div className='bg-white rounded-lg shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Total New Members</h2>
            <div className='mb-4'>
              <label className='text-sm font-semibold text-gray-700'>Choose Timeframe:</label>
              <select
                className='ml-2 p-2 rounded border border-gray-300'
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value='month'>Monthly</option>
                <option value='week'>Weekly</option>
              </select>
            </div>
            <ApexCharts
              options={totalNewMembersData.options}
              series={totalNewMembersData.series}
              type='bar'
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
