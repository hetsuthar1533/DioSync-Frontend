/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import FormLabel from '../../../components/core/typography/FormLabel'
import InputType from '../../../components/core/formComponents/InputType'
import ToolTip from '../../../components/core/ToolTip'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import Checkbox from '../../../components/core/formComponents/Checkbox'
import Button from '../../../components/core/formComponents/Button'
import SelectType from '../../../components/core/formComponents/SelectType'
import { useDispatch, useSelector } from 'react-redux'
import { userSelector } from '../../../redux/slices/userSlice'
import { GetVenueDropdownData } from '../../../services/barOwnerService'
import { AddNewBarManager, GetAllPermissionModules, UpdateBarManager } from '../../../services/barManagerService'
import { addBarManagerValidationSchema } from '../../../validations/owner/addBarManagerValidationSchema'
import { hideLoader, showLoader } from '../../../redux/slices/siteLoaderSlice'

function AddBarManager({ onClose, selectedItem, getAllBarManagerData }) {
  const dispatch = useDispatch()
  const owner = useSelector(userSelector)
  const [options, setOptions] = useState([])
  const [permissionModulesData, setPermissionModulesData] = useState([])
  const [selectedModules, setSelectedModules] = useState([])
  const [defaultInitialValues, setDefaultInitialValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bar_vanue: '',
    modules: [],
  })

  useEffect(() => {
    getAllPermissionModules()
  }, [])

  useEffect(() => {
    if (owner?.id) {
      fetchAllVenues(owner?.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner?.id])

  useEffect(() => {
    if (selectedItem) {
      setDefaultInitialValues({
        first_name: selectedItem?.first_name,
        last_name: selectedItem?.last_name,
        email: selectedItem?.email,
        bar_vanue: selectedItem?.bar_venue?.name,
      })
    }

    if (permissionModulesData?.length > 0) {
      const matchedValues = permissionModulesData
        ?.filter((option) => selectedItem?.modules?.some((module) => Number(module?.id) === Number(option?.value)))
        .map((option) => option.value)

      setSelectedModules(matchedValues)
    }
  }, [selectedItem, permissionModulesData])

  const getAllPermissionModules = async () => {
    const response = await GetAllPermissionModules()
    if (response?.data) {
      const resp = response?.data?.success?.map((data) => {
        return { label: data?.module_name, value: data?.id }
      })
      resp && setPermissionModulesData(resp)
    }
  }

  const fetchAllVenues = async (id) => {
    if (id) {
      const response = await GetVenueDropdownData(id)
      if (response?.data?.data) {
        const resp = response?.data?.data?.results?.map((data) => {
          return { label: data?.name, value: data?.id }
        })
        resp && setOptions(resp)
      }
    }
  }

  const OnSubmit = async (data) => {
    dispatch(showLoader())

    if (selectedItem?.id) {
      const paramsData = {
        bar_venue: selectedItem?.bar_venue?.id,
        modules: selectedModules,
      }
      const response = await UpdateBarManager(selectedItem?.id, paramsData)
      if (response?.status === 200) {
        onClose()
        getAllBarManagerData?.()
      }
    } else {
      const paramsData = {
        ...data,
        modules: selectedModules,
      }
      const response = await AddNewBarManager(paramsData)
      if (response?.status === 201) {
        onClose()
        getAllBarManagerData?.()
      }
    }
    dispatch(hideLoader())
  }

  const handleCheckboxChange = (id, isChecked) => {
    if (isChecked) {
      setSelectedModules([...selectedModules, id])
    } else {
      setSelectedModules(selectedModules.filter((moduleId) => moduleId !== id))
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultInitialValues}
      validationSchema={addBarManagerValidationSchema}
      onSubmit={OnSubmit}
    >
      {({ isSubmitting, handleBlur, values, setFieldValue, errors }) => (
        <Form>
          <div className='grid grid-cols-12 gap-4'>
            <div className='md:col-span-6 col-span-12 mb-1'>
              <FormLabel>First name</FormLabel>
              <InputType name={'first_name'} placeholder={'Type here'} disabled={selectedItem?.id} />
            </div>
            <div className='md:col-span-6 col-span-12 mb-1'>
              <FormLabel>Last name</FormLabel>
              <InputType name={'last_name'} placeholder={'Type here'} disabled={selectedItem?.id} />
            </div>
            <div className='col-span-12 mb-1'>
              <FormLabel>Email</FormLabel>
              <InputType type={'mail'} name={'email'} placeholder={'Type here'} disabled={selectedItem?.id} />
            </div>
            <div className='col-span-12 mb-1'>
              <FormLabel>Choose restaurant</FormLabel>
              {selectedItem?.id ? (
                <>
                  <InputType name={'bar_vanue'} placeholder={'Type here'} disabled />
                </>
              ) : (
                <SelectType
                  options={options}
                  placeholder={'Select'}
                  value={options?.find((option) => option?.value === values?.bar_vanue) || ''}
                  onChange={(option) => {
                    setFieldValue('bar_vanue', option?.value)
                  }}
                  error={errors?.bar_vanue}
                  fullWidth={'!w-full'}
                />
              )}
            </div>

            <div className='col-span-12 mb-1'>
              <div className='relative rounded-lg border border-medium-grey overflow-y-hidden'>
                <table className='w-full text-sm leading-[22px] font-semibold text-center'>
                  <thead className='text-sm leading-[22px] font-semibold text-site-black bg-light-grey'>
                    <tr className='border-b border-medium-grey'>
                      <th className='py-3 px-6'>
                        <span className={'flex items-center justify-center gap-2'}>
                          Modules
                          <ToolTip tooltip={'Modules'} position={''}>
                            <AiOutlineQuestionCircle />
                          </ToolTip>
                        </span>
                      </th>
                      <th className='py-3 px-6'>
                        <span className={'flex items-center justify-center gap-2'}>
                          Permission
                          <ToolTip tooltip={'Permission '} position={''}>
                            <AiOutlineQuestionCircle />
                          </ToolTip>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionModulesData?.map((module) => (
                      <tr key={module?.id}>
                        <td className='py-3 px-6 relative'>{module.label}</td>
                        <td className='py-3 px-6 relative'>
                          <Checkbox
                            w15
                            name={'permissions'}
                            id={`modules_${module.id}`}
                            value={module.value.toString()}
                            checked={selectedModules.includes(module.value)}
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              handleCheckboxChange(module.value, isChecked)
                            }}
                          ></Checkbox>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='col-span-12'>
              <div className='flex items-center justify-end gap-4'>
                <Button secondary onClick={onClose}>
                  Cancel
                </Button>
                <Button primary type={'submit'}>
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

export default AddBarManager
