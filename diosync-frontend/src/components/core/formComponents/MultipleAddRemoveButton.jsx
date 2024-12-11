import { FiMinus, FiPlus } from 'react-icons/fi'
import Button from './Button'

const MultipleAddAndRemoveButton = (props) => {
  const { index, arrayHelpers, AddOnClick, RemoveOnClick, ValuesArrayLength, maxIndex } = props

  const RemoveOnClickHandler = () => {
    arrayHelpers.remove(index)
  }

  return (
    <>
      {ValuesArrayLength - 1 === index && (maxIndex ? maxIndex - 1 !== index : true) && (
        <Button onlyIcon lightBlueBg className='' type='button' onClick={AddOnClick}>
          <FiPlus fontSize={'18px'} />
        </Button>
      )}
      {!(index === 0) && (
        <Button onlyIcon lightBlueBg type='button' onClick={RemoveOnClick ? RemoveOnClick : RemoveOnClickHandler}>
          <FiMinus fontSize={'18px'} />
        </Button>
      )}
    </>
  )
}

export default MultipleAddAndRemoveButton
