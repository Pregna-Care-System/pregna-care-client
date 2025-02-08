import { Form, Radio, Steps } from 'antd'
import styled from 'styled-components'
import { style } from '@/theme/index'

export const StyledForm = styled(Form)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;

  .ant-form-item {
    margin-bottom: 1.5rem;

    &-label {
      label {
        font-weight: 600;
        color: #333;
        font-size: 1rem;
      }
    }

    &-control-input {
      .ant-input {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;

        &:hover {
          border-color: #ef4444;
        }

        &:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
      }
    }

    &-explain-error {
      color: #ef4444;
      margin-top: 0.25rem;
      font-size: 0.875rem;
    }
  }
`

export const StyledSteps = styled(Steps)`
  .ant-steps-item {
    &-icon {
      background: white;
      border-color: #e5e7eb;

      .ant-steps-icon {
        color: #9ca3af;
      }
    }

    &-title {
      font-weight: 500;
      font-size: 1rem;
    }

    &-process {
      .ant-steps-item-icon {
        background: ${style.COLORS.RED.RED_5};
        border-color: ${style.COLORS.RED.RED_5};

        .ant-steps-icon {
          color: white;
        }
      }
      .ant-steps-item-title {
        color: #ef4444;
      }
    }

    &-finish {
      .ant-steps-item-icon {
        background: ${style.COLORS.RED.RED_2};
        border-color: ${style.COLORS.RED.RED_2};

        .ant-steps-icon {
          color: white;
        }
      }

      .ant-steps-item-title {
        color: #10b981;
        &::after {
          background-color: #ef4444 !important;
        }
      }

      .ant-steps-item-tail::after {
        background-color: #10b981;
      }
    }

    @media (max-width: 640px) {
      &-title {
        font-size: 0.875rem;
      }
    }
  }
`

export const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;

  .ant-radio-wrapper {
    .ant-radio-checked {
      .ant-radio-inner {
        border-color: ${style.COLORS.RED.RED_5};
        background-color: ${style.COLORS.RED.RED_5};
      }
    }
  }
`
