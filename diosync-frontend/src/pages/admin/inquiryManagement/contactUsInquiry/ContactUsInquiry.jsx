import React, { useEffect, useState } from 'react'
import TableLayout from '../../../../components/themeComponents/TableLayout'
import WhiteCard from '../../../../components/themeComponents/WhiteCard'
import SearchFilter from '../../../../components/core/formComponents/SearchFilter'
import { GetContactusInquiries } from '../../../../services/inquiryService'
import { VIEW } from '../../../../constants/roleConstants'
import Modal from '../../../../components/core/Modal'
import ViewContactUsInquiry from './ViewContactUsInquiry'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../../../../redux/slices/siteLoaderSlice'

function ContactUsInquiry() {
  const tableHeader = [
    {
      key: "User's name",
      value: 'user_name',
      sorting: true,
      sortkey: 'user_name',
      clickable: false,
    },
    {
      key: 'Email',
      value: 'email',
      sorting: true,
      sortkey: 'email',
      clickable: false,
    },
    {
      key: 'Phone number',
      value: 'phone_number',
      sorting: true,
      sortkey: 'phone_number',
      clickable: false,
    },
    {
      key: 'Replied',
      value: 'is_replied',
      sorting: true,
      sortkey: 'is_replied',
      clickable: false,
    },
    {
      key: 'Actions',
      value: 'actions',
      sorting: false,
      clickable: false,
    },
  ]

  const dispatch = useDispatch()
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const itemsPerPage = 10
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [searchItem, setSearchItem] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  useEffect(() => {
    const debounce = setTimeout(() => {
      getContactusData()
    }, 300)

    return () => {
      clearTimeout(debounce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getContactusData = async () => {
    dispatch(showLoader())
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetContactusInquiries(queryString)
    const results = response?.data?.data?.results || []
    const count = response?.data?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
    dispatch(hideLoader())
  }

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedItem('')
  }

  const handleOptions = (optionValue, item) => {
    switch (optionValue) {
      case VIEW:
        setSelectedItem(item)
        setOpenModal(true)
        break
      default:
        break
    }
  }

  return (
    <>
      <WhiteCard>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-4'>
            <div className='flex items-center justify-start sm:flex-nowrap flex-wrap sm:gap-4 gap-3'>
              <SearchFilter
                setSearchItem={setSearchItem}
                searchItem={searchItem}
                setItemOffset={setItemOffset}
                placeholder={'Search'}
                className={'sm:w-auto w-full'}
                iconRight
                sm
              />
            </div>
          </div>
          <div className='col-span-12'>
            <TableLayout
              tableHeader={tableHeader}
              totalCount={totalCount}
              currentItems={currentItems}
              isEdit={false}
              isDelete={false}
              isView={true}
              handlePageClick={handlePageClick}
              pageCount={pageCount}
              itemOffset={itemOffset}
              itemsPerPage={itemsPerPage}
              handleSorting={handleSorting}
              handleOptions={handleOptions}
            />
          </div>
        </div>
      </WhiteCard>
      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          header
          headingText={'View Contact us'}
          width={'md:w-[700px]'}
        >
          <ViewContactUsInquiry
            handleCloseModal={handleCloseModal}
            selectedItem={selectedItem}
            getContactusData={getContactusData}
          />
        </Modal>
      )}
    </>
  )
}

export default ContactUsInquiry
