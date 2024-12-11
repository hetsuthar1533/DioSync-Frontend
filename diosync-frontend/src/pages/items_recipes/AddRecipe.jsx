import React, { useEffect, useRef, useState } from 'react'
import WhiteCard from '../../components/themeComponents/WhiteCard'
import FormLabel from '../../components/core/typography/FormLabel'
import InputType from '../../components/core/formComponents/InputType'
import { Form, Formik, FormikProvider, useFormik } from 'formik'
import SearchFilter from '../../components/core/formComponents/SearchFilter'
import InputGroup from '../../components/core/formComponents/InputGroup'
import { FiDollarSign, FiPercent } from 'react-icons/fi'
import Button from '../../components/core/formComponents/Button'
import ToolTip from '../../components/core/ToolTip'
import { LuInfo } from 'react-icons/lu'
import IconDelete from '../../assets/images/icon_delete.svg'
import Paragraph from '../../components/core/typography/Paragraph'
import ListItem from '../../components/themeComponents/ListItem'
import { AiOutlineDollar } from 'react-icons/ai'
import { addRecipeValidationSchema } from '../../validations/owner/addRecipeValidationSchema'
import { GetAllIngridents } from '../../services/ingredientService'
import SelectType from '../../components/core/formComponents/SelectType'
import { GetAllUnitMeasure } from '../../services/unitMeasure'
import { CalculateTotalPrice, calculateGrandTotal } from '../../utils/commonHelper'
import { activeVenueCostAlertSelector, activeVenueSelector } from '../../redux/slices/ownerVenueSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AddNewRecipe, GetRecipeById, UpdateRecipe } from '../../services/recipeService'
import { paths } from '../../routes/path'
import { useNavigate, useParams } from 'react-router-dom'
import { hideLoader, showLoader } from '../../redux/slices/siteLoaderSlice'
import { generalDataSelector } from '../../redux/slices/generalDataSlice'

