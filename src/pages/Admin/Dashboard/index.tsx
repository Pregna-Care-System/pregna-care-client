import { useState } from 'react'
import ApexCharts from 'react-apexcharts'
import { FiArrowDown, FiArrowUp, FiDollarSign, FiDownload, FiPieChart, FiUserCheck, FiUsers } from 'react-icons/fi'
import { ApexOptions } from 'apexcharts'
import AdminSidebar from '@/components/Sidebar/AdminSidebar'

const membershipPlans = [
  { name: 'Basic', users: 3000, color: 'bg-[#EE7A7A]/100' },
  { name: 'Premium', users: 4500, color: 'bg-green-500' },
  { name: 'Enterprise', users: 2000, color: 'bg-blue-500' }
]

const recentTransactions = [
  {
    user: 'John Doe',
    plan: 'Premium',
    amount: '$50',
    status: 'Completed',
    date: '2025-01-15 10:30',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    user: 'Jane Smith',
    plan: 'Basic',
    amount: '$20',
    status: 'Pending',
    date: '2025-01-16 14:00',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    user: 'Mark Wilson',
    plan: 'Enterprise',
    amount: '$100',
    status: 'Completed',
    date: '2025-01-17 09:15',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
]

const cards = [
  {
    title: 'Total Members',
    value: '12,543',
    increase: '+15.3%',
    icon: <FiUserCheck className='w-6 h-6 text-[#EE7A7A]' />,
    bgColor: 'bg-white-50',
    description: 'vs. last 30 days',
    isIncrease: true
  },
  {
    title: 'Total Users',
    value: '45,233',
    increase: '+8.2%',
    icon: <FiUsers className='w-6 h-6 text-[#EE7A7A]' />,
    bgColor: 'bg-white-50',
    description: 'vs. last 30 days',
    isIncrease: true
  },
  {
    title: 'Total Transactions',
    value: '23,847',
    increase: '-12.4%',
    icon: <FiPieChart className='w-6 h-6 text-[#EE7A7A]' />,
    bgColor: 'bg-white-50',
    description: 'vs. last 30 days',
    isIncrease: false
  },
  {
    title: 'Total Revenue',
    value: '$154,239',
    increase: '-16.8%',
    icon: <FiDollarSign className='w-6 h-6 text-[#EE7A7A]' />,
    bgColor: 'bg-[#EE7A7A]-100',
    description: 'vs. last 30 days',
    isIncrease: false
  }
]

const AdminDashboard = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [timeframe, setTimeframe] = useState('month')

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      width: '100%'
    },
    labels: membershipPlans.map((plan) => plan.name),
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
    series: [
      {
        name: '2024',
        data: [1200, 1300, 1400, 1100, 1600, 1800, 1700, 1900, 2000, 2100, 2300, 2400]
      },
      {
        name: '2025',
        data: [1500, 1600, 1700, 1200, 1800, 2000, 2100, 2200, 2400, 2500, 2600, 2700]
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yaxis: {
        title: {
          text: 'Revenue ($)'
        }
      },
      legend: {
        position: 'top'
      }
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

  const chartSeries = membershipPlans.map((plan) => plan.users)

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-64 bg-gray-800 text-white p-6'>
        <AdminSidebar />
      </div>

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
            {cards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}
              >
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-800 mt-2'>{card.value}</h2>
                    <p className='text-gray-600 text-sm font-medium'>{card.title}</p>
                    <div className='flex items-center mt-2'>
                      {card.isIncrease ? (
                        <FiArrowUp className='w-4 h-4 text-green-500 mr-1' />
                      ) : (
                        <FiArrowDown className='w-4 h-4 text-red-500 mr-1' />
                      )}
                      <span className='text-gray-500 text-sm font-medium'>{card.increase}</span>
                      <span className='text-gray-500 text-xs ml-1'>{card.description}</span>
                    </div>
                  </div>
                  <div className='p-3 rounded-full bg-[#EE7A7A]/15'>{card.icon}</div>
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
              {membershipPlans.map((plan, index) => (
                <div key={index} className='relative pt-1'>
                  <div className='flex mb-2 items-center justify-between'>
                    <div>
                      <span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200'>
                        {plan.name}
                      </span>
                    </div>
                    <div className='text-right'>
                      <span className='text-xs font-semibold inline-block text-blue-600'>{plan.users} users</span>
                    </div>
                  </div>
                  <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200'>
                    <div
                      style={{ width: `${(plan.users / 5000) * 100}%` }}
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
                    {recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center'>
                          <img className='w-8 h-8 rounded-full mr-2' src={transaction.avatar} alt={transaction.user} />
                          {transaction.user}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{transaction.plan}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{transaction.amount}</td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white rounded-lg shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>Total Revenue</h2>
              <ApexCharts
                options={totalRevenueData.options}
                series={totalRevenueData.series}
                type='line'
                height={300}
              />
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
    </div>
  )
}

export default AdminDashboard
