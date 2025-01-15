import { Spin } from 'antd'
import styled from 'styled-components'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`

export default function Loading() {
  return (
    <LoadingWrapper>
      <Spin size='large' />
    </LoadingWrapper>
  )
}
