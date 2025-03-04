import ChatBot from '@/components/Chat'
import Footer from '@components/Footer'
import Header from '@components/Header'
import { Outlet } from 'react-router-dom'

export default function MainLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>
        {children}
        <ChatBot />
      </main>
      <Footer />
    </div>
  )
}
