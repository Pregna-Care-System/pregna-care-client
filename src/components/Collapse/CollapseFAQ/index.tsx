import type { CSSProperties } from 'react'
import React from 'react'
import { CaretRightOutlined } from '@ant-design/icons'
import type { CollapseProps } from 'antd'
import { Collapse, theme } from 'antd'
import { style } from '@/theme'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: 'What is a pregnancy tracker website, and why should I use it?',
    children: <p>{text}</p>,
    style: panelStyle
  },
  {
    key: '2',
    label: 'Will the website be available on mobile?',
    children: <p>{text}</p>,
    style: panelStyle
  },
  {
    key: '3',
    label: 'Can I receive reminders and notifications for important milestones?',
    children: <p>{text}</p>,
    style: panelStyle
  },
  {
    key: '4',
    label: 'How can I connect with other moms using the website?',
    children: <p>{text}</p>,
    style: panelStyle
  },
  {
    key: '5',
    label: 'How often is the website updated, and will there be new features in the future?',
    children: <p>{text}</p>,
    style: panelStyle
  }
]

const CollapseFAQ: React.FC = () => {
  const { token } = theme.useToken()

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: style.COLORS.WHITE,
    borderRadius: token.borderRadiusLG,
    border: `4px solid ${style.COLORS.RED.RED_2}`
  }

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} style={{ color: `${style.COLORS.RED.RED_1}` }} />
      )}
      expandIconPosition={'end'}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  )
}

export default CollapseFAQ
