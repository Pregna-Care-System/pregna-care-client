import type React from 'react'
import { Modal, Descriptions, Button, Empty, Tag, Divider } from 'antd'
import { FaEdit, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaClock } from 'react-icons/fa'
import styles from './styles.module.css'

interface WeekDetailModalProps {
  isOpen: boolean
  onClose: () => void
  weekData: any[]
  weekNumber: number
  onEdit: (week: number) => void
  status: 'success' | 'process' | 'waiting'
}

const WeekDetailModal: React.FC<WeekDetailModalProps> = ({ isOpen, onClose, weekData, weekNumber, onEdit, status }) => {
  const primaryColor = 'rgb(255, 107, 129)'

  const getStatusTag = (status: 'success' | 'process' | 'waiting') => {
    switch (status) {
      case 'success':
        return (
          <Tag color='success' className={styles.statusTag}>
            <FaCheckCircle size={12} style={{ marginRight: '4px' }} /> Completed
          </Tag>
        )
      case 'process':
        return (
          <Tag color={primaryColor} className={styles.statusTag} style={{ color: 'white', background: primaryColor }}>
            <FaHourglassHalf size={12} style={{ marginRight: '4px' }} /> Current Week
          </Tag>
        )
      default:
        return (
          <Tag className={styles.statusTag}>
            <FaClock size={12} style={{ marginRight: '4px' }} /> Upcoming
          </Tag>
        )
    }
  }

  console.log(weekData)

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      className={styles.weekDetailModal}
      title={
        <div className='flex justify-between'>
          <div className={styles.modalHeader}>
            <FaFileAlt size={18} color={primaryColor} style={{ marginRight: '8px' }} />
            Week {weekNumber} Details
          </div>
          {getStatusTag(status)}
        </div>
      }
    >
      <Divider className={styles.modalDivider} />

      <div className={styles.modalContent}>
        {weekData.length > 0 ? (
          <Descriptions bordered column={1} className={styles.descriptions} labelStyle={{ fontWeight: 500 }}>
            {weekData.map((data) => (
              <Descriptions.Item key={data.id} label={data.name}>
                {data.value} {data.unit}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <Empty
            description='No data recorded for this week'
            className={styles.noData}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      <div className={styles.modalFooter}>
        <Button onClick={onClose}>Close</Button>
        {status === 'process' && (
          <Button
            type='primary'
            icon={<FaEdit size={14} style={{ marginRight: '6px' }} />}
            onClick={() => onEdit(weekNumber)}
            style={{ background: primaryColor, borderColor: primaryColor }}
          >
            Edit Records
          </Button>
        )}
      </div>
    </Modal>
  )
}

export default WeekDetailModal
