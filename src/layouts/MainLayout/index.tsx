import Footer from '@components/Footer'
import Header from '@components/Header'
type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  )
}
