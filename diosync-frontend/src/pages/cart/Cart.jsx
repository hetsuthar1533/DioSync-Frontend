import React, { useState } from 'react'
import Stepper from '../../components/themeComponents/Stepper'
import { VscTools } from 'react-icons/vsc'
import { GrCart } from 'react-icons/gr'
import CartBuilder from './CartBuilder'
import YourCart from './YourCart'
import ReviewCart from './ReviewCart'

function Cart() {
  const [showButton, setShowButton] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const handleChangeCurrentStep = (step) => {
    setCurrentStep(step)
  }

  const CartCheck = ({ color }) => {
    return (
      <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M7.49992 16.6667C7.49992 17.5917 6.75825 18.3334 5.83325 18.3334C4.90825 18.3334 4.16659 17.5917 4.16659 16.6667C4.16659 15.7417 4.91658 15 5.83325 15C6.74992 15 7.49992 15.75 7.49992 16.6667ZM14.1666 15C13.2499 15 12.4999 15.75 12.4999 16.6667C12.4999 17.5834 13.2499 18.3334 14.1666 18.3334C15.0833 18.3334 15.8333 17.5917 15.8333 16.6667C15.8333 15.7417 15.0916 15 14.1666 15ZM5.98109 12.3412C5.97292 12.309 5.97899 12.2754 5.98705 12.2432C5.99559 12.209 6.00854 12.1761 6.02556 12.1453L6.46466 11.35C6.64065 11.0313 6.97598 10.8334 7.34008 10.8334H12.9583C13.5833 10.8334 14.1333 10.4917 14.4166 9.97503L17.2335 4.85931C17.4543 4.45828 17.3085 3.95418 16.9076 3.73303C16.5073 3.51214 16.0037 3.65694 15.7818 4.05675L15.2583 5.00003L13.2435 8.64996C13.0675 8.96876 12.7322 9.1667 12.368 9.1667H7.35797C7.20531 9.1667 7.06615 9.07925 6.99992 8.9417L5.13325 5.00003L4.34159 3.33337L3.82833 2.24134C3.66349 1.89061 3.31084 1.6667 2.92331 1.6667H1.66659C1.20635 1.6667 0.833252 2.0398 0.833252 2.50003C0.833252 2.96027 1.20635 3.33337 1.66659 3.33337H1.86744C2.25371 3.33337 2.60543 3.55582 2.77096 3.90482L5.28047 9.1957C5.41826 9.48621 5.40796 9.82525 5.25279 10.1069L4.37492 11.7C4.24159 11.9334 4.16659 12.2084 4.16659 12.5C4.16659 13.425 4.91658 14.1667 5.83325 14.1667H14.9999C15.4602 14.1667 15.8333 13.7936 15.8333 13.3334C15.8333 12.8731 15.4602 12.5 14.9999 12.5H6.18325C6.09082 12.5 6.00445 12.4333 5.98109 12.3412ZM14.4117 2.8873C14.7368 2.5627 14.738 2.03622 14.4143 1.71022C14.0891 1.38277 13.5598 1.38183 13.2335 1.70813L10.4987 4.44293C10.1082 4.83345 9.475 4.83345 9.08448 4.44293L8.22075 3.5792C7.89628 3.25473 7.37022 3.25473 7.04575 3.5792C6.72128 3.90367 6.72128 4.42973 7.04575 4.7542L9.08504 6.79349C9.47535 7.1838 10.1081 7.18405 10.4987 6.79406L14.4117 2.8873Z'
          fill={color}
        />
      </svg>
    )
  }
  const steps = [
    { icon: <VscTools />, name: 'Cart builder', content: <CartBuilder /> },
    { icon: <GrCart />, name: 'Your cart', content: <YourCart setShowButton={setShowButton} /> },
    {
      icon: (isCurrent) => <CartCheck color={isCurrent ? '#fff' : '#000'} />,
      name: 'Review cart',
      content: (
        <ReviewCart
          setShowButton={setShowButton}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
          handleChangeCurrentStep={handleChangeCurrentStep}
        />
      ),
    },
  ]
  return (
    <>
      <Stepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleChangeCurrentStep={handleChangeCurrentStep}
        steps={steps}
        showButton={showButton}
        setShowButton={setShowButton}
        orientation='horizontal'
        horizontalPosition={'self-center'}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    </>
  )
}

export default Cart
