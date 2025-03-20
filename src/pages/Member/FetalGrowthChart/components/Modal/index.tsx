import type React from 'react'
import { Button, Col, Divider, Form, Input, Modal, Row } from 'antd'
import type { FormInstance } from 'antd/lib/form'
import { FaCalendarAlt, FaEdit } from 'react-icons/fa'
import styles from './styles.module.css'

interface FormItem {
  name: string
  label: string
  message?: string
  type?: string
  placeholder?: string
}

interface CreateModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  formItem: FormItem[]
  handleSubmit: (values: any) => void
  form: FormInstance
}

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, title, onClose, formItem, handleSubmit, form }) => {
  const onFinish = (values: any) => {
    handleSubmit(values)
  }

  // Determine if we should use two columns (when there are more than 4 fields)
  const useTwoColumns = formItem.length > 4
  const primaryColor = 'rgb(255, 107, 129)'

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <div className={styles.titleIcon}>
            <FaEdit size={22} color={primaryColor} />
          </div>
          <div className={styles.titleText}>{title}</div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={useTwoColumns ? 800 : 500}
      className={styles.customModal}
      destroyOnClose
    >
      <Divider className={styles.modalDivider} />

      {/* Week indicator banner */}
      <div className={styles.weekIndicator}>
        <div className={styles.weekBadge}>
          <FaCalendarAlt size={14} style={{ marginRight: '6px' }} />
          Week {form.getFieldValue('week')}
        </div>
        <div className={styles.weekDescription}>You are entering information for Week {form.getFieldValue('week')}</div>
      </div>

      <Form form={form} layout='vertical' onFinish={onFinish} className='custom-form' requiredMark={false}>
        <Row gutter={24}>
          {formItem.map((item) => (
            <Col span={useTwoColumns ? 12 : 24} key={item.name}>
              <Form.Item
                label={item.label}
                name={item.name}
                rules={[{ required: true, message: item.message || `Please input ${item.label}!` }]}
                className={styles.customFormItem}
              >
                <Input
                  placeholder={item.placeholder || `Enter ${item.label}`}
                  type={item.type || 'text'}
                  className={styles.customInput}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div className={styles.formActions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            type='primary'
            htmlType='submit'
            className={styles.submitButton}
            style={{ background: primaryColor, borderColor: primaryColor }}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
