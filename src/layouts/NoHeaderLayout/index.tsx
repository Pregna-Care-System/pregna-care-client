type NoHeaderLayoutProps = {
  children: React.ReactNode
}
export default function NoHeaderLayout({ children }: NoHeaderLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col ' style={{ background: 'linear-gradient(to bottom, #f0f8ff, #f6e3e1)' }}>
      <main className='flex-grow'>{children}</main>
    </div>
  )
}
