import Footer from '@components/Footer'
import Header from '@components/Header'
import { jwtDecode } from 'jwt-decode'
type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  const token = localStorage.getItem('accessToken')
  const user = token ? jwtDecode(token) : null
  const isAdmin = user?.role === 'Admin'
  return (
    <div className='min-h-screen flex flex-col'>
      {!isAdmin && <Header />}
      <main className='flex-grow'>{children}</main>
      {!isAdmin && <Footer />}
    </div>
  )
}
