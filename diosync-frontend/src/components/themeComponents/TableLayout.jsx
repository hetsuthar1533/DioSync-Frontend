/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import Button from '../core/formComponents/Button'
import { MdOutlineShoppingCart } from 'react-icons/md'
import ReactPaginate from 'react-paginate'
import { RiEdit2Line } from 'react-icons/ri'
import { TbTrash } from 'react-icons/tb'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import ToolTip from '../core/ToolTip'
import { DELETE, LOGINUSER, UPDATE, userRoles, VIEW } from '../../constants/roleConstants'
import noImage from '../../assets/images/noImg.png'
import { PiArrowLeftBold, PiArrowRightBold } from 'react-icons/pi'
import Paragraph from '../core/typography/Paragraph'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { SlEye, SlLock } from 'react-icons/sl'
import { userTypeSelector } from '../../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import NoDataFoundImg from '../../assets/images/no_data_found.svg'
import TableDropDownWrap from '../core/TableDropDownWrap'
import { FaSpinner } from 'react-icons/fa'
import inactiveicon from '../../assets/images/icon_inactive.svg'
import activeicon from '../../assets/images/icon_active.svg'
import { siteLoaderSelector } from '../../redux/slices/siteLoaderSlice'
import { capitalizeFunction } from '../../utils/commonHelper'
import { Link, useLocation } from 'react-router-dom'
import { paths } from '../../routes/path'
import { toast } from 'react-toastify'
import { ToastShow } from '../../redux/slices/toastSlice'


function TableLayout(props) {
  const {
    tableHeader,
    currentItems,
    isLoginButton,
    isEdit,
    isDelete,
    handlePageClick,
    handleOptions,
    pageCount,
    itemOffset,
    itemsPerPage,
    handleSorting,
    handleDeleteApiCall,
    statusManage,
    isView,
    loader,
    handleBulk,
    selectedIds,
    handleAllBulk,
    isBulkActive,
    totalCount,
    handleAddtoCart,
    handleInventoryQuantity,
    deleteItem,
    handleDeleteItems,
    handleUpdateItems
  } = props

  const location = useLocation()
  const dispatch = useDispatch()
  const [sortOrders, setSortOrders] = useState({})
  const [itemData, setItemData] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [cartType, setCartType] = useState('full_unit')
  const [case_size, setCase_size] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedIdForCart, setselectedIdForCart] = useState(0)
  const [cartData, setCartData] = useState({
    selectedItem: '',
    cartQuantity: 0,
  })

  //Inventory edit
  const dropdownInventoryRef = useRef(null)
  const [isOpenInventory, setIsOpenInventory] = useState(false)
  const [inventoryDropdownPosition, setInventoryDropdownPosition] = useState({ top: 0, left: 0 })
  const [editInventoryCount, setEditInventoryCount] = useState(0)
  const [selectedIdForQty, setSelectedIdForQty] = useState(0)
  const [InventoryData, setInventoryData] = useState({
    selectedItem: '',
    Quantity: 0,
  })

  const dropdownRef = useRef(null)
  const userType = useSelector(userTypeSelector)
  const startEntry = itemOffset + 1
  const endEntry = Math.min(itemOffset + itemsPerPage, totalCount)

  const Increment = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const Decrement = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1)
    }
  }

  const IncrementInventoryCart = () => {
    setEditInventoryCount((prevCount) => {
      const incrementValue = prevCount % 1 === 0 ? 1 : 0.01 // Add 1 for integers, 0.01 for decimals
      return parseFloat((prevCount + incrementValue).toFixed(2)) // Round to 2 decimal places
    })
  }

  const DecrementInventoryCart = () => {
    setEditInventoryCount((prevCount) => {
      if (prevCount > 0) {
        const decrementValue = prevCount % 1 === 0 ? 1 : 0.01 // Subtract 1 for integers, 0.01 for decimals
        const newValue = prevCount - decrementValue
        return newValue > 0 ? parseFloat(newValue.toFixed(2)) : 0 // Prevent negatives
      }
      return 0
    })
  }

  useEffect(() => {
    setCartData({ cartQuantity: count, selectedItem: selectedIdForCart })
  }, [count, selectedIdForCart])

  useEffect(() => {
    setInventoryData({ Quantity: editInventoryCount, selectedItem: selectedIdForQty })
  }, [editInventoryCount, selectedIdForQty])

  const dropdownHeights = {
    cart: 200, // Height of the cart dropdown
    editQuantity: 200,
    delete: 240, // Height of the delete dropdown
  }

  const handleSortTable = (item) => {
    const currentOrder = sortOrders[item] || false
    handleSorting(item, !currentOrder)
    setSortOrders({ ...sortOrders, [item]: !currentOrder })
  }

  const toggleDropdown = (event, dropdown, dataKey) => {
    const { clientX, clientY } = event
    const windowHeight = window.innerHeight
    const dropdownHeight = dropdownHeights[dropdown] || 0 // Assuming a fixed height for the dropdown, you might want to calculate this dynamically
    const direction = clientY + dropdownHeight > windowHeight ? 'up' : 'down'
    const top = direction === 'down' ? clientY + 20 : clientY - dropdownHeight

    setDropdownPosition({ top, left: clientX, direction })
    setIsOpen((prevDropdown) => (prevDropdown === dropdown ? null : dropdown))
    setCount(0)
    setselectedIdForCart(0)
  }

  const toggleInventoryDropdown = (event, dropdown, dataKey) => {
    const { clientX, clientY } = event
    const windowHeight = window.innerHeight
    const dropdownHeight = dropdownHeights[dropdown] || 0 // Assuming a fixed height for the dropdown, you might want to calculate this dynamically
    const direction = clientY + dropdownHeight > windowHeight ? 'up' : 'down'
    const top = direction === 'down' ? clientY + 20 : clientY - dropdownHeight

    setInventoryDropdownPosition({ top, left: clientX, direction })
    setIsOpenInventory((prevDropdown) => (prevDropdown === dropdown ? null : dropdown))
    setEditInventoryCount(0)
    setSelectedIdForQty(0)
  }

  const closeInventoryDropdown = () => {
    setIsOpenInventory(null) // Change to null to close the dropdown
  }

  const closeDropdown = () => {
    setIsOpen(null) // Change to null to close the dropdown
  }
  const handleClickInventoryOutside = (event) => {
    if (dropdownInventoryRef.current && !dropdownInventoryRef.current.contains(event.target)) {
      closeInventoryDropdown()
    }
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }

  const handleDeleteDropdown = (e, dataKey, item) => {
    setItemData(item)
    toggleDropdown(e, 'delete', dataKey)
  }
  function editItem(id){
    console.log("id",id);
    
  }
//  async function deleteItem(id){
//     dispatch(showLoader())
//     const response = await DeleteItems(id)
//     if (response?.status === 204) {
//       deleteToastFun('Item deleted successfully', 'success')
//       handleCloseDeleteModal()
      
//         getItemsData()
    
//     } else {
//       alert('Something went wrong', 'error')
//     }
//     dispatch(hideLoader())
    
//   }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (isOpenInventory) {
      document.addEventListener('mousedown', handleClickInventoryOutside)
    } else {
      document.removeEventListener('mousedown', handleClickInventoryOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickInventoryOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenInventory])

  const handeldataShow = (dataItem, item) => {
    // Handle nested data
    if (item.value.includes('.')) {
      const keys = item.value.split('.')
      let nestedValue = dataItem
      for (const key of keys) {
        nestedValue = nestedValue[key]
        if (nestedValue === undefined) break
      }
      return nestedValue || '--'
    } else {
      // Handle flat data
      if (!dataItem?.[item.value]) {
        return '--'
      }
      return dataItem?.[item.value]
    }
  }

  return (
    <div className=''>
      <div className=' rounded-lg border border-medium-grey overflow-x-auto overflow-y-visible'>
       
          <table className='border-collapse h-[500px] w-[1150px] border border-green-800 table-auto'>
      
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
        ItemId
       </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
        ItemName
      </th>
      <th  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
        BrandName
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
        Category
      </th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
  SubCategory
</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
  UnitSize
</th><th className="px-3\ py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Active</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
  Actions
</th>

            
{currentItems?.length > 0 && (
  <tbody className="bg-white divide-y divide-gray-200">
    {currentItems.map((dataItem, dataKey) => {
      console.log("hello from current items map");
      console.log(currentItems);
      console.log(dataItem);

      return (
        <tr key={dataKey}>

          <td className="whitespace-nowrap">{dataItem.itemId}</td>
          <td className="px-6 py-4 whitespace-nowrap">{dataItem.ItemName}</td>
          <td className="px-6 py-4 whitespace-nowrap">{dataItem.BrandName}</td>
          <td className="px-6 py-4 whitespace-nowrap"> {dataItem.Category}</td>
           <td className="px-6 py-4 whitespace-nowrap">{dataItem.Subcategory}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {dataItem.unitSize}
          </td>
       {   dataItem.status==true?(<span className='px-1 my-4'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<path fill="#c8e6c9" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#4caf50" d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"></path>
</svg></span>):(<span className='px-1 my-4'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<linearGradient id="wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f44f5a"></stop><stop offset=".443" stop-color="#ee3d4a"></stop><stop offset="1" stop-color="#e52030"></stop></linearGradient><path fill="url(#wRKXFJsqHCxLE9yyOYHkza_fYgQxDaH069W_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414	c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414	c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414	c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414	C33.973,30.997,33.973,29.731,33.192,28.95z" opacity=".05"></path><path d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414	c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414	c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414	c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414	C33.425,30.839,33.425,29.889,32.839,29.303z" opacity=".07"></path><path fill="#fff" d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485	c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142	C30.047,15.124,30.681,15.124,31.071,15.515z"></path><path fill="#fff" d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343	c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142	C32.876,30.047,32.876,30.681,32.485,31.071z"></path>
</svg></span>)}
          <td>
          <button  className="text-indigo-600 hover:text-indigo-900" onClick={()=>handleOptions(UPDATE,dataItem)}>Edit</button>
                    <button className="ml-2 text-red-600 hover:text-red-900" onClick={()=>  handleDeleteItems(dataItem.itemId)}>Delete</button>
               
          </td>
        </tr>
      );
    })}
  </tbody>
)}</table>
        {loader && (
          <span className='flex items-center justify-center h-full'>
            <FaSpinner size={30} className='animate-spin text-gray-500' />
          </span>
        )}
      </div>

      
    </div>
  )
}

export default TableLayout
