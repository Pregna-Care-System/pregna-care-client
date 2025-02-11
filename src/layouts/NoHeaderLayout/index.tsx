type NoHeaderLayoutProps = {
  children: React.ReactNode
}
export default function NoHeaderLayout({ children }: NoHeaderLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-grow'>{children}</main>
    </div>
  )
}
