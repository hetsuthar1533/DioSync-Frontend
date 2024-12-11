import React, { useEffect, useState } from 'react'
import SearchFilter from '../../../components/core/formComponents/SearchFilter'
import WhiteCard from '../../../components/themeComponents/WhiteCard'
import TableLayout from '../../../components/themeComponents/TableLayout'
import { GetAuditLogs } from '../../../services/auditLogsService'
import moment from 'moment/moment'

function AuditLogsSettings() {
  const itemsPerPage = 10
  const [itemOffset, setItemOffset] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [currentItems, setCurrentItems] = useState([])
  const [orderby, setOrderby] = useState('')
  const [order, setOrder] = useState(true)
  const [searchItem, setSearchItem] = useState('')

  const tableHeader = [
    {
      key: 'Email',
      value: 'action_by.email',
      sorting: true,
      sortkey: 'action_by__email',
      clickable: false,
    },
    {
      key: 'Message',
      value: 'message',
      sorting: true,
      sortkey: 'message',
      clickable: false,
    },
    {
      key: 'Last Changes',
      value: 'last_changed',
      sorting: false,
      clickable: false,
      cell: ({ last_changed }) => {
        return <>{moment.utc(last_changed).local().format('lll')}</>
      },
    },
  ]

  useEffect(() => {
    const debunce = setTimeout(() => {
      getAuditLogsData()
    }, 300)
    return () => {
      clearTimeout(debunce)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem, orderby, order, itemOffset, itemsPerPage])

  useEffect(() => {
    setItemOffset(0)
  }, [searchItem])

  const getAuditLogsData = async () => {
    const orderVal = order ? '' : '-'
    let queryString = `?page=${itemOffset / itemsPerPage + 1}`
    if (orderby) {
      queryString += `&ordering=${orderVal}${orderby}`
    }
    if (searchItem) {
      queryString += `&search=${searchItem}`
    }
    const response = await GetAuditLogs(queryString)

    const results = response?.data?.results || []
    const count = response?.data?.count || 0
    setTotalCount(count)
    setCurrentItems(results)
    setPageCount(Math.ceil(count / itemsPerPage))
  }

  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage
    setItemOffset(newOffset)
  }

  const handleSorting = (data, order) => {
    setOrderby(data)
    setOrder(order)
  }
  return (
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
            isView={false}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            itemOffset={itemOffset}
            itemsPerPage={itemsPerPage}
            handleSorting={handleSorting}
          />
        </div>
      </div>
    </WhiteCard>
  )
}

export default AuditLogsSettings
