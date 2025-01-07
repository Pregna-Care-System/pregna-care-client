type Props = {
  children: React.ReactNode
}
export default function NoHeaderLayout({ children }: Props) {
  return (
    <div className='flex flex-col items-center w-full h-full'>
      <div className='flex w-full h-full'>{children}</div>
    </div>
  )
}
