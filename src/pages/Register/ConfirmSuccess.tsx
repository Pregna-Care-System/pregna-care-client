import { CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const EmailConfirmationSuccessPage = () => {
  const navigate = useNavigate()
  return (
    <div className='w-lvw h-lvh bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='flex items-center justify-center w-full h-full'>
        <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
          <div className='mb-8 animate-bounce'>
            <CheckCircleOutlined className='text-green-500 text-6xl mx-auto' />
          </div>

          <h1 className='text-3xl font-bold text-gray-800 mb-4'>Email Confirmed!</h1>

          <p className='text-lg text-gray-600 mb-8'>
            Thank you for confirming your email address. Your account is now fully activated.
          </p>

          <div className='space-y-6'>
            <div className='p-4 bg-blue-50 rounded-lg'>
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>Next Steps</h2>
              <p className='text-gray-600'>
                You can now access all features of your account. Get started by logging in!
              </p>
            </div>

            <div className='space-y-4'>
              <button
                onClick={() => navigate('/login')}
                className='w-full py-3 px-4 bg-[#E76A6A] text-white font-medium rounded-lg hover:bg-[#D15A5A] transition-colors duration-200'
              >
                Log In to Your Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmationSuccessPage
