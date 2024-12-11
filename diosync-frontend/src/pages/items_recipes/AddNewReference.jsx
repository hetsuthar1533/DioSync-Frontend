/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import InputType from '../../components/core/formComponents/InputType'
import FormLabel from '../../components/core/typography/FormLabel'
import Button from '../../components/core/formComponents/Button'
import SelectType from '../../components/core/formComponents/SelectType'
import Paragraph from '../../components/core/typography/Paragraph'
import InputGroup from '../../components/core/formComponents/InputGroup'
import { FiPercent } from 'react-icons/fi'
import RadioButton from '../../components/core/formComponents/RadioButton'
import Checkbox from '../../components/core/formComponents/Checkbox'
import CreatableCustomSelect from '../../components/core/formComponents/CreatableCustomSelect'
import { GetAllCaseSize } from '../../services/caseSizeService'
import { GetAllCategories } from '../../services/categoryService'
import { GetSubCategoriesbyCategories } from '../../services/subCategoryService'
import { GetAllUnitMeasure } from '../../services/unitMeasure'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { AddNewReferenceAPI, GetAllItemsOfBarVenue, UpdateOwnerItem } from '../../services/itemsService'
import {
  addNewRefernceValidationSchema,
  addNewRefernceValidationSchemawithIndividual,
} from '../../validations/owner/addNewRefernceValidationSchema'
import { GetAllSupplierDropdown } from '../../services/SupplierService'
import { GetAllContainer } from '../../services/containerService'
import { activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function AddNewReference({ onClose, selectedItem, getItemsData }) {
  const dispatch = useDispatch()
  const { generalData } = useSelector(generalDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    bar_venue: activeVenue,
    item_name: '',
    brand_name: '',
    category: '',
    sub_category: '',
    barcode: '',
    vendor: '',
    unit_size: '',
    unit_of_measure: '',
    container: '',
    case_size: '',
    cost_price: '',
    is_sold_individually: false,
    alc_per_volume: '',
    PLU_code: '',
    sell_price: '',
    tare_or_weight_checked: true,
    tare_or_weight: null,
    // tare_or_weight_unit_of_measure: '',
    tare_or_weight_empty_checked: false,
    tare_or_weight_empty: null,
    // tare_or_weight_unit_of_measure_empty: '',
  })
  const [selectedValueItem, setSelectedValueItem] = useState('') //auto fill
  const [itemData, setItemData] = useState([]) //autofill name check
  const [soldIndividually, setSoldIndividually] = useState(false)
  const [itemOptions, setItemOptions] = useState([])
  const [categoriesListOption, setCategoriesListOption] = useState([])
  const [subCategoriesListOption, setSubCategoriesListOption] = useState([])
  const [supplierOption, setSupplierOption] = useState([])
  const [containerOption, setContainerOption] = useState([])
  const [caseSizeListOption, setCaseSizeListOption] = useState([])
  const [unitMeasureOption, setUnitMeasureOption] = useState([])

  useEffect(() => {
    fetchAllItems()
    fetchCategories()
    fetchAllCaseSize()
    fetchAllUnitMeasure()
    fetchAllContainer()
  }, [])

  useEffect(() => {
    if (activeVenue && activeVenue > 0) {
      fetchAllSupplier(activeVenue)
    }
  }, [activeVenue])

  useEffect(() => {
    if (selectedValueItem !== '' && selectedValueItem !== undefined) {
      const foundItem = itemData.find((item) => item.name.toLowerCase() === selectedValueItem.toLowerCase())
      if (foundItem) {
        setDefaultInitialValues((prev) => ({
          ...prev,
          item_name: foundItem?.name,
          brand_name: foundItem?.brand_name,
          category: foundItem?.category?.id,
          sub_category: foundItem?.sub_category?.id,
          barcode: foundItem?.barcode,
          unit_size: foundItem?.unit_size,
          case_size: foundItem?.case_size?.id,
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValueItem])

  useEffect(() => {
    if (selectedItem) {
      fetchAllSubCategories(selectedItem?.category?.id)
      setDefaultInitialValues({
        bar_venue: selectedItem?.bar_venue?.id,
        item_name: selectedItem?.item_name,
        brand_name: selectedItem?.brand_name,
        category: selectedItem?.category?.id,
        sub_category: selectedItem?.sub_category?.id,
        barcode: selectedItem?.barcode,
        vendor: selectedItem?.vendor?.id,
        unit_size: selectedItem?.unit_size,
        unit_of_measure: selectedItem?.unit_of_measure?.id,
        container: selectedItem?.container?.id,
        case_size: selectedItem?.case_size?.id,
        cost_price: Number(selectedItem?.actual_cost_price),
        is_sold_individually: selectedItem?.is_sold_individually,
        alc_per_volume: selectedItem?.alc_per_volume || '',
        PLU_code: selectedItem?.PLU_code || '',
        sell_price: Number(selectedItem?.actual_sell_price),
        tare_or_weight_checked: selectedItem?.tare_or_weight_checked || '', //add be side get
        tare_or_weight: selectedItem?.tare_or_weight || '',
        // tare_or_weight_unit_of_measure: selectedItem?.tare_or_weight_unit_of_measure?.id || '',
        tare_or_weight_empty_checked: selectedItem?.tare_or_weight_empty_checked || '', // add side in get
        tare_or_weight_empty: selectedItem?.tare_or_weight_empty || '', // add side in get
        // tare_or_weight_unit_of_measure_empty: selectedItem?.tare_or_weight_unit_of_measure_empty?.id || '', // add
      })
      setSoldIndividually(selectedItem?.is_sold_individually)
    }
  }, [selectedItem])

  const fetchAllItems = async () => {
    try {
      const response = await GetAllItemsOfBarVenue(activeVenue)
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((item) => ({
          label: item.name,
          value: item.name,
        }))
        const asc_order = formattedData?.sort((a, b) => {
          if (a.label < b.label) return -1
          if (a.label > b.label) return 1
          return 0
        })
        setItemOptions(asc_order)
        setItemData(response?.data?.data)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }
  const fetchAllContainer = async () => {
    try {
      const response = await GetAllContainer()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((container) => ({
          label: container.name,
          value: container.id,
        }))
        setContainerOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }
  const fetchAllSupplier = async (activeVenue) => {
    try {
      const response = await GetAllSupplierDropdown(activeVenue)
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((supplier) => ({
          label: supplier.supplier_name,
          value: supplier.id,
        }))
        setSupplierOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }
  const fetchAllCaseSize = async () => {
    try {
      const response = await GetAllCaseSize()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data?.map((subcategory) => ({
          label: subcategory.name,
          value: subcategory.id,
        }))
        setCaseSizeListOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await GetAllCategories()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((category) => ({
          label: category.name,
          value: category.id,
        }))
        const asc_order = formattedData?.sort((a, b) => {
          if (a.label < b.label) return -1
          if (a.label > b.label) return 1
          return 0
        })
        setCategoriesListOption(asc_order)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    if (selectedCategory !== null) {
      fetchAllSubCategories(selectedCategory)
    }
  }, [selectedCategory])

  const fetchAllSubCategories = async (selectedCategory) => {
    try {
      const response = await GetSubCategoriesbyCategories(selectedCategory)
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((subcategory) => ({
          label: subcategory.sub_category_name,
          value: subcategory.id,
        }))
        const asc_order = formattedData?.sort((a, b) => {
          if (a.label < b.label) return -1
          if (a.label > b.label) return 1
          return 0
        })
        setSubCategoriesListOption(asc_order)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const fetchAllUnitMeasure = async () => {
    try {
      const response = await GetAllUnitMeasure()
      if (response?.data?.status === 200) {
        const formattedData = response?.data?.data.map((unit) => ({
          label: unit.name,
          value: unit.id,
        }))
        setUnitMeasureOption(formattedData)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }
  const handleCallListApi = () => {
    onClose()
    getItemsData()
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())
    const paramsData = {
      bar_venue: selectedItem?.bar_venue?.id,
      ...(data?.item_name !== selectedItem?.item_name && { item_name: data?.item_name }),
      brand_name: data?.brand_name,
      category: data?.category,
      sub_category: data?.sub_category,
      barcode: data?.barcode,
      ...(data?.vendor !== selectedItem?.vendor?.id && { vendor: data?.vendor }),
      unit_size: Number(data?.unit_size),
      unit_of_measure: data?.unit_of_measure,
      container: data?.container,
      ...(data?.case_size !== undefined && data?.case_size !== '' && { case_size: data.case_size }),
      cost_price: data?.cost_price,
      is_sold_individually: data?.is_sold_individually,
      ...(data?.alc_per_volume !== null &&
        data?.alc_per_volume !== undefined &&
        data?.alc_per_volume !== '' && { alc_per_volume: data.alc_per_volume }),
      ...(data?.PLU_code !== null &&
        data?.PLU_code !== undefined &&
        data?.PLU_code !== '' && { PLU_code: data.PLU_code }),
      // ...(data?.sell_price !== null &&
      //   data?.sell_price !== undefined &&
      //   data?.sell_price !== '' && { sell_price: data.sell_price }),
      sell_price: !data?.is_sold_individually ? 0 : data?.sell_price,
      ...(data?.tare_or_weight !== null &&
        data?.tare_or_weight !== undefined &&
        data?.tare_or_weight !== '' && { tare_or_weight: data.tare_or_weight }),
      ...(data?.tare_or_weight_checked !== null &&
        data?.tare_or_weight_checked !== undefined &&
        data?.tare_or_weight_checked !== '' && {
          tare_or_weight_checked: data.tare_or_weight_checked,
        }),
      ...(data?.tare_or_weight_empty !== null &&
        data?.tare_or_weight_empty !== undefined &&
        data?.tare_or_weight_empty !== '' && {
          tare_or_weight_empty: data.tare_or_weight_empty,
        }),
      ...(data?.tare_or_weight_empty_checked !== null &&
        data?.tare_or_weight_empty_checked !== undefined &&
        data?.tare_or_weight_empty_checked !== '' && {
          tare_or_weight_empty_checked: data.tare_or_weight_empty_checked,
        }),
      ...(data?.tare_or_weight_unit_of_measure !== null &&
        data?.tare_or_weight_unit_of_measure !== undefined &&
        data?.tare_or_weight_unit_of_measure !== '' && {
          tare_or_weight_unit_of_measure: data.tare_or_weight_unit_of_measure,
        }),
      ...(data?.tare_or_weight_unit_of_measure_empty !== null &&
        data?.tare_or_weight_unit_of_measure_empty !== undefined &&
        data?.tare_or_weight_unit_of_measure_empty !== '' && {
          tare_or_weight_unit_of_measure_empty: data.tare_or_weight_unit_of_measure_empty,
        }),
    }

    if (selectedItem?.id) {
      // const response = await UpdateOwnerItem(soldIndividually ? data : paramsData, selectedItem?.id)
      const response = await UpdateOwnerItem(paramsData, selectedItem?.id)
      if (response?.status === 200) {
        handleCallListApi()
      }
    } else {
      const paramsData = {
        bar_venue: activeVenue,
        item_name: data?.item_name,
        brand_name: data?.brand_name,
        category: data?.category,
        sub_category: data?.sub_category,
        barcode: data?.barcode,
        vendor: data?.vendor,
        unit_size: Number(data?.unit_size),
        unit_of_measure: data?.unit_of_measure,
        container: data?.container,
        ...(data?.case_size !== undefined && data?.case_size !== '' && { case_size: data.case_size }),
        cost_price: data?.cost_price,
        ...(data?.PLU_code !== null &&
          data?.PLU_code !== undefined &&
          data?.PLU_code !== '' && { PLU_code: data.PLU_code }),
        // ...(data?.sell_price !== null &&
        //   data?.sell_price !== undefined &&
        //   data?.sell_price !== '' && { sell_price: data.sell_price }),
        sell_price: !data?.is_sold_individually ? 0 : data?.sell_price,
        is_sold_individually: data?.is_sold_individually,
        ...(data?.alc_per_volume !== null &&
          data?.alc_per_volume !== undefined &&
          data?.alc_per_volume !== '' && {
            alc_per_volume: data.alc_per_volume,
          }),
        ...(data?.tare_or_weight !== null &&
          data?.tare_or_weight !== undefined &&
          data?.tare_or_weight !== '' && {
            tare_or_weight: data.tare_or_weight,
          }),
        ...(data?.tare_or_weight_checked !== null &&
          data?.tare_or_weight_checked !== undefined &&
          data?.tare_or_weight_checked !== '' && {
            tare_or_weight_checked: data.tare_or_weight_checked,
          }),
        ...(data?.tare_or_weight_empty !== null &&
          data?.tare_or_weight_empty !== undefined &&
          data?.tare_or_weight_empty !== '' && {
            tare_or_weight_empty: data.tare_or_weight_empty,
          }),
        ...(data?.tare_or_weight_empty_checked !== null &&
          data?.tare_or_weight_empty_checked !== undefined &&
          data?.tare_or_weight_empty_checked !== '' && {
            tare_or_weight_empty_checked: data.tare_or_weight_empty_checked,
          }),
        // ...(data?.tare_or_weight_unit_of_measure !== null &&
        //   data?.tare_or_weight_unit_of_measure !== undefined &&
        //   data?.tare_or_weight_unit_of_measure !== '' && {
        //     tare_or_weight_unit_of_measure: data.tare_or_weight_unit_of_measure,
        //   }),
        // ...(data?.tare_or_weight_unit_of_measure_empty !== null &&
        //   data?.tare_or_weight_unit_of_measure_empty !== undefined &&
        //   data?.tare_or_weight_unit_of_measure_empty !== '' && {
        //     tare_or_weight_unit_of_measure_empty: data.tare_or_weight_unit_of_measure_empty,
        //   }),
      }
      const response = await AddNewReferenceAPI(paramsData)
      if (response?.status === 201) {
        handleCallListApi()
      }
    }
    dispatch(hideLoader())
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={
        soldIndividually ? addNewRefernceValidationSchemawithIndividual : addNewRefernceValidationSchema
      }
      onSubmit={OnSubmit}
    >
      {({ values, errors, isSubmitting, setFieldValue, handleBlur }) => (
        <Form>
          <div className='grid grid-cols-12 sm:gap-4 gap-3'>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Item name</FormLabel>
              <CreatableCustomSelect
                name='item_name'
                placeholder={'Type here'}
                options={itemOptions}
                setOption={setItemOptions}
                isMulti={false}
                isClearable={false}
                onChange={(option) => {
                  setFieldValue('item_name', option.value)
                  setSelectedValueItem(option?.value)
                }}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Item brand (Optional)</FormLabel>
              <InputType name={'brand_name'} placeholder={'Type here'} onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Category</FormLabel>
              <SelectType
                fullWidth={'sm:!w-auto !w-full'}
                options={categoriesListOption}
                placeholder={'Select Category'}
                error={errors?.category}
                onChange={(option) => {
                  setFieldValue('category', option?.value)
                  setSelectedCategory(option.value)
                }}
                value={categoriesListOption?.find((option) => option?.value === values?.category) || ''}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Subcategory (Optional)</FormLabel>
              <SelectType
                fullWidth={'!w-full'}
                options={subCategoriesListOption}
                placeholder={'Select Subcategory'}
                error={errors?.sub_category}
                onChange={(option) => setFieldValue('sub_category', option?.value)}
                value={subCategoriesListOption?.find((option) => option?.value === values?.sub_category)}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Barcode (Optional)</FormLabel>
              <InputType name={'barcode'} placeholder={'#42247081'} onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Supplier</FormLabel>
              <SelectType
                fullWidth={'!w-full'}
                options={supplierOption}
                placeholder={'Supplier'}
                error={errors?.vendor}
                onChange={(option) => setFieldValue('vendor', option?.value)}
                value={supplierOption?.find((option) => option?.value === values?.vendor)}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Unit size</FormLabel>
              <InputType name={'unit_size'} type={'number'} placeholder={'Unit size'} onBlur={handleBlur} />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Unit of measure</FormLabel>
              <SelectType
                fullWidth={'!w-full'}
                options={unitMeasureOption}
                placeholder={'Unit of measure'}
                error={errors?.unit_of_measure}
                onChange={(option) => {
                  setFieldValue('unit_of_measure', option?.value)
                  setFieldValue('tare_or_weight_unit_of_measure', option?.value)
                  setFieldValue('tare_or_weight_unit_of_measure_empty', option?.value)
                }}
                value={unitMeasureOption?.find((option) => option?.value === values?.unit_of_measure)}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Container</FormLabel>
              <SelectType
                fullWidth={'!w-full'}
                options={containerOption}
                placeholder={'Container'}
                error={errors?.container}
                onChange={(option) => setFieldValue('container', option?.value)}
                value={containerOption?.find((option) => option?.value === values?.container)}
              />
            </div>
            <div className='md:col-span-6 col-span-12 sm:mb-1'>
              <FormLabel>Case size (Optional)</FormLabel>
              <SelectType
                fullWidth={'!w-full'}
                options={caseSizeListOption}
                placeholder={'Case size'}
                error={errors?.case_size}
                isOptional={true}
                onChange={(option) => setFieldValue('case_size', option?.value)}
                value={caseSizeListOption?.find((option) => option?.value === values?.case_size)}
              />
            </div>
            <div className='col-span-12 sm:mb-1'>
              <FormLabel>Cost Price</FormLabel>
              <InputGroup
                placeholder='Type Here'
                prefix={<span>{generalData?.currency ?? ''}</span>}
                name='cost_price'
                error={errors?.cost_price}
              />
            </div>

            <div className='col-span-12 sm:mb-1'>
              <FormLabel>Tare/Weight</FormLabel>
              <div className='grid grid-cols-12 gap-1'>
                <div className='md:col-span-6 col-span-12 mb-3'>
                  <div className='border border-medium-grey rounded-lg px-4 py-[13px]'>
                    <Checkbox
                      w18
                      name={'tare_or_weight_checked'}
                      id={'tare_or_weight_checked'}
                      className={'!flex'}
                      checked={values?.tare_or_weight_checked}
                      onChange={() => setFieldValue('tare_or_weight_checked', !values?.tare_or_weight_checked)}
                    >
                      Full Item weight
                    </Checkbox>
                  </div>
                  <span className='text-site-red text-sm font-medium'>{errors?.tare_or_weight_checked}</span>
                </div>
                <div className='md:col-span-6 col-span-12 mb-3'>
                  {/* <div className='border border-medium-grey rounded-lg px-4 py-[7px] flex items-center gap-2'> */}
                  <div>
                    {/* <InputType
                      onBlur={handleBlur}
                      placeholder={'Type here'}
                      name={'tare_or_weight'}
                      className={'border-0 !px-0 !py-0'}
                      type='number'
                    /> */}
                    <InputGroup
                      placeholder={'Type here'}
                      name={'tare_or_weight'}
                      // className={'py-3'}
                      onBlur={handleBlur}
                      type='number'
                      postfix={<>gm</>}
                      error={errors?.tare_or_weight}
                    />

                    {/* <SelectType
                      xs
                      disabled
                      fullWidth={'flex-shrink-0'}
                      options={unitMeasureOption}
                      placeholder={'Select'}
                      error={errors?.tare_or_weight_unit_of_measure}
                      onChange={(option) => setFieldValue('tare_or_weight_unit_of_measure', option?.value)}
                      value={unitMeasureOption?.find(
                        (option) => option?.value === values?.tare_or_weight_unit_of_measure,
                      )}
                    /> */}
                  </div>
                </div>
                <div className='md:col-span-6 col-span-12 mb-3'>
                  <div className='border border-medium-grey rounded-lg px-4 py-[13px]'>
                    <Checkbox
                      w18
                      name={'tare_or_weight_empty_checked'}
                      id={'tare_or_weight_empty_checked'}
                      className={'!flex'}
                      checked={values?.tare_or_weight_empty_checked}
                      onChange={() =>
                        setFieldValue('tare_or_weight_empty_checked', !values?.tare_or_weight_empty_checked)
                      }
                    >
                      Empty Item weight
                    </Checkbox>
                  </div>
                  <span className='text-site-red text-sm font-medium'>{errors?.tare_or_weight_empty_checked}</span>
                </div>
                <div className='md:col-span-6 col-span-12 mb-3'>
                  {/* <div className='border border-medium-grey rounded-lg px-4 py-[7px] flex items-center gap-2'> */}
                  <div className=''>
                    {/* <InputType
                      placeholder={'Type here'}
                      name={'tare_or_weight_empty'}
                      className={'border-0 !px-0 !py-0'}
                      onBlur={handleBlur}
                      type='number'
                    /> */}
                    <InputGroup
                      placeholder={'Type here'}
                      name={'tare_or_weight_empty'}
                      // className={'py-3'}
                      onBlur={handleBlur}
                      type='number'
                      postfix={<>gm</>}
                      error={errors?.tare_or_weight_empty}
                    />

                    {/* <SelectType
                      xs
                      disabled
                      fullWidth={'flex-shrink-0'}
                      options={unitMeasureOption}
                      placeholder={'Select'}
                      error={errors?.tare_or_weight_unit_of_measure_empty}
                      onChange={(option) => setFieldValue('tare_or_weight_unit_of_measure_empty', option?.value)}
                      value={unitMeasureOption?.find(
                        (option) => option?.value === values?.tare_or_weight_unit_of_measure_empty,
                      )}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className='md:col-span-12 col-span-12 sm:mb-1'>
              <FormLabel>Alcohol Per volume</FormLabel>
              <InputGroup
                placeholder='ABV'
                postfix={<FiPercent size={18} color='#080808' />}
                name={'alc_per_volume'}
                error={errors?.alc_per_volume}
              />
            </div>
            <div className='col-span-12 sm:mb-1'>
              <Paragraph text16 className={'text-center font-semibold mb-1'}>
                Is this reference sold individually
              </Paragraph>
              <div className='flex items-center justify-center gap-6'>
                <RadioButton
                  name={'is_sold_individually'}
                  id={'yes'}
                  onChange={() => {
                    setSoldIndividually(true)
                    setFieldValue('is_sold_individually', true)
                  }}
                  checked={values?.is_sold_individually === true}
                >
                  Yes
                </RadioButton>
                <RadioButton
                  name='is_sold_individually'
                  id={'no'}
                  onChange={() => {
                    setSoldIndividually(false)
                    setFieldValue('is_sold_individually', false)
                  }}
                  checked={values?.is_sold_individually === false}
                >
                  No
                </RadioButton>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-12 sm:gap-4 gap-3 sm:mt-5 mt-4'>
            {values?.is_sold_individually && (
              <>
                <div className='md:col-span-6 col-span-12 sm:mb-1'>
                  <FormLabel>PLU Code</FormLabel>
                  <InputType placeholder={'Type here'} name={'PLU_code'} onBlur={handleBlur} />
                </div>
                <div className='md:col-span-6 col-span-12 sm:mb-1'>
                  <FormLabel>Sell Price</FormLabel>
                  <InputGroup
                    name={'sell_price'}
                    placeholder='Type Here'
                    prefix={<span>{generalData?.currency ?? ''}</span>}
                    error={errors?.sell_price}
                  />
                </div>
              </>
            )}
          </div>

          <div className='grid grid-cols-12 mt-3'>
            <div className='col-span-12'>
              <div className='flex items-center justify-end gap-4'>
                <Button onClick={onClose} secondary className={'w-full md:w-auto'}>
                  Cancel
                </Button>
                <Button type='submit' primary disabled={isSubmitting} className={'w-full md:w-auto'}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddNewReference
