import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'

export const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select {...rest} value={value} onChange={onchange} className='font-sm leading-[21px] font-semibold bg-transparent'>
    {getCountries().map((country) => (
      <option key={country} value={`+${getCountryCallingCode(country)}`}>
        +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
)
