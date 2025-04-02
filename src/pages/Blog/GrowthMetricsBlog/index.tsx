import React from 'react'
import { Typography, Card, Image, Space, Divider } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const GrowthMetricsBlog = () => {
  return (
    <div className='growth-metrics-blog' style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div>
          <Title level={1} style={{ marginBottom: '16px' }}>
            Understanding Fetal Growth Standards: A Comprehensive Guide
          </Title>
          <Text type='secondary' style={{ fontSize: '16px' }}>
            Published on {new Date().toLocaleDateString()} • 10 min read
          </Text>
        </div>

        <Image
          src='/images/fetal-growth-banner.jpg'
          alt='Fetal Growth Development'
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
          preview={false}
        />

        <Card style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
              <Title level={4} style={{ margin: 0 }}>
                Key Takeaways
              </Title>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Understanding fetal growth standards helps monitor your baby's development</li>
              <li>Growth metrics are based on WHO standards and INTERGROWTH-21st Project</li>
              <li>Regular monitoring can help identify potential health concerns early</li>
              <li>Always consult with healthcare professionals for interpretation</li>
            </ul>
          </Space>
        </Card>

        <Paragraph>
          As expectant parents, understanding your baby's growth and development is crucial. Fetal growth standards
          provide valuable insights into your baby's health and development throughout pregnancy. In this comprehensive
          guide, we'll explore the importance of growth metrics, how they're measured, and what they mean for your
          pregnancy journey.
        </Paragraph>

        <Title level={2}>What Are Fetal Growth Standards?</Title>
        <Paragraph>
          Fetal growth standards are reference ranges that help healthcare providers assess whether a baby is growing
          appropriately for its gestational age. These standards are based on extensive research and data collection
          from healthy pregnancies worldwide.
        </Paragraph>

        <Card
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            margin: '24px 0'
          }}
        >
          <Title level={3}>The Science Behind Growth Standards</Title>
          <Paragraph>
            The World Health Organization (WHO) Fetal Growth Standards were developed through the INTERGROWTH-21st
            Project, one of the most comprehensive international studies on fetal growth. This project involved:
          </Paragraph>
          <ul>
            <li>Multi-center research across different countries</li>
            <li>Diverse ethnic populations</li>
            <li>Standardized measurement protocols</li>
            <li>Regular updates based on latest medical research</li>
          </ul>
        </Card>

        <Title level={2}>Key Growth Metrics Explained</Title>
        <Paragraph>Several important measurements are used to track fetal growth:</Paragraph>

        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Card>
            <Title level={4}>Head Circumference</Title>
            <Paragraph>
              Measures the distance around the baby's head. This metric helps assess brain development and can indicate
              potential neurological concerns.
            </Paragraph>
          </Card>

          <Card>
            <Title level={4}>Abdominal Circumference</Title>
            <Paragraph>
              Measures the distance around the baby's abdomen. This is particularly important for assessing nutritional
              status and growth.
            </Paragraph>
          </Card>

          <Card>
            <Title level={4}>Femur Length</Title>
            <Paragraph>
              Measures the length of the thigh bone. This helps assess overall skeletal growth and development.
            </Paragraph>
          </Card>
        </Space>

        <Divider />

        <Title level={2}>Understanding Growth Charts</Title>
        <Paragraph>
          Growth charts display the expected range of measurements for each gestational age. The charts typically show:
        </Paragraph>
        <ul>
          <li>Average measurements (50th percentile)</li>
          <li>Upper and lower limits of normal growth</li>
          <li>Week-by-week progression</li>
        </ul>

        <Card style={{ backgroundColor: '#f8f9fa', border: 'none', marginTop: '24px' }}>
          <Title level={3}>Important Considerations</Title>
          <Paragraph>While growth standards are valuable tools, it's important to remember:</Paragraph>
          <ul>
            <li>Every pregnancy is unique</li>
            <li>Measurements can vary based on multiple factors</li>
            <li>Regular monitoring is more important than individual measurements</li>
            <li>Always consult with your healthcare provider for interpretation</li>
          </ul>
        </Card>

        <Divider />

        <Title level={2}>When to Be Concerned</Title>
        <Paragraph>
          While variations in growth are normal, certain patterns might warrant additional attention:
        </Paragraph>
        <ul>
          <li>Consistent measurements below the 10th percentile</li>
          <li>Sudden changes in growth patterns</li>
          <li>Disproportionate growth between different measurements</li>
        </ul>

        <Card style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', marginTop: '24px' }}>
          <Title level={3}>Next Steps</Title>
          <Paragraph>If you have concerns about your baby's growth:</Paragraph>
          <ol>
            <li>Discuss measurements with your healthcare provider</li>
            <li>Consider additional monitoring if recommended</li>
            <li>Maintain regular prenatal care appointments</li>
            <li>Follow any specific guidance from your medical team</li>
          </ol>
        </Card>

        <Divider />

        <Paragraph style={{ fontStyle: 'italic' }}>
          Remember: This information is for educational purposes only and should not replace professional medical
          advice. Always consult with your healthcare provider for personalized guidance regarding your pregnancy.
        </Paragraph>
      </Space>
    </div>
  )
}

export default GrowthMetricsBlog
