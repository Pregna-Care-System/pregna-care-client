import request from '@/utils/axiosClient'

const BASE_URL = '/Statistics'

export const getMemberStatistics = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/MemberStatistics`)
    return response.data
  } catch (error) {
    console.log('Error at API getMemberStatistics')
    throw error
  }
}

export const getUserStatistics = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/UserrStatistics`)
    return response.data
  } catch (error) {
    console.log('Error at API getUserStatistics')
    throw error
  }
}

export const getTransactionStatistics = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/TransactionStatistics`)
    return response.data
  } catch (error) {
    console.log('Error at API getTransactionStatistics')
    throw error
  }
}

export const getRevenueStatistics = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/RevenueStatistics`)
    return response.data
  } catch (error) {
    console.log('Error at API getRevenueStatistics')
    throw error
  }
}

export const fetchStatistics = async () => {
  try {
    const [members, users, transactions, revenue] = await Promise.all([
      request.get<MODEL.IResponseBase>(`${BASE_URL}/MemberStatistics`),
      request.get<MODEL.IResponseBase>(`${BASE_URL}/UserStatistics`),
      request.get<MODEL.IResponseBase>(`${BASE_URL}/TransactionStatistics`),
      request.get<MODEL.IResponseBase>(`${BASE_URL}/RevenueStatistics`)
    ])

    return {
      members: members.data,
      users: users.data,
      transactions: transactions.data,
      revenue: revenue.data
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error
  }
}

export const fetchMembershipPlanStats = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/MembershipStats`)
    return response.data
  } catch (error) {
    console.log('Error at API get MembershipStats')
    throw error
  }
}

export const fetchRecentTransactionStats = async (offset: number, limit: number) => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/RecentTransactions`, {
      params: { offset, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error at API get RecentTransactions', error)
    throw error
  }
}

export const fetchTotalRevenueStats = async () => {
  try {
    const response = await request.get<MODEL.IResponseBase>(`${BASE_URL}/Revenue`)
    return response.data
  } catch (error) {
    console.error('Error at API get Revenue', error)
    throw error
  }
}

export const fetchTotalNewMembers = async (timeFrame: 'month' | 'week' = 'month') => {
  try {
    const response = await request.get<MODEL.NewMembersAPIResponse>(
      `${BASE_URL}/TotalNewMembers?timeFrame=${timeFrame}`
    )
    return response.data
  } catch (error) {
    console.error('Error at API get TotalNewMembers', error)
    throw error
  }
}
