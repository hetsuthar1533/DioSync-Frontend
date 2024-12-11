import { useSelector } from 'react-redux'
import LoaderGIF from '../../../assets/images/beer_anim_fast.gif' // Adjust the path as needed
// import { ThreeCircles } from 'react-loader-spinner'
import { siteLoaderSelector } from '../../../redux/slices/siteLoaderSlice'

const SiteLoader = () => {
  const loaderState = useSelector(siteLoaderSelector)

  return (
    <>
      {/* {loaderState && (
        <div className='bg-site-black flex items-center justify-center h-screen'>
          <img src={LoaderGIF} alt='Loading...' />
        </div>
      )} */}
      {loaderState && (
        <div className='flex justify-center items-center gap-2 py-4 fixed w-full h-full z-50'>
          <span
            className='animate-bounce h-4 w-4 rounded-full bg-dark-grey duration-0'
            style={{ animationDelay: '0s' }}
          ></span>
          <span className='animate-bounce h-4 w-4 rounded-full bg-dark-grey' style={{ animationDelay: '0.1s' }}></span>
          <span className='animate-bounce h-4 w-4 rounded-full bg-dark-grey' style={{ animationDelay: '0.2s' }}></span>
        </div>
      )}
    </>
  )
}

export default SiteLoader
