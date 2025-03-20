import React from 'react'
import PostCreationModal from '@/components/PostCreationModal'
import EnhancedFetalChart from '@/pages/Member/FetalGrowthChartDetail/Components/Charts/EnhancedFetalChart'

interface ChartShareModalProps {
  isVisible: boolean
  onCancel: () => void
  onSubmit: (postData: any) => void
  currentUser: any
  tags: any[]
  submitting: boolean
  chartData: any
}

const ChartShareModal: React.FC<ChartShareModalProps> = (props) => {
  const { isVisible, onCancel, onSubmit, currentUser, tags, submitting, chartData } = props

  // Ensure chartData is an array
  const validChartData = Array.isArray(chartData) ? chartData : []

  const handleSubmit = (postData: any) => {
    const enhancedPostData = {
      ...postData,
      type: 'community'
    }
    onSubmit(enhancedPostData)
  }

  return (
    <div>
      {validChartData.length > 0 && (
        <PostCreationModal
          isVisible={isVisible}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          currentUser={currentUser}
          tags={tags}
          submitting={submitting}
          title='Share Chart with Community'
          type='chart'
          chartData={validChartData}
        >
          <div className='mb-4 border rounded-lg p-4 bg-white'>
            <h3 className='text-lg font-medium mb-2'>Chart Preview</h3>
            <div className='chart-preview'>
              <EnhancedFetalChart fetalData={validChartData} sharing={false} />
            </div>
          </div>
        </PostCreationModal>
      )}
    </div>
  )
}

export default ChartShareModal
