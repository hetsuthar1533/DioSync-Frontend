import { ErrorMessage, useField } from 'formik'
import { components } from 'react-select'

import CreatableSelect from 'react-select/creatable'
import { isValidArray } from '../../../utils/commonHelper'

const ValueContainer = (props) => {
  const { children } = props
  return (
    <components.ValueContainer className='reactSelectCSWrapper' {...props}>
      {children}
    </components.ValueContainer>
  )
}

const customStyles = {
  control: () => ({
    borderRadius: '10px',
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    border: '1px solid rgb(224, 224, 224)',
    padding: '9px 8px',
    fontFamily: 'BeVietnamProR, sans-serif',
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: 'flex',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    alignSelf: 'flex-start',
    padding: 0,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#777777',
    borderRadius: '5px',
    cursor: 'pointer',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#ffffff',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#ffffff',
    backgroundColor: '',
    '&:hover': {
      backgroundColor: '#777777',
      color: '#ffffff',
    },
    padding: '0 2px',
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 100,
    backgroundColor: '#F8F8F8',
  }),
  menuList: (provided) => ({
    ...provided,
    color: '#ffffff',
    backgroundColor: '#F8F8F8',
    borderRadius: '10px',
  }),
  input: (provided) => ({
    ...provided,
    color: '#000000',
    backgroundColor: 'transparent',
    // position: 'absolute',
    margin: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000000',
    fontSize: ' 16px',
    lineHeight: ' 24px',
    fontWeight: ' 400',
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: 'left',
    backgroundColor: state.isFocused ? '#d6e1dc' : '#F8F8F8',
    color: '#000000',
    padding: '10px 12px',
    borderBottom: '1px solid rgb(0 0 0 / 0.05)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#d6e1dc',
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    backgroundColor: '#d6e1dc',
    '&:hover': {
      backgroundColor: '#d6e1dc',
    },
  }),
  placeholder: (provided) => {
    return {
      ...provided,
      position: 'absolute',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '100%',
      color: 'rgb(0 0 0 / 60%)',
      fontSize: ' 14px',
      lineHeight: ' 24px',
      fontWeight: ' 600',
      letterSpacing: ' 0.05em',
      fontFamily: 'Open Sans", sans-serif',
    }
  },
}

const CreatableCustomSelect = (props) => {
  const {
    onChange,
    placeholder,
    options,
    isCompulsory,
    isMulti = false,
    label,
    labelClass,
    Margin,
    Width,
    disabled,
    setOption,
    isClearable,
    typeAdd,
    ...rest
  } = props

  const [field, , helpers] = useField(rest)

  const handleChange = (option) => {
    helpers.setValue(isMulti ? option.map((item) => item.value) : option.value)
  }

  const getValue = () => {
    return isMulti
      ? Array.isArray(field?.value)
        ? options?.filter((option) => field?.value?.indexOf(option.value) >= 0)
        : []
      : options?.find((option) => option?.value === field.value)
  }

  const components = { ValueContainer }

  const handleCreate = async (inputValue) => {
    const found = options.some((e) => e.value === inputValue)
    if (!found && inputValue !== '' && inputValue !== null && inputValue !== undefined) {
      const newValue = { value: inputValue, label: inputValue } // inputValue.toLowerCase()
      if (isMulti) {
        const selectedOptions = getValue() || []
        const newArray =
          isValidArray(selectedOptions) && Array.isArray(selectedOptions)
            ? selectedOptions.map((item) => item.value)
            : []

        newArray.push(inputValue) // inputValue.toLowerCase()
        setOption([...options, newValue], helpers.setValue(newArray))
      }
      if (!isMulti) {
        setOption([...options, newValue], helpers.setValue(newValue.value))
      }
    }
  }

  const isValidNewOption = (inputValue) => {
    // If typeAdd is Number, check if inputValue is a valid number
    if (typeAdd === 'Number') {
      return !isNaN(Number(inputValue))
    }
    // Otherwise, accept any non-empty string
    return inputValue.trim().length > 0
  }

  return (
    <div className='custom-select-wrap'>
      <CreatableSelect
        isClearable={isClearable ? isClearable : false}
        value={getValue() ? getValue() : null}
        components={components}
        onChange={(e) => {
          onChange ? onChange(e) : handleChange(e)
          return true
        }}
        name={rest.name}
        placeholder={placeholder ? placeholder : ''}
        options={options}
        isMulti={isMulti}
        styles={customStyles}
        isDisabled={disabled}
        onCreateOption={handleCreate}
        isValidNewOption={isValidNewOption}
        classNamePrefix='react-select'
      />

      <ErrorMessage name={rest.name}>
        {(msg) => <div className='text-site-red text-sm font-medium'>{msg}</div>}
      </ErrorMessage>
    </div>
  )
}

export default CreatableCustomSelect
