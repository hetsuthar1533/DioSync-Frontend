import React, { useEffect, useState } from 'react'
import Button from '../components/core/formComponents/Button'
import InputType from '../components/core/formComponents/InputType'
import SelectType from '../components/core/formComponents/SelectType'
import FormLabel from '../components/core/typography/FormLabel'
import HeadingFive from '../components/core/typography/HeadingFive'
import HeadingFour from '../components/core/typography/HeadingFour'
import HeadingOne from '../components/core/typography/HeadingOne'
import HeadingSix from '../components/core/typography/HeadingSix'
import HeadingThree from '../components/core/typography/HeadingThree'
import HeadingTwo from '../components/core/typography/HeadingTwo'
import Paragraph from '../components/core/typography/Paragraph'
import Checkbox from '../components/core/formComponents/Checkbox'
import RadioButton from '../components/core/formComponents/RadioButton'
import SwitchToggle from '../components/core/formComponents/SwitchToggle'
import ReactPaginate from 'react-paginate'
import { FiDollarSign, FiPlus } from 'react-icons/fi'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { PiArrowLeftBold, PiArrowRightBold } from 'react-icons/pi'
import DashboardStatCard from '../components/themeComponents/DashboardStatCard'
import { LuClipboardList } from 'react-icons/lu'
import WhiteCard from '../components/themeComponents/WhiteCard'
import Accordion, { AccordionItem } from '../components/core/Accordion'
import TableLayout from '../components/themeComponents/TableLayout'
import Modal from '../components/core/Modal'
import { Tab, Tabs } from '../components/core/Tabs'
import ListItem from '../components/themeComponents/ListItem'
import productImage from '../assets/images/product_item_one.svg'
import InputGroup from '../components/core/formComponents/InputGroup'
import ThemeDatePicker from '../components/core/formComponents/ThemeDatePicker'
import SvgAnimation from '../components/core/loader/SvgAnimation'
import { FaCheck } from 'react-icons/fa6'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import ToolTip from '../components/core/ToolTip'
import { Formik } from 'formik'

function CommonElement() {
  const [option, setOption] = useState([
    {
      label: 'Option 1',
      value: 'opt1',
    },
    {
      label: 'Option 2',
      value: 'opt2',
    },
    {
      label: 'Option 3',
      value: 'opt3',
    },
  ])
  const handleChangeSelect = (e) => {
    console.log(e)
  }
  const [startDate, setStartDate] = useState(new Date())
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [itemsPerPage, setItemsPerPage] = useState(4)
  const [currentItems, setCurrentItems] = useState([])
  const [itemOffset, setItemOffset] = useState(1)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setCurrentItems(data)
  }, [])
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
    setItemOffset(newOffset)
  }
  const expandableItem = [
    {
      label: 'Atelier Robuchon',
      value: '$12.451,17',
    },
    {
      label: 'Kaviar Kaspia',
      value: '$10.451,17',
    },
  ]
  const productItems = [
    {
      itemName: 'Aperol Aperitivo',
      itemImage: productImage,
      count: 4,
      positive: true,
      negative: false,
      neutral: false,
    },
    {
      itemName: 'Bombay Sapphire',
      itemImage: productImage,
      count: 9,
      positive: true,
      negative: false,
      neutral: false,
    },
    {
      itemName: 'Tanqueray Gin',
      itemImage: productImage,
      count: 17,
      positive: false,
      negative: true,
      neutral: false,
    },
    {
      itemName: 'Tanqueray Gin',
      itemImage: '',
      count: 17,
      positive: false,
      negative: false,
      neutral: true,
    },
  ]

  return (
    <div className='container py-8 px-3'>
      <div className='grid grid-cols-12 gap-6 place-items-stretch'>
        <div className='col-span-6'>
          <HeadingOne>Heading One</HeadingOne>
          <HeadingTwo>Heading Two</HeadingTwo>
          <HeadingThree>Heading Three</HeadingThree>
          <HeadingFour>Heading Four</HeadingFour>
          <HeadingFive>Heading Five</HeadingFive>
          <HeadingSix>Heading Six</HeadingSix>
        </div>
        <div className='col-span-6'>
          <Paragraph text32>
            Hi! This is <span className='font-bold'>Extra Large Paragraph(32px)</span>. Here we can write dummy text.
            Thank you!
          </Paragraph>
          <Paragraph text24>
            Hi! This is <span className='font-bold'>Large Paragraph(24px)</span>. Here we can write dummy text. Thank
            you!
          </Paragraph>
          <Paragraph text20>
            Hi! This is <span className='font-bold'>Medium Paragraph(20px)</span>. Here we can write dummy text. Thank
            you!
          </Paragraph>
          <Paragraph text18>
            Hi! This is <span className='font-bold'>Base Paragraph(18px)</span>. Here we can write dummy text. Thank
            you!
          </Paragraph>
          <Paragraph text16>
            Hi! This is <span className='font-bold'>Normal Paragraph(16px)</span>. Here we can write dummy text. Thank
            you!
          </Paragraph>
          <Paragraph text14>
            Hi! This is <span className='font-bold'>Small Paragraph(14px)</span>. Here we can write dummy text. Thank
            you!
          </Paragraph>
          <Paragraph text12>
            Hi! This is <span className='font-bold'>Extra Small Paragraph(12px)</span>. Here we can write dummy text.
            Thank you!
          </Paragraph>
          <FormLabel htmlFor='test' className={'test'}>
            This is form Label
          </FormLabel>
        </div>
        <div className='col-span-2'>
          <Button primary onClick={() => setOpen(true)}>
            Solid Button
          </Button>
        </div>
        <div className='col-span-2'>
          <Button secondary>Line Button</Button>
        </div>
        <div className='col-span-2'>
          <Button primary>
            <FiPlus fontSize={'18px'} />
            Button with Icon
          </Button>
        </div>
        <div className='col-span-2'>
          <Button secondary>
            <FiPlus fontSize={'18px'} />
            Button with Icon
          </Button>
        </div>
        <div className='col-span-1'>
          <Button onlyIcon lightBlueBg>
            <MdOutlineShoppingCart fontSize={'18px'} />
          </Button>
        </div>
        <div className='col-span-1'>
          <Button onlyIcon greyBg>
            <FiPlus fontSize={'18px'} />
          </Button>
        </div>
        <div className='col-span-2'>
          <Button disabled>
            <FiPlus fontSize={'18px'} />
            Disabled Button
          </Button>
        </div>
        <div className='col-span-12'>
          <Button type='submit' primary className={'w-full'}>
            <FiPlus fontSize={'18px'} />
            Full width Button
          </Button>
        </div>
        <div className='col-span-4'>{/* <InputType type='text' placeholder='Text Field' /> */}</div>
        <div className='col-span-4'>
          <SelectType
            options={option}
            fullWidth={'!w-full'}
            placeholder='Please select...'
            onChange={(e) => handleChangeSelect(e)}
            isSearchable
            isMulti
          />
        </div>
        <div className='col-span-4'>
          <SelectType
            options={option}
            fullWidth={'!w-full'}
            placeholder='Please select...'
            onChange={(e) => handleChangeSelect(e)}
          />
        </div>
        <div className='col-span-4'>
          <SelectType
            sm
            fullWidth={'!w-full'}
            options={option}
            placeholder='Please select...'
            onChange={(e) => handleChangeSelect(e)}
          />
        </div>
        <div className='col-span-4'>
          <SelectType
            fullWidth={'!w-full'}
            xs
            options={option}
            placeholder='Please select...'
            onChange={(e) => handleChangeSelect(e)}
          />
        </div>
        <div className='col-span-4'>{/* <InputType type={'search'} placeholder='Search'></InputType> */}</div>
        <div className='col-span-4'>
          <InputGroup placeholder='Type Here' prefix={<FiDollarSign size={18} color='#080808' />}></InputGroup>
        </div>
        <div className='col-span-4'>
          <InputGroup placeholder='Type Here' postfix={<FiDollarSign size={18} color='#080808' />}></InputGroup>
        </div>

        <div className='col-span-3 col-start-1'>
          <FormLabel>Checkbox Group 1</FormLabel>
          <div className='flex items-center gap-6'>
            <Checkbox w18 name={'dinner'} id={'food'}>
              Food
            </Checkbox>
            <Checkbox w18 name='dinner' id={'Alcohol'}>
              Alcohol
            </Checkbox>
          </div>
        </div>
        <div className='col-span-3'>
          <FormLabel>Checkbox Group - Small Size (15px)</FormLabel>
          <div className='flex items-center gap-6'>
            <Checkbox w15 name={'lunch'} id={'dosa'}>
              Dosa
            </Checkbox>
            <Checkbox w15 name='lunch' id={'pavBhaji'}>
              Pav Bhaji
            </Checkbox>
          </div>
        </div>
        <div className='col-span-3'>
          <FormLabel>Radio Group 1</FormLabel>
          <div className='flex items-center gap-6'>
            <RadioButton name={'radio1'} id={'beer'}>
              Beer
            </RadioButton>
            <RadioButton name='radio1' id={'wine'}>
              Wine
            </RadioButton>
          </div>
        </div>
        <div className='col-span-3'>
          <SwitchToggle />
        </div>
        <div className='col-span-3'>
          <DashboardStatCard
            className={'bg-[#2A2AF40D]'}
            icon={<LuClipboardList fontSize={'18px'} />}
            increasedValue={'10%'}
            statValue={'$1045'}
            statName={'Variance'}
            tooltip={'Variance since last full inventory'}
          />
        </div>
        <div className='col-span-3'>
          <DashboardStatCard
            className={'bg-[#00A5110D]'}
            icon={<LuClipboardList fontSize={'18px'} />}
            increasedValue={'15%'}
            statValue={'$13.547'}
            statName={'Yesterday sales'}
            tooltip={"Yesterday's sales"}
          />
        </div>
        <div className='col-span-3'>
          <DashboardStatCard
            className={'bg-[#F2FBF3]'}
            icon={<LuClipboardList fontSize={'18px'} />}
            increasedValue={'10%'}
            statValue={'$1045'}
            statName={'Variance'}
            tooltip={'Variance since last full inventory'}
            expandable
            expandableItem={expandableItem}
            expandableBG={'bg-[#F2FBF3]'}
          />
        </div>
        <div className='col-span-6 border border-light-grey p-4'>
          {data?.length > 0 && (
            <ReactPaginate
              breakLabel='...'
              nextLabel={<PiArrowRightBold fontSize={'18px'} />}
              onPageChange={handlePageClick}
              pageCount={2}
              previousLabel={<PiArrowLeftBold fontSize={'18px'} />}
              renderOnZeroPageCount={null}
              containerClassName={'pagination'}
              pageClassName={'pageItem'}
              forcePage={itemOffset - 1}
            />
          )}
        </div>
        {/* <div className='col-span-12'>
          <TableLayout />
        </div> */}
        <div className='col-span-12'>
          <WhiteCard>White Card</WhiteCard>
        </div>
        <div className='col-span-6'>
          <Accordion className='max-w-full'>
            <AccordionItem value='1' trigger='Accordion Item 1'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos maiores reprehenderit, quasi tenetur quaerat
              hic aperiam mollitia eaque id ipsam.
            </AccordionItem>
            <AccordionItem value='2' trigger='Accordion Item 2'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos maiores reprehenderit, quasi tenetur quaerat
              hic aperiam mollitia eaque id ipsam.
            </AccordionItem>
          </Accordion>
        </div>
        <div className='col-span-6'>
          <WhiteCard>
            <Tabs>
              <Tab label='Tab 1'>
                <div className='py-4'>
                  <h2 className='text-lg font-medium mb-2'>Tab 1 Content</h2>
                  <p className='text-gray-700'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint
                    commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit
                    fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem.
                    Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet
                    aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum
                    debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium
                    molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias
                    error harum maxime adipisci amet laborum.
                  </p>
                </div>
              </Tab>
              <Tab label='Tab 2'>
                <div className='py-4'>
                  <h2 className='text-lg font-medium mb-2'>Tab 2 Content</h2>
                  <p className='text-gray-700'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint
                    commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit
                    fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem.
                    Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet
                    aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum
                    debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium
                    molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias
                    error harum maxime adipisci amet laborum.
                  </p>
                </div>
              </Tab>
              <Tab label='Tab 3'>
                <div className='py-4'>
                  <h2 className='text-lg font-medium mb-2'>Tab 3 Content</h2>
                  <p className='text-gray-700'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint
                    commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit
                    fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem.
                    Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet
                    aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum
                    debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium
                    molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias
                    error harum maxime adipisci amet laborum.
                  </p>
                </div>
              </Tab>
            </Tabs>
          </WhiteCard>
        </div>
        <div className='col-span-6'>
          <WhiteCard>
            {productItems.map((item) => {
              return (
                <ListItem
                  withBorder
                  withCount
                  count
                  positive={item?.positive}
                  negative={item?.negative}
                  neutral={item?.neutral}
                  className='mb-2'
                  itemName={item?.itemName}
                  productImage={item?.itemImage}
                  pillValue={item?.count}
                />
              )
            })}
          </WhiteCard>
        </div>
        <div className='col-span-6'>
          <WhiteCard>
            <div className='border border-medium-grey rounded-lg'>
              {productItems.map((item, index) => {
                const isLastItem = index === productItems.length - 1
                return (
                  <ListItem
                    key={index}
                    defaultItem
                    withCount
                    {...(!isLastItem && { borderBottom: true })}
                    count={index + 1}
                    positive={item?.positive}
                    negative={item?.negative}
                    neutral={item?.neutral}
                    className='mb-2'
                    itemName={item?.itemName}
                    productImage={item?.itemImage}
                    pillValue={item?.count}
                  />
                )
              })}
            </div>
          </WhiteCard>
        </div>
        <div className='col-span-6'>
          <ThemeDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat={'MMMM d, yyyy h:mm aa'}
            showTimeSelect
          />
        </div>
        <div className='col-sapn-6'>
          <SvgAnimation />
        </div>

        {/* <Modal open={open} onClose={() => setOpen(false)} header headingText={'This Is Heading'}>
          <Paragraph text18>Hi this is modal/popup whatever you would like to say!</Paragraph>
        </Modal> */}
      </div>
    </div>
  )
}

export default CommonElement
