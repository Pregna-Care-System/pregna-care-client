import type { CSSProperties } from 'react'
import React, { useEffect, useState } from 'react'
import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, message, theme } from 'antd'
import { style } from '@/theme'
import { getAllFAQCategories } from '@/services/faqService'

const CollapseFAQ: React.FC = () => {
  const { token } = theme.useToken()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getAllFAQCategories()
        setCategories(Array.isArray(categoriesResponse.data.response) ? categoriesResponse.data.response : [])
      } catch (error) {}
    }
    fetchData()
  }, [])

  const panelStyle: CSSProperties = {
    marginBottom: 24,
    background: style.COLORS.WHITE,
    borderRadius: token.borderRadiusLG,
    border: `4px solid ${style.COLORS.RED.RED_1}`
  }

  // Convert FAQ categories to Collapse items
  const items = categories.flatMap((category) =>
    category.items.map((faq) => ({
      key: faq.id,
      label: faq.question,
      children: <p>{faq.answer}</p>,
      style: panelStyle
    }))
  )

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ color: style.COLORS.RED.RED_1 }} />
      )}
      expandIconPosition='end'
      style={{ background: token.colorBgContainer }}
      items={items}
    />
  )
}

export default CollapseFAQ
