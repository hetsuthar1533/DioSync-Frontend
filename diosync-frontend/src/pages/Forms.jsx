import React, { useState } from 'react'
import { Formik } from 'formik'
import InputType from '../components/core/formComponents/InputType'
import Button from '../components/core/formComponents/Button'
import WhiteCard from '../components/themeComponents/WhiteCard'
import Chart from 'react-apexcharts'
import Paragraph from '../components/core/typography/Paragraph'
import 'react-datepicker/dist/react-datepicker.css'
import ThemeDatePicker from '../components/core/formComponents/ThemeDatePicker'

function Forms() {
  const state = {
    options: {
      chart: {
        id: 'apexchart-example',
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  }
  const [startDate, setStartDate] = useState(new Date())
  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          const errors = {}
          if (!values.email) {
            errors.email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-6'>
                <InputType placeholder='Email' type='email' name='email' onBlur={handleBlur} />
              </div>
              <div className='col-span-6'>
                <InputType placeholder='Password' type='password' name='password' onBlur={handleBlur} />
                {errors.password && touched.password && errors.password}
              </div>
              <div className='col-span-12'>
                <Button primary type='submit' disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
      <div className='grid grid-cols-12 gap-6'>
        <div className='col-span-6'>
          <WhiteCard>
            <div className='flex items-center justify-between gap-4'>
              <Paragraph text20>Sales Overview</Paragraph>
            </div>
            <Chart options={state.options} series={state.series} type='area' width={'100%'} height={320} />
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
      </div>
    </div>
  )
}

export default Forms
