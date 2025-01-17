import { useState } from 'react'
import { MailOutlined } from '@ant-design/icons'

const ConfirmEmail = () => {
  const [isResending, setIsResending] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleResendEmail = () => {
    setIsResending(true)
    setShowSuccess(false)

    setTimeout(() => {
      setIsResending(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className='flex justify-center w-lvw h-lvh bg-gradient-to-br from-blue-50 to-purple-50 p-4'>
      <main className='flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-300'>
          <div className='text-center'>
            <div className='mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center'>
              <MailOutlined className='text-3xl text-blue-600' />
            </div>
            <h1 className='mt-6 text-3xl font-extrabold text-gray-900'>Email Confirmation</h1>
            <p className='mt-4 text-lg text-gray-600'>
              We have sent a confirmation email to your inbox. Please click the link in the email to verify your
              account.
            </p>
          </div>

          <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6'>
            <div className='flex items-center'>
              <div className='ml-3'>
                <p className='text-sm text-yellow-700'>
                  Haven't received the email? Please check your spam folder. The email should arrive within a few
                  minutes.
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6'>
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isResending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#E76A6A] hover:bg-[#d65c5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E76A6A]'
              }`}
            >
              {isResending ? 'Sending...' : 'Resend Confirmation Email'}
            </button>
            {showSuccess && (
              <p className='mt-2 text-sm text-green-600 text-center'>
                Confirmation email has been resent successfully!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ConfirmEmail
