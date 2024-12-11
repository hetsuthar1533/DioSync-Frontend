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
        <table className='w-full text-sm leading-[22px] font-semibold text-center whitespace-nowrap'>
          <thead className='text-sm leading-[22px] font-semibold text-site-black bg-light-grey'>
            <tr className='border-b border-medium-grey'>
              {isBulkActive && (
                <td key='bulk' className='p-4 text-base font-light text-gray-500 whitespace-nowrap'>
                  <input
                    className='w-4 h-4'
                    type='checkbox'
                    id={`checkbox-`}
                    onChange={() => handleAllBulk(currentItems)}
                    checked={selectedIds?.length > 0 && selectedIds?.length === currentItems?.length}
                  />
                </td>
              )}
              {tableHeader?.map((item, key) => (
                <th
                  scope='col'
                  className={`p-4 ${key === 0 || item?.textLeft ? 'text-left' : 'text-center'}`}
                  key={key}
                >
                  {item.sorting ? (
                    <span className={`flex items-center ${key === 0 ? 'justify-start' : 'justify-center'}  gap-1 `}>
                      {capitalizeFunction(item.key)}{' '}
                      {sortOrders[item.sortkey] ? (
                        <TiArrowSortedUp
                          className='cursor-pointer text-base mr-1'
                          onClick={() => handleSortTable(item.sortkey)}
                        />
                      ) : (
                        <TiArrowSortedDown
                          className='cursor-pointer text-base mr-1'
                          onClick={() => handleSortTable(item.sortkey)}
                        />
                      )}
                    </span>
                  ) : (
                    capitalizeFunction(item.key)
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems?.length > 0 &&
              currentItems?.map((dataItem, dataKey) => (
                <tr className={`bg-white ${dataKey !== currentItems?.length - 1 ? 'border-b' : ''}`} key={dataKey}>
                  {isBulkActive && (
                    <td key={dataKey} className='p-4 text-base font-light text-gray-500 whitespace-nowrap'>
                      <input
                        type='checkbox'
                        className='w-4 h-4'
                        id={`checkbox-${dataKey}`}
                        onChange={() => handleBulk(dataItem)}
                        checked={selectedIds?.includes(dataItem?.id)}
                      />
                    </td>
                  )}
                  {tableHeader?.map((item, key) => (
                    <td
                      className={`p-4 relative ${key === 0 || item?.textLeft ? 'text-left' : 'text-center'}`}
                      onClick={item?.clickable ? () => handleOptions('', dataItem) : null}
                      key={key}
                      ref={dropdownRef}
                    >
                      {item?.key === 'Status' || item?.key === 'Replied' ? (
                        <>
                          {dataItem?.[item?.value] === true ? (
                            <span className='flex justify-center'>
                              <img src={activeicon} alt='' />
                            </span>
                          ) : (
                            <span className='flex justify-center'>
                              <img src={inactiveicon} alt='' />
                            </span>
                          )}
                        </>
                      ) : item.key === 'Actions' ? (
                        <div
                          className={`flex items-center justify-center ${item.permissions ? 'md:gap-4 gap-3' : 'gap-1'}`}
                        >
                          {item.permissions && (
                            <span
                              className={`${dataItem?.permissionsType === 1 ? 'bg-site-green/10 text-site-green' : 'bg-primary-blue/10 text-primary-blue'} text-nowrap rounded-lg py-[6px] px-3 text-sm leading-[21px] font-semibold`}
                            >
                              {dataItem?.permissionsType === 1 ? 'Assign permissions' : 'Manager permissions'}
                            </span>
                          )}
                          {isLoginButton && (
                            <ToolTip tooltip={'Login'} position={'top center'}>
                              <button>
                                <SlLock
                                  className='text-dark-grey hover:text-site-red'
                                  fontSize={'20px'}
                                  onClick={() => handleOptions(LOGINUSER, dataItem)}
                                />
                              </button>
                            </ToolTip>
                          )}
                          {isView && (
                            <ToolTip tooltip={'View'} position={'top center'}>
                              <button>
                                <SlEye
                                  className='text-dark-grey hover:text-primary-blue'
                                  fontSize={'20px'}
                                  onClick={() => handleOptions(VIEW, dataItem)}
                                />
                              </button>
                            </ToolTip>
                          )}
                          {isEdit && (
                            <ToolTip tooltip={'Edit'} position={'top center'}>
                              <button>
                                <RiEdit2Line
                                  className='text-dark-grey hover:text-site-yellow'
                                  fontSize={'20px'}
                                  onClick={() => handleOptions(UPDATE, dataItem)}
                                />
                              </button>
                            </ToolTip>
                          )}
                          {isDelete && (
                            <ToolTip tooltip={'Delete'} position={'top right'}>
                              <button>
                                <TbTrash
                                  className='text-dark-grey hover:text-site-red'
                                  fontSize={'20px'}
                                  onClick={(e) =>
                                    location?.pathname?.includes(paths?.owner?.items) ||
                                    location?.pathname?.includes(paths?.manager?.items)
                                      ? handleDeleteDropdown(e, dataKey, dataItem)
                                      : handleOptions(DELETE, dataItem)
                                  }
                                />
                              </button>
                            </ToolTip>
                          )}
                        </div>
                      ) : item.key === 'S.No.' ? (
                        dataKey + 1
                      ) : item.key === 'Cart' ? (
                        <div>
                          <Button
                            onlyIcon
                            {...(isOpen === 'cart'
                              ? {
                                  primary: dataItem?.item_id === selectedIdForCart ? true : false,
                                }
                              : { lightBlueBg: true })}
                            onClick={(e) => {
                              toggleDropdown(e, 'cart', dataKey)
                              if (dataItem?.case_size !== null) {
                                setCartType('case_unit')
                                setCase_size(dataItem?.case_size?.size)
                              } else {
                                setCartType('full_unit')
                              }
                              if (location?.pathname?.includes(paths?.owner?.inventory || paths?.manager?.inventory)) {
                                setselectedIdForCart(dataItem?.item_id)
                              } else {
                                setselectedIdForCart(dataItem?.id)
                              }
                            }}
                          >
                            <MdOutlineShoppingCart fontSize={'20px'} />
                          </Button>
                        </div>
                      ) : item.key === 'Edit Quantity' ? (
                        <div>
                          <Button
                            onlyIcon
                            {...(isOpenInventory === 'editQuantity'
                              ? {
                                  primary: dataItem?.item_id === selectedIdForQty ? true : false,
                                }
                              : { lightBlueBg: true })}
                            onClick={(e) => {
                              toggleInventoryDropdown(e, 'editQuantity', dataKey)
                              if (location?.pathname?.includes(paths?.owner?.inventory || paths?.manager?.inventory)) {
                                setSelectedIdForQty(dataItem?.item_id)
                                setEditInventoryCount(dataItem?.quantity)
                              }
                            }}
                          >
                            <RiEdit2Line className='text-dark-grey' fontSize={'20px'} />
                          </Button>
                        </div>
                      ) : item.nameWithSublabel ? (
                        <div className='flex items-center gap-5'>
                          <img
                            src={dataItem?.[item?.productImg] ? dataItem?.[item?.productImg] : noImage}
                            alt='product-img'
                            className='w-10 h-10 flex-shrink-0'
                          />
                          <p>
                            <span className='block'>{dataItem?.[item?.value]}</span>
                            <span className='block text-xs text-dark-grey'>{dataItem?.[item?.subValue]}</span>
                          </p>
                        </div>
                      ) : item.orderStatus ? (
                        <span
                          className={`${dataItem?.orderType === 1 ? 'bg-site-green/10 text-site-green' : 'bg-[#FF00001A]/10 text-site-red'} text-nowrap rounded-lg py-[6px] px-3 text-sm leading-[21px] font-semibold`}
                        >
                          {dataItem?.[item?.value]}
                        </span>
                      ) : item.cell ? (
                        item.cell(dataItem)
                      ) : (
                        handeldataShow(dataItem, item)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            <td colSpan={tableHeader?.length}>
              {currentItems?.length === 0 && (
                <>
                  <div className='flex flex-col items-center justify-center w-full py-4'>
                    <img src={NoDataFoundImg} alt='no-data-found' />
                    <Paragraph text16 className={'font-semibold'}>
                      Data not found..!!
                    </Paragraph>
                  </div>
                </>
              )}
            </td>
          </tbody>
        </table>
        {loader && (
          <span className='flex items-center justify-center h-full'>
            <FaSpinner size={30} className='animate-spin text-gray-500' />
          </span>
        )}
      </div>

      {isOpen === 'delete' && (
        <TableDropDownWrap open={isOpen} onClose={closeDropdown} dropdownRef={dropdownRef}>
          <div
            className='origin-top-right p-4 absolute rounded-lg rounded-se-none shadow-cardShadow bg-white z-10 sm:min-w-[370px] min-w-[300px] max-[575px]:!left-[inherit] max-[575px]:!right-3 '
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left - 320,
            }}
            ref={dropdownRef}
          >
            <Paragraph text18 className={'font-semibold pb-3'}>
              Delete Confirmation
            </Paragraph>
            <div className='border-t border-b border-medium-grey py-3 mb-3'>
              <div className='bg-site-red/10 rounded-[4px] px-4 py-2 flex items-center gap-[10px]'>
                <div className='bg-white w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center'>
                  <img src={itemData?.item_image ? itemData?.item_image : noImage} alt='product-img' />
                </div>
                <div>
                  <Paragraph text14 className={'font-normal'}>
                    {itemData?.item_name ? itemData?.item_name : '--'}
                  </Paragraph>
                  {itemData?.tare_or_weight && (
                    <Paragraph text14 className={'font-normal'}>
                      {`${itemData?.tare_or_weight ?? '-'} ${itemData?.tare_or_weight_unit_of_measure?.measure_name ?? '-'}`}
                    </Paragraph>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-center justify-end gap-4'>
              <Button secondary onClick={closeDropdown}>
                Cancel
              </Button>
              <button
                className='rounded-lg bg-site-red text-white flex items-center justify-center px-4 py-2'
                onClick={() => {
                  handleDeleteApiCall(itemData)
                  setIsOpen(false)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </TableDropDownWrap>
      )}

      {isOpen === 'cart' && (
        <TableDropDownWrap open={isOpen} onClose={closeDropdown} dropdownRef={dropdownRef}>
          <div
            className='p-4 absolute rounded-lg border border-primary-blue bg-white z-10 min-w-[155px]'
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left - 120,
            }}
          >
            <Paragraph text18 className={'font-semibold pb-3 text-center'}>
              {cartType === 'case_unit' ? `case of ${case_size}` : 'Full Unit'}
            </Paragraph>
            <div className='flex items-center justify-between rounded-[10px] border border-medium-grey p-1 gap-4 mb-3'>
              <button
                className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                onClick={Decrement}
              >
                <FiMinus />
              </button>
              <span className='text-site-black  leading-[30px] font-bold'>{count}</span>
              <button
                className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                onClick={Increment}
              >
                <FiPlus />
              </button>
            </div>
            <Button
              primary
              onClick={() => {
                handleAddtoCart(cartData, cartType)
                setIsOpen(false)
              }}
            >
              Add To Cart
            </Button>
          </div>
        </TableDropDownWrap>
      )}
      {isOpenInventory === 'editQuantity' && (
        <TableDropDownWrap open={isOpenInventory} onClose={closeInventoryDropdown} dropdownRef={dropdownInventoryRef}>
          <div
            className='p-4 absolute rounded-lg border border-primary-blue bg-white z-10 min-w-[155px]'
            style={{
              top: inventoryDropdownPosition.top,
              left: inventoryDropdownPosition.left - 120,
            }}
          >
            <Paragraph text18 className={'font-semibold pb-3 text-center'}>
              Edit Inventory
            </Paragraph>
            <div className='flex items-center justify-between rounded-[10px] border border-medium-grey p-1 gap-4 mb-3'>
              <button
                className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                onClick={DecrementInventoryCart}
              >
                <FiMinus />
              </button>
              <span className='text-site-black leading-[30px] font-bold'>
                <input
                  type='number'
                  value={editInventoryCount}
                  onChange={(e) => {
                    if (e.target.value >= 0) {
                      setEditInventoryCount(e.target.value)
                    }
                  }}
                  className='text-site-black bg-transparent border-none w-[40px]  text-center'
                />
              </span>
              <button
                className='w-8 h-8 rounded-[4px] bg-light-grey text-site-black flex items-center justify-center'
                onClick={IncrementInventoryCart}
              >
                <FiPlus />
              </button>
            </div>
            <div className='flex justify-center'>
              <Button
                primary
                onClick={() => {
                  if (
                    editInventoryCount === '' ||
                    isNaN(Number(editInventoryCount)) ||
                    Number(editInventoryCount) < 0
                  ) {
                    dispatch(
                      ToastShow({
                        message: 'Please add a valid quantity',
                        type: 'error',
                      }),
                    )
                  } else {
                    handleInventoryQuantity(InventoryData)
                    setIsOpenInventory(false)
                  }
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </TableDropDownWrap>
      )}

      <div className='flex md:flex-nowrap flex-wrap justify-between gap-3 items-center mt-6 mb-0'>
        {totalCount > 1 && (
          <div className='entries'>{`Showing ${startEntry} to ${endEntry} of ${totalCount} entries`}</div>
        )}
        {pageCount > 1 && (
          <ReactPaginate
            breakLabel='...'
            nextLabel={<PiArrowRightBold fontSize={'18px'} />}
            onPageChange={handlePageClick}
            pageCount={pageCount}
            previousLabel={<PiArrowLeftBold fontSize={'18px'} />}
            renderOnZeroPageCount={null}
            containerClassName={'pagination'}
            pageClassName={'pageClass'}
            forcePage={itemOffset / itemsPerPage}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            activeClassName='active'
          />
        )}
      </div>
    </div>
  )
}

export default TableLayout
