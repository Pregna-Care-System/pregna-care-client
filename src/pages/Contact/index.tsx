export default function ContactPage() {
  return (
    <div className='min-h-screen py-8 px-4 sm:px-6 lg:px-8' style={{ background: 'linear-gradient(to bottom,#f0f8ff, #f6e3e1 )' }}>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-center text-4xl font-light text-white mb-8'>Contact Us</h1>
        <div className='bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 p-8'>
            <h2 className='text-3xl font-bold text-[#69275c] mb-4 text-center'>Contact Us</h2>
            <form className='space-y-6'>
              <div>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter Your Name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#69275c]'
                />
              </div>
              <div>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter Your Email'
                  className='w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#69275c]'
                />
              </div>
              <div>
                <textarea
                  name='message'
                  placeholder='Your Message'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#69275c]'
                  rows='4'
                ></textarea>
              </div>
              <div>
                <button
                  type='submit'
                  className='w-full bg-[#c7a2c0] text-white py-2 px-4 rounded-full hover:bg-[#97359c] transition duration-300'
                >
                  Send <i className='fas fa-paper-plane ml-2'></i>
                </button>
              </div>
            </form>
          </div>
          <div className='w-full md:w-1/2 bg-[#f0f4f8] flex items-center justify-center p-8'>
            <img src='https://res.cloudinary.com/dgzn2ix8w/image/upload/v1739897900/pregnaCare/mrwhqkhxyo60rnpafzti.png' alt='Contact' className='max-w-full h-auto' />
          </div>
        </div>
      </div>
    </div>
  )
}
