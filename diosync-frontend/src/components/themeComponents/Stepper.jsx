import React, { useState } from 'react'
import Paragraph from '../core/typography/Paragraph'
import Button from '../core/formComponents/Button'
import { HiArrowLeft } from 'react-icons/hi2'
import Modal from '../core/Modal'
import SendAllOrders from '../../pages/cart/SendAllOrders'

const Stepper = ({
  steps,
  orientation = 'horizontal',
  horizontalPosition,
  verticalPosition,
  showButton,
  setShowButton,
  setShowPopup,
  showPopup,
  currentStep,
  setCurrentStep,
  handleChangeCurrentStep,
}) => {
  // const [isOpen, setIsOpen] = useState(false)

  const isHorizontal = orientation === 'horizontal'
  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <div className={`flex ${isHorizontal ? 'flex-col' : 'flex-row'} items-start`}>
      <div
        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${horizontalPosition ? horizontalPosition : ''} items-center sm:gap-4 gap-3`}
      >
        {steps?.map((step, index) => (
          <div key={index} className='flex items-center sm:gap-3 gap-1'>
            <div className='flex items-center sm:gap-3 gap-1 md:flex-row flex-col'>
              <div
                className={`cursor-pointer flex items-center justify-center sm:w-10 sm:h-10 w-8 h-8 rounded-full 
              ${currentStep === index ? 'bg-[#083ED1] text-white' : 'bg-[#F6F6F6] text-black'}`}
                onClick={() => {
                  // for the changing the direct icon click for 0/1
                  if (showButton || index === 0 || index === 1) {
                    handleChangeCurrentStep(index)
                  }
                }}
              >
                {typeof step.icon === 'function' ? step.icon(currentStep === index) : step.icon}
              </div>
              <Paragraph
                className={`${currentStep === index ? 'text-primary-blue' : 'text-dark-grey'} font-semibold md:text-left text-center sm:text-base sm:leading-6 text-xs leading-[18px]`}
              >
                {step?.name}
              </Paragraph>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`border-dotted ${isHorizontal ? 'md:border-t-8 border-t-[6px] md:w-20 w-10' : 'md:border-l-8 border-t-[6px] md:h-20 h-10'} 
                ${currentStep > index ? 'border-[#e0e0e0]' : 'border-[#e0e0e0]'}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {steps[currentStep].content}

      <div className='mt-8 flex justify-between w-full'>
        {currentStep !== 0 && (
          <div className='flex items-center gap-3'>
            <Button
              onlyIcon
              lightBlueBg
              onClick={() => {
                setCurrentStep((prev) => Math.max(prev - 1, 0))
                setShowButton(true)
              }}
            >
              <HiArrowLeft size={20} />
            </Button>
            <Paragraph text16 className={'font-semibold'}>
              Back
            </Paragraph>
          </div>
        )}
        {currentStep === steps.length - 1
          ? showButton && (
              <Button primary onClick={() => setShowPopup(true)}>
                {'Send all orders'}
              </Button>
            )
          : showButton && (
              <Button
                className={'justify-self-end ms-auto'}
                primary
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
                disabled={currentStep === steps.length - 1}
              >
                {steps[currentStep + 1].name}
              </Button>
            )}
      </div>
      <Modal open={showPopup} header headingText={'Send All Orders'} onClose={closePopup} width={'md:w-[660px]'}>
        <SendAllOrders onClose={closePopup} handleChangeCurrentStep={handleChangeCurrentStep} />
      </Modal>
    </div>
  )
}

export default Stepper
