import ROUTES from '@/utils/config/routes'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Background = styled.div`
  height: auto;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`

const Content = styled.div`
  transform: translate(35%, 100%);
  max-width: 50rem;
  a {
    text-align: center;
    display: block;
    width: 8rem;
  }
`

export default function GuestHome() {
  return (
    <div className='flex w-lvw h-lvh bg-gray-50'>
      <Background
        style={{
          backgroundImage:
            'url(https://res.cloudinary.com/drcj6f81i/image/upload/v1736741890/PregnaCare/orwee2xgtheisvm300ht.png)'
        }}
        className='w-full'
      >
        <Content className=''>
          <h1 className='font-bold text-5xl m-0'>Crafted for optimal pregnancy tracking.</h1>
          <h5 className='mt-8 ps-1'>
            Welcome to Prega Care!, your trusted companion on the beautiful journey of pregnancy.
          </h5>
          <Link
            to={ROUTES.REGISTER}
            className='bg-white border-2 border-red-400 text-red-400 rounded py-2 px-4 mt-6 ms-1'
          >
            Get started
          </Link>
        </Content>
      </Background>
    </div>
  )
}
