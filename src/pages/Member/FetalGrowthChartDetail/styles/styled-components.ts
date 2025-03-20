import styled from 'styled-components'
import { Alert, Card, Layout } from 'antd'

// Layout components
export const StyledLayout = styled(Layout)`
  .header-section {
    border-radius: 1rem;
    color: black;

    .content {
      background: none;
    }

    .breadcrumb {
      margin-bottom: 1rem;

      a,
      span {
        font-weight: 500; /* Added font-weight for better visibility */
        transition: color 0.3s;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .title {
      color: black;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .stat-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 107, 129, 0.1);
    height: 100%;
    display: flex;
    align-items: center;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 107, 129, 0.12);
    }

    .ant-card-body {
      padding: 1.5rem;
    }

    .stat-title {
      color: #666;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      svg {
        color: #ff6b81;
      }
    }

    .stat-value {
      color: #ff6b81;
      margin: 0;
      font-size: 2rem;
      line-height: 1.2;
    }

    .stat-subtitle {
      color: #888;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .chart-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 107, 129, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(255, 107, 129, 0.12);
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  @media (max-width: 768px) {
    .header-section {
      margin: -1rem -1rem 1rem;
      padding: 1.5rem;
    }
  }
`

// Alert components
export const CriticalAlert = styled(Alert)`
  animation: pulse 2s infinite;
  border: none;
  background: linear-gradient(to right, #fff1f2, #ffe4e6);

  .ant-alert-message {
    color: #e11d48;
  }

  .ant-alert-description {
    color: #be123c;
  }

  .alert-action {
    background: rgba(225, 29, 72, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    color: #e11d48;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      background: rgba(225, 29, 72, 0.2);
      transform: translateX(4px);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.2);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(225, 29, 72, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(225, 29, 72, 0);
    }
  }
`

// Card components
export const StatCard = styled(Card)`
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 107, 129, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 129, 0.12);
  }
`

export const ChartCard = styled(Card)`
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 107, 129, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 129, 0.12);
  }
`

export const CalendarCard = styled(Card)`
  .custom-calendar {
    .ant-picker-calendar-date-content {
      height: auto;
    }
  }
`