function AddRecipe() {
  const { generalData } = useSelector(generalDataSelector)
  const dispatch = useDispatch()
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const activeVenue = useSelector(activeVenueSelector)
  const activeVenueCostAlert = useSelector(activeVenueCostAlertSelector)
  const [defaultInitialValue, setDefaultInitialValues] = useState({
    recipe_name: '',
    sale_price: '',
    total_cost: 0,
    total_cost_percentage: '',
    sale_profit: '',
    cost_alert: '',
    mist_cost: 0,
    PLU_code: '',
    bar_venue: '',
  })
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const [searchItem, setSearchItem] = useState('')
  const [ingredientOptionData, setIngredientOptionData] = useState([])
  const [availableIngredientOption, setAvailableIngredientOption] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState({})
  const [unitMeasureData, setUnitMeasureData] = useState([])
  const [unitMeasureOption, setUnitMeasureOption] = useState([])
  // const [qty, setQty] = useState(1)
  // const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState(2)
  const [selectedIngredientData, setSelectedIngredientData] = useState([])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchAllUnitMeasure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeVenue) {
      getIngredientData(activeVenue)
    }
  }, [activeVenue])

  useEffect(() => {
    if (recipeId && activeVenue) {
      getRecipeById(recipeId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId])

  const getIngredientData = async (activeVenue) => {
    if (activeVenue) {
      const response = await GetAllIngridents(activeVenue)
      if (response?.status === 200) {
        const updatedItems = response?.data?.data?.map((item) => {
          const valueIntoGm = parseFloat(item.unit_of_measure?.value_into_gm) || 0
          const unitSize = parseFloat(item.unit_size) || 0
          return {
            ...item,
            item_value_into_gm: unitSize * valueIntoGm,
          }
        })
        setIngredientOptionData(updatedItems)
        setAvailableIngredientOption(updatedItems)
      }
    }
  }
  const fetchAllUnitMeasure = async () => {
    try {
      const response = await GetAllUnitMeasure()
      if (response?.data?.status === 200) {
        setUnitMeasureData(response?.data?.data)
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

  const toggleDropdown = (dropdown) => {
    setIsOpen((prevDropdown) => (prevDropdown === dropdown ? null : dropdown))
  }
  const closeDropdown = () => {
    setIsOpen(false)
    setSelectedIngredient({})
    // setQty(1)
    // setSelectedUnitOfMeasure(null)
  }
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown()
    }
  }

  // const handleSelectedIngredient = (data) => {
  //   setSelectedIngredient(data)
  //   toggleDropdown('add_ingredients')
  // }

  const getRecipeById = async (recipeId) => {
    if (recipeId) {
      const response = await GetRecipeById(recipeId)
      const recipeData = response?.data?.data
      if (response?.status === 200) {
        setDefaultInitialValues({ ...recipeData })
        const response = await GetAllUnitMeasure()
        if (response?.data?.status === 200) {
          const formattedData = response?.data?.data.map((unit) => ({
            label: unit.name,
            value: unit.id,
          }))
          const filteredData = recipeData?.ingredients?.map((ingredient) => ({
            id: ingredient?.ingredient?.id,
            item_name: ingredient?.ingredient?.item_name,
            cost_price: parseFloat(ingredient?.ingredient?.cost_price),
            unit_size: parseFloat(ingredient?.ingredient?.unit_size),
            unit_of_measure: ingredient?.unit_of_measure,
            selectedUnitOfMeasure:
              formattedData?.find((nameObj) => nameObj?.value === ingredient?.unit_of_measure?.id).value || null,
            qty: parseFloat(ingredient?.qty),
            totalCostPrice: parseFloat(ingredient.total_price),
            item_value_into_gm:
              parseFloat(ingredient?.ingredient?.unit_of_measure?.value_into_gm) * ingredient?.ingredient?.unit_size,
          }))
          const responseOption = await GetAllIngridents(activeVenue)
          if (responseOption?.status === 200) {
            const updatedItems = responseOption?.data?.data?.map((item) => {
              const valueIntoGm = parseFloat(item.unit_of_measure?.value_into_gm) || 0
              const unitSize = parseFloat(item.unit_size) || 0
              return {
                ...item,
                item_value_into_gm: unitSize * valueIntoGm,
              }
            })

            const selectedIds = filteredData?.map((item) => item.id)
            const remainingItems = updatedItems.filter((item) => !selectedIds.includes(item.id))

            setAvailableIngredientOption(remainingItems)
          }

          setSelectedIngredientData(filteredData)
        }
      }
    }
  }

  const handleAddIngrdient = (qty, selectedUnitOfMeasure, ingredientData) => {
    setSelectedIngredient(ingredientData)
    setSelectedIngredientData((prev) => [
      ...prev,
      {
        ...ingredientData,
        qty,
        selectedUnitOfMeasure,
        totalCostPrice: CalculateTotalPrice(
          Number(ingredientData?.item_value_into_gm),
          Number(ingredientData?.cost_price),
          Number(qty),
          selectedUnitOfMeasure,
          unitMeasureData,
        ),
      },
    ])
    const filterIngredient = [
      ...selectedIngredientData,
      {
        ...ingredientData,
        qty,
        selectedUnitOfMeasure,
        totalCostPrice: CalculateTotalPrice(
          Number(ingredientData?.item_value_into_gm),
          Number(ingredientData?.cost_price),
          Number(qty),
          selectedUnitOfMeasure,
          unitMeasureData,
        ),
      },
    ]
    const selectedIds = filterIngredient?.map((item) => item.id)
    const remainingItems = ingredientOptionData?.filter((item) => !selectedIds.includes(item.id))
    const availableIngredients = remainingItems?.filter((option) => selectedIngredient?.id !== option?.id)
    setAvailableIngredientOption(availableIngredients)
    closeDropdown()
  }

  const handleQtyChange = (id, newQty) => {
    setSelectedIngredientData((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              qty: newQty,
              totalCostPrice: CalculateTotalPrice(
                Number(ingredient?.item_value_into_gm),
                Number(ingredient?.cost_price),
                Number(newQty),
                ingredient?.selectedUnitOfMeasure,
                unitMeasureData,
              ),
            }
          : ingredient,
      ),
    )
  }

  const handleUnitOfMeasureChange = (id, newValue) => {
    setSelectedIngredientData((prevIngredients) =>
      prevIngredients?.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              selectedUnitOfMeasure: newValue,
              totalCostPrice: CalculateTotalPrice(
                Number(ingredient?.item_value_into_gm),
                Number(ingredient?.cost_price),
                Number(ingredient?.qty),
                newValue,
                unitMeasureData,
              ),
            }
          : ingredient,
      ),
    )
  }

  const handleDeleteIngredient = (id) => {
    const ingredient = ingredientOptionData?.find((ingredient) => ingredient?.id === id)
    ingredient && setAvailableIngredientOption([...availableIngredientOption, ingredient])
    const temp = selectedIngredientData?.filter((ing) => ing?.id !== id)
    setSelectedIngredientData(temp)
  }

  const onSubmit = async (data) => {
    dispatch(showLoader())
    if (selectedIngredientData?.length > 0) {
      const filteredData = selectedIngredientData?.map((ingredient) => ({
        ingredient: ingredient?.id,
        unit_of_measure: ingredient?.selectedUnitOfMeasure,
        qty: ingredient?.qty,
        total_price: ingredient?.totalCostPrice,
      }))
      const paramsData = {
        ingredients: filteredData,
        recipe_name: data?.recipe_name,
        sale_price: data?.sale_price,
        total_cost: data?.total_cost,
        total_cost_percentage: data?.total_cost_percentage,
        sale_profit: data?.sale_profit,
        cost_alert: data?.cost_alert,
        mist_cost: data?.mist_cost,
        PLU_code: data?.PLU_code,
        bar_venue: activeVenue,
      }
      if (recipeId) {
        const response = await UpdateRecipe(paramsData, recipeId)
        if (response?.status === 200) {
          navigate(paths?.owner?.recipes)
        }
      } else {
        const response = await AddNewRecipe(paramsData)
        if (response?.status === 201) {
          navigate(paths?.owner?.recipes)
        }
      }
    } else {
      setShowError(true)
    }
    dispatch(hideLoader())
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: defaultInitialValue,
    validationSchema: addRecipeValidationSchema,
    onSubmit: onSubmit,
  })

  const { errors, touched, setFieldValue, values } = formik

  // this is for the getting the grand total cost and grand total percent
  useEffect(() => {
    if (selectedIngredientData.length > 0) {
      const totalCostOfAll = calculateGrandTotal(selectedIngredientData, parseFloat(values?.mist_cost) || 0)
      setFieldValue('total_cost', totalCostOfAll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIngredientData, values?.mist_cost])

  useEffect(() => {
    if (values?.sale_price > 0 && values?.total_cost > 0) {
      const percentage = (values?.total_cost / values?.sale_price) * 100
      // const percentage = (values?.sale_price / values?.total_cost) * 100
      setFieldValue('total_cost_percentage', percentage.toFixed(2))
      setFieldValue('sale_profit', (values?.sale_price - values?.total_cost).toFixed(2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.total_cost, values?.sale_price])

  return (
    <WhiteCard>
      <FormikProvider value={formik}>
        <Form>
          <div className='grid grid-cols-12 p-4 gap-4 border border-medium-grey rounded-lg md:items-start sm:items-baseline'>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12 md:mb-2'>
              <FormLabel>Recipe name</FormLabel>
              <InputType placeholder={'Type here'} name={'recipe_name'} />
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12 md:mb-2 relative' ref={dropdownRef}>
              <FormLabel>Add ingredients / sub recipes</FormLabel>
              <SearchFilter
                setSearchItem={setSearchItem}
                searchItem={searchItem}
                placeholder={'Search'}
                className={'w-full'}
                iconRight
                onClick={() => toggleDropdown('search_items')}
              />
              {showError && <div className='text-site-red text-sm font-medium'>{'Ingredient is required'}</div>}
              {isOpen === 'search_items' && (
                <div className='origin-top-right p-5 absolute -right-2 mt-5 sm:w-full w-[240px] rounded-lg shadow-cardShadow bg-white z-10 '>
                  <div className='z-0 flex items-center justify-between gap-3 pb-1 relative before:border-transparent before:border-r-[12px] before:border-l-[12px] before:border-b-[16px] before:border-b-white before:absolute before:-top-8 before:-right-1 before:-z-[1]'>
                    <Paragraph text14 className={'text-dark-grey font-semibold'}>
                      From Item ( {availableIngredientOption?.length ?? 0} )
                    </Paragraph>
                  </div>

                  <div className='border border-medium-grey rounded-lg max-h-[280px] overflow-y-auto'>
                    {Array.isArray(availableIngredientOption) &&
                      availableIngredientOption
                        ?.filter((option) => option?.item_name?.toLowerCase().includes(searchItem?.toLowerCase()))
                        ?.map((item, index) => {
                          const isLastItem = index === availableIngredientOption?.length - 1
                          return (
                            <ListItem
                              key={index}
                              defaultItem
                              {...(!isLastItem && { borderBottom: true })}
                              className='mb-0'
                              itemName={item?.item_name}
                              noImg
                              currency={`${generalData?.currency ?? ''}`}
                              subDetail={item?.subDetail}
                              price={item?.cost_price}
                              onClick={() => {
                                handleAddIngrdient(1, unitMeasureOption[0]?.value, item)
                              }}
                              // onClick={() => handleSelectedIngredient(item)}
                            />
                          )
                        })}
                  </div>
                </div>
              )}
              {/* added here for popup */}
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12 md:mb-2'>
              <FormLabel>Sales price</FormLabel>
              <InputGroup
                name='sale_price'
                placeholder='10.00'
                type={'number'}
                prefix={<span>{generalData?.currency ?? ''}</span>}
                error={errors?.sale_price}
              />
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12 md:mb-2'>
              <FormLabel>Total cost</FormLabel>
              <div className='flex items-start'>
                <InputType
                  fullWidth
                  name={'total_cost'}
                  placeholder={'$0.52'}
                  className={'rounded-se-none rounded-ee-none'}
                  disabled
                />
                <InputGroup
                name={'total_cost_percentage'}
                placeholder='0.00'
                postfix={<FiPercent size={18} color='#080808' />}
                className={'rounded-ss-none rounded-es-none border-s-0 '}
                disabled
              />
                {/* <InputType
                  fullWidth
                  name={'total_cost_percentage'}
                  placeholder={'0.00%'}
                  className={'rounded-ss-none rounded-es-none border-s-0 '}
                  disabled
                /> */}
              </div>
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12'>
              <FormLabel>Sales profit</FormLabel>
              <InputGroup
                name={'sale_profit'}
                placeholder='0.00'
                disabled
                prefix={<span>{generalData?.currency ?? ''}</span>}
                error={errors?.sale_profit}
              />
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12'>
              <FormLabel>Cost alert</FormLabel>

              <InputGroup
                name={'cost_alert'}
                placeholder='0.00'
                postfix={<FiPercent size={18} color='#080808' />}
                error={errors?.cost_alert}
              />
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12'>
              <div className='flex items-center gap-2 mb-2'>
                <FormLabel className={'!mb-0'}>Misc. cost </FormLabel>{' '}
                <ToolTip tooltip={'e.g : garnishes, bitters, ice cubes, straws etc'}>
                  <LuInfo fontSize={'20px'} />
                </ToolTip>
              </div>
              <InputGroup
                name={'mist_cost'}
                placeholder='1.33'
                prefix={<span>{generalData?.currency ?? ''}</span>}
                error={errors?.mist_cost}
              />
            </div>
            <div className='xxl:col-span-3 xl:col-span-4 sm:col-span-6 col-span-12'>
              <FormLabel>PLU code</FormLabel>
              <InputType name={'PLU_code'} placeholder={'Type here'} />
            </div>
          </div>
          {selectedIngredientData?.length > 0 && (
            <div className='grid grid-cols-12 p-4 gap-4 border border-medium-grey rounded-lg md:items-start sm:items-end mt-4'>
              <div className='col-span-12 mb-2'>
                <Paragraph text20>List of ingredients</Paragraph>
              </div>
              {selectedIngredientData?.length > 0 &&
                selectedIngredientData?.map((ingredient) => (
                  <div className='md:col-span-6 col-span-12 mb-1'>
                    <div className='border rounded-lg border-medium-grey p-4'>
                      <div className='flex items-center justify-between gap-3 mb-4'>
                        <Paragraph text14 className={'font-semibold'}>
                          <span className='block'>{ingredient?.item_name ?? '--'}</span>
                          <span className='text-dark-grey'>
                            Ingredient - {generalData?.currency ?? ''} {ingredient?.cost_price ?? 0} /{' '}
                            {ingredient?.unit_size}
                            {''}
                            {ingredient?.unit_of_measure?.name}
                          </span>
                        </Paragraph>
                        <button className='' type='button' onClick={() => handleDeleteIngredient(ingredient?.id)}>
                          <img src={IconDelete} alt='icon-delete' />
                        </button>
                      </div>
                      <div className='flex items-center justify-between gap-3 xl:flex-nowrap flex-wrap'>
                        <div className='flex items-center gap-2 xl:flex-nowrap flex-wrap'>
                          <input
                            type='number'
                            className='bg-light-grey border-0 rounded-[2px] sm:text-center text-left p-2 text-xs leading-[18px] font-semibold outline-none sm:w-[115px] w-[50px]'
                            onChange={(e) => handleQtyChange(ingredient.id, e.target.value)}
                            value={ingredient?.qty}
                          />
                          <SelectType
                            sm
                            className={
                              'bg-light-grey p-2 text-xs leading-[18px] font-semibold  xxl:w-[160px] sm:w-[100px] outline-none'
                            }
                            onChange={(option) => {
                              handleUnitOfMeasureChange(ingredient.id, option?.value)
                            }}
                            options={unitMeasureOption}
                            placeholder={'Unit of measure'}
                            value={unitMeasureOption?.find(
                              (option) => option?.value === ingredient?.selectedUnitOfMeasure,
                            )}
                          />
                        </div>
                        <Paragraph text20>
                          <span className='text-dark-grey sm:text-xl text-sm'>Cost: </span>
                          <span>
                            {generalData?.currency ?? ''} {ingredient?.totalCostPrice ?? 0}
                          </span>
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className='flex items-center justify-end gap-4 mt-4'>
            <Button secondary onClick={() => navigate(paths?.owner?.recipes)}>
              Cancel
            </Button>
            <Button primary type='submit'>
              Save
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </WhiteCard>
  )
}

export default AddRecipe

// {isOpen === 'add_ingredients' && selectedIngredient && (
//   <div className='origin-top-right p-5 absolute -right-2 mt-5 sm:w-full w-[220px] rounded-lg shadow-cardShadow bg-white z-10 '>
//     <div className='z-0 relative before:border-transparent before:border-r-[12px] before:border-l-[12px] before:border-b-[16px] before:border-b-white before:absolute before:-top-8 before:-right-1 before:-z-[1]'>
//       <Paragraph text14 className={'font-semibold'}>
//         Selected Item
//       </Paragraph>
//       <Paragraph text14 className={'text-dark-grey font-semibold mb-5'}>
//         {selectedIngredient?.name}
//       </Paragraph>
//       <Paragraph text14 className={'font-semibold mb-2'}>
//         Ingredient quantity
//       </Paragraph>
//       <div className='flex items-center gap-4 md:flex-nowrap flex-wrap'>
//         <div className='flex items-center gap-2'>
//           <input
//             type='text'
//             name='qty'
//             value={qty}
//             onChange={(e) => setQty(e.target.value)}
//             className='bg-light-grey border-b border-medium-grey px-4 py-2 rounded-[2px] max-w-full w-[65px] text-site-black text-sm font-semibold'
//           />
//           {/* <div className='flex items-center bg-light-grey border-b border-medium-grey px-4 py-2 rounded-[2px] max-w-full xxl:w-[85px] w-[100px] text-site-black text-sm font-semibold'> */}
//           {/* <input type='text' value={'fl. oz'} className='bg-transparent w-full' />
//                 <span>
//                   <AiOutlineDollar size={16} />
//                 </span> */}
//           <SelectType
//             sm
//             options={unitMeasureOption}
//             placeholder={'Unit of measure'}
//             onChange={(option) => {
//               // setFieldValue('unit_of_measure', option?.value)
//               setSelectedUnitOfMeasure(option?.label)
//             }}
//             value={unitMeasureOption?.find((option) => option?.label === selectedUnitOfMeasure)}
//           />
//           {/* </div> */}
//         </div>
//         <Paragraph text12 className={'text-dark-grey'}>
//           1L (bottle)
//         </Paragraph>
//       </div>
//       <Button
//         primary
//         className={'w-full mt-5'}
//         disabled={!(qty > 0 && selectedUnitOfMeasure)}
//         // onClick={() => handleAddIngrdient()}
//       >
//         Add Ingredient
//       </Button>
//     </div>
//   </div>
// )}
