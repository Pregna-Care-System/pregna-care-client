import Header from '../components/Header'
type Props = {
  children: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <div className='flex flex-col items-center w-full h-full'>
      <Header />
      <div className='flex w-full h-full'>{children}</div>
    </div>
  )
}
