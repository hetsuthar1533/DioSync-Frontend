import { avgDeliveryDaysOptions } from '../constants/commonConstants'
import { ToastShow } from '../redux/slices/toastSlice'
import { store } from '../redux/store'
import moment from 'moment/moment'

export const checkValueInt = (value) => {
  let flag = false
  if (!isNaN(parseInt(value)) || value?.toString() === '') {
    flag = true
  }
  return flag
}

export const deleteToastFun = (message, type) => {
  store.dispatch(ToastShow({ message: message, type: type }))
}

export const capitalizeFunction = (str) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)
}

export const isValidArray = (data) => data && Array.isArray(data) && data.length > 0

export function getLabelByValue(value) {
  const option = avgDeliveryDaysOptions.find((option) => option.value === value)
  return option ? option.label : null
}

// export const CalculateTotalPrice = (qty, unitsofmeasure, totalPricePerLiter) => {
//   let qtyInLiters = 0
//   // if (totalPricePerLiter !== 'Nan' || totalPricePerLiter !== 'undefined' || totalPricePerLiter !== null) {
//   switch (unitsofmeasure?.toLowerCase()) {
//     case 'ml':
//       qtyInLiters = qty / 1000 // Convert milliliters to liters
//       break
//     case 'gm':
//       qtyInLiters = qty / 1000 // Convert milliliters to liters
//       break
//     case 'cl':
//       qtyInLiters = qty / 100 // Convert centiliters to liters
//       break
//     case 'kg':
//       qtyInLiters = qty
//       break
//     case 'litre':
//       qtyInLiters = qty // Already in liters
//       break
//     case 'liter':
//       qtyInLiters = qty // Already in liters or kg
//       break
//     default:
//       break
//   }
//   // } else {
//   //   qtyInLiters = 0
//   // }

//   // considered the 1 ml 2 litre or 3 kg.
//   const costPrice = qtyInLiters * totalPricePerLiter
//   return costPrice.toFixed(2)
// }

export const CalculateTotalPrice = (
  item_value_into_gm,
  item_cost_price,
  qty,
  selectedUnitOfMeasure,
  unitMeasureData,
) => {
  console.log(
    item_value_into_gm,
    item_cost_price,
    qty,
    selectedUnitOfMeasure,
    unitMeasureData,
    'item_value_into_gm,item_cost_price,qty,selectedUnitOfMeasure,unitMeasureData,',
  )
  if (item_value_into_gm && item_cost_price && qty && selectedUnitOfMeasure && unitMeasureData) {
    let selected_unit_measure_into_gm = unitMeasureData?.find(
      (unit) => unit?.id === Number(selectedUnitOfMeasure),
    )?.value_into_gm
    const totalCostPrice = (qty * selected_unit_measure_into_gm * item_cost_price) / item_value_into_gm
    console.log(totalCostPrice, 'totalCostPrice')
    return totalCostPrice.toFixed(2)
  }
}

export const calculateGrandTotal = (items, mist_cost) => {
  const total = items.reduce((total, item) => {
    return parseFloat(total) + parseFloat(item.totalCostPrice)
  }, 0)
  return (parseFloat(mist_cost) + total).toFixed(2)
}

export const handleAlertUpdateIconType = (update_type) => {
  let iconType = ''
  switch (update_type) {
    case 'FULL INVENTORY':
      iconType = 'warning'
      break
    case 'QUICK INVENTORY':
      iconType = 'warning'
      break
    case 'BREAKAGE & LOSS':
      iconType = 'warning'
      break
    case 'TRANSFER':
      iconType = 'primary'
      break
    case 'ORDER':
      iconType = 'primary'
      break
    case 'VERIANCE':
      iconType = 'success'
      break
    case 'COST_CHANGE':
      iconType = 'warning'
      break
    default:
      break
  }
  return iconType
}
export const NotificationIconType = (update_type) => {
  let iconType = ''
  switch (update_type) {
    case 'WARNING':
      iconType = 'warning'
      break
    case 'ERROR':
      iconType = 'danger'
      break
    case 'MESSAGE':
      iconType = 'sucess'
      break
    default:
      iconType = 'info'
      break
  }
  return iconType
}

export const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return null // or a default fallback image
  }
}

export const checkValidImageSize = (value, size) => {
  if (value.size <= size * 1000000) return true
  else return false
}
export const imageSize = 30
export const videoExtension = ['.mp4', '.mov', '.wvm', '.mkv', '.webm', '.avi', '.flv', 'avchd']
export const imageExtension = ['.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp', '.png', '.svg', '.webp']
export const otherSize = 5
export const videoSize = 500

export function formatNumber(value) {
  if (value >= 1e15) {
    return (value / 1e15).toFixed(1) + 'Q' // Quadrillion
  } else if (value >= 1e12) {
    return (value / 1e12).toFixed(1) + 'T' // Trillion
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B' // Billion
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M' // Million
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K' // Thousand
  } else {
    return value.toString() // Less than a thousand
  }
}

export const beautifyNumber = (number) => {
  try {
    return Number(number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } catch (error) {
    console.error('Format exception:', error)
    return '0'
  }
}

export const timeDifference = (utcDate) => {
  // Parse the ISO 8601 UTC date
  const createdDate = moment.utc(utcDate)
  // Convert to local time
  const localDate = createdDate.local()

  const today = moment() // Current time in local timezone
  let diff = today.diff(localDate, 'years')
  let message = 'years ago'

  if (diff === 0) {
    diff = today.diff(localDate, 'months')
    message = 'months ago'
    if (diff === 0) {
      diff = today.diff(localDate, 'weeks')
      message = 'weeks ago'
      if (diff === 0) {
        diff = today.diff(localDate, 'days')
        message = 'days ago'
        if (diff === 0) {
          diff = today.diff(localDate, 'hours')
          message = 'hours ago'
          if (diff === 0) {
            diff = today.diff(localDate, 'minutes')
            message = 'minutes ago'
          }
        }
      }
    }
  }

  if (diff === 0) {
    return 'just now'
  }
  return `${diff} ${message}`
}
