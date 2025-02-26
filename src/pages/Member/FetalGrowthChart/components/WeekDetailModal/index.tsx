import React from 'react'
import { Modal, Descriptions, Button, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import styles from '../PregnancyRecordList/styles.module.css'

interface WeekDetailModalProps {
  isOpen: boolean
  onClose: () => void
  weekData: any[]
  weekNumber: number
  onEdit: (week: number) => void
  status: 'success' | 'process' | 'waiting'
}

const WeekDetailModal: React.FC<WeekDetailModalProps> = ({ isOpen, onClose, weekData, weekNumber, onEdit, status }) => {
  return (
    <Modal
      open={isOpen}
      title={
        <div className={styles.modalHeader}>
          <span>Week {weekNumber} Details</span>
          {status === 'process' && (
            <Tooltip title='Edit Record'>
              <Button type='text' icon={<EditOutlined />} onClick={() => onEdit(weekNumber)} />
            </Tooltip>
          )}
        </div>
      }
      onCancel={onClose}
      footer={null}
      width={600}
      className={styles.weekDetailModal}
    >
      <div className={styles.modalContent}>
        {weekData.length > 0 ? (
          <Descriptions bordered column={1} size='small' className={styles.descriptions}>
            {weekData.map((data: any) => (
              <Descriptions.Item key={data.id} label={data.name} labelStyle={{ width: '150px' }}>
                {data.value} {data.unit}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <div className={styles.noData}>No records available for this week</div>
        )}
      </div>
    </Modal>
  )
}

export default WeekDetailModal
