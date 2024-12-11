import { ErrorMessage, useField } from 'formik'
import Select, { components } from 'react-select'

const ValueContainer = (props) => {
  const { children } = props
  return (
    <components.ValueContainer className='reactSelectCSWrapper' {...props}>
      {children}
    </components.ValueContainer>
  )
}

export const CustomSelect = (props) => {
  const {
    isSearchable,
    onChange,
    inputClass,
    placeholder,
    options,
    isCompulsory,
    isMulti = false,
    label,
    labelClass,
    Margin,
    Width,
    disabled,
    variant,
    selectedValue,
    className,
    isClearable = false,
    autoFocus = false,
    ...rest
  } = props

  const [field, , helpers] = useField(rest)

  const handleChange = (option) => {
    helpers.setValue(isMulti ? option.map((item) => item.value) : option.value)
  }

  const getValue = () => {
    return selectedValue
      ? options?.find((option) => option?.value === selectedValue)
      : isMulti
        ? Array.isArray(field?.value)
          ? options?.filter((option) => field?.value?.indexOf(option.value) >= 0)
          : null
        : options?.find((option) => option?.value === field.value)
  }
  const components = { ValueContainer }

  return (
    <div>
      <Select
        isSearchable={isSearchable}
        components={components}
        onChange={(e) => {
          onChange ? onChange(e) : handleChange(e)
        }}
        name={rest.name}
        value={getValue() ? getValue() : null}
        placeholder={placeholder ? placeholder : ''}
        options={options}
        autoFocus={autoFocus}
        isMulti={isMulti}
        isClearable={isClearable}
        menuPlacement='auto'
        isDisabled={disabled}
        classNamePrefix='react-select'
      />

      <ErrorMessage name={rest.name}>
        {(msg) => <div className='text-site-red text-sm font-medium'>{msg}</div>}
      </ErrorMessage>
    </div>
  )
}

export default CustomSelect
