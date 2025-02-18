import type React from 'react'
import { Card, Tabs } from 'antd'
import Chart from 'react-apexcharts'

const { TabPane } = Tabs

interface MeasurementData {
  week: number
  [key: string]: number
}

interface MeasurementChartsProps {
  data: MeasurementData[]
  measurements: {
    key: string
    name: string
    color: string
    standardKey: string
    standardColor: string
  }[]
}

const MeasurementCharts: React.FC<MeasurementChartsProps> = ({ data, measurements }) => {
  return (
    <Card title='Fetal Measurements' className='shadow-md'>
      <Tabs defaultActiveKey='0'>
        {measurements.map((measurement, index) => (
          <TabPane tab={measurement.name} key={index.toString()}>
            <Chart
              options={{
                chart: {
                  type: 'line',
                  height: 350
                },
                title: {
                  text: measurement.name,
                  align: 'left'
                },
                xaxis: {
                  categories: data.map((item) => item.week),
                  title: {
                    text: 'Gestational Age (weeks)'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Measurement (cm)'
                  }
                },
                legend: {
                  position: 'top'
                },
                stroke: {
                  curve: 'smooth'
                },
                colors: [measurement.color, measurement.standardColor]
              }}
              series={[
                {
                  name: 'Actual',
                  data: data.map((item) => item[measurement.key])
                },
                {
                  name: 'Standard',
                  data: data.map((item) => item[measurement.standardKey])
                }
              ]}
              type='line'
              height={350}
            />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  )
}

export default MeasurementCharts
