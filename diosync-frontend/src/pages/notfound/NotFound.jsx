import React from 'react'
import notFound from '../../assets/images/liquor-404.png'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/core/formComponents/Button'

function NotFound() {
  let navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  return (
    <div className='h-screen flex items-center justify-center bg-[#F6F8FA]'>
      <div className='container mx-auto '>
        <div className='grid grid-cols-12'>
          <div className='card p-6 text-center lg:col-span-6 lg:col-start-4 md:col-span-8 md:col-start-3 col-span-12'>
            <img src={notFound} alt='404' className='md:mb-10 mb-5 max-w-[800px] mx-auto' />
            <h1 className='font-bold mb-4 text-4xl sm:text-5xl'>Page Not Found</h1>
            <p className='mb-8'>
              Seems like nothing was found at this location. Try something else or you can go back to the homepage
              following the button below!
            </p>
            <Button primary onClick={handleGoBack}>
              Back To Web
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
