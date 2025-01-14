//--Library
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
//--Components
import CardService from '@/components/Card/CardService'
//--Redux
import { selectMembershipPlans } from '@/store/modules/global/selector'
//--Utils
import ROUTES from '@/utils/config/routes'
import CardReason from '@/components/Card/CardReason'

const Background = styled.div`
  height: 930px;
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
  const membershipPlans = useSelector(selectMembershipPlans)

  const renderMembershipPlans = membershipPlans.map((item, index) => {
    return <CardService key={index} title={item.title} description={item.description} width='100%' height='100%' />
  })

  return (
    <div className='bg-white'>
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
      <div className='container mx-auto p-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-5xl font-bold'>See our services for member</h2>
          <p className='py-4 text-xl text-wrap font-light'>
            Make your data invisible by generating unlimited identities. The next-level in privacy protection for online
            and travel.
          </p>
        </div>
        <div className='flex justify-center'>{renderMembershipPlans}</div>
      </div>
      <div className='bg-red-50 rounded-2xl'>
        <div className='container mx-auto p-8'>
          <div className='flex flex-col items-center'>
            <h2 className='text-5xl font-bold'>Why choose us</h2>
            <p className='py-4 text-xl text-wrap font-light'>
              We are the only service that provides all 3 services as a packaged service.
            </p>
          </div>
          <div className='flex flex-col gap-4'>
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
            <CardReason
              title='Pregnancy Tracking'
              description='Helps monitor fetal development, schedule checkups, track maternal health, provide tips, and ensure a healthy pregnancy'
            />
          </div>
        </div>
      </div>
      <div className='container mx-auto p-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-5xl font-bold'>
            Our <span className='text-red-400'>Pricing</span> Package
          </h2>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  )
}
