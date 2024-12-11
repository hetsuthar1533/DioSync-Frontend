import * as Yup from 'yup'

export const addNewRefernceValidationSchema = () =>
  Yup.object().shape({
    item_name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Item name is required'),
    brand_name: Yup.string().trim().max(50, 'Maximum 50 Characters allowed'),
    category: Yup.string().required('Category name is required'),
    sub_category: Yup.string(),
    barcode: Yup.string().trim(),
    vendor: Yup.string().required('Supplier name is required'),
    unit_size: Yup.number().typeError('Unit size must be a number').required('Unit size is required').min(1),
    unit_of_measure: Yup.string().required('Unit of measure is required'),
    container: Yup.string().required('Container is required'),
    cost_price: Yup.number().typeError('Cost price must be a number').min(1).required('Cost price is required'),
    alc_per_volume: Yup.number()
      .typeError('Alcohol per volume must be a number')
      .required('Alcohol per volume is required'),
    PLU_code: Yup.string().trim(),
    sell_price: Yup.number().typeError('Sell price must be a number'),
    tare_or_weight: Yup.number().nullable().typeError('Full item weight must be a number'),
    tare_or_weight_checked: Yup.boolean(),
    tare_or_weight_empty: Yup.number().nullable().typeError('Empty item weight must be a number'),
    tare_or_weight_empty_checked: Yup.boolean(),
    tare_and_weight_validation: Yup.mixed().test(
      'tare-and-weight-validation',
      'Please ensure all weight fields and checkboxes are filled correctly',
      function (value, context) {
        const { tare_or_weight, tare_or_weight_checked } = context.parent

        // Validation for tare_or_weight
        if (tare_or_weight && !tare_or_weight_checked) {
          return this.createError({
            path: 'tare_or_weight_checked',
            message: 'Checkbox is required when a value is entered',
          })
        }
        if (tare_or_weight_checked && !tare_or_weight) {
          return this.createError({
            path: 'tare_or_weight',
            message: 'Full item weight is required when the checkbox is checked',
          })
        }
        return true
      },
    ),
    tare_and_empty_validation: Yup.mixed().test(
      'tare-and-empty-validation',
      'Please ensure all weight fields and checkboxes are filled correctly',
      function (value, context) {
        const { tare_or_weight_empty, tare_or_weight_empty_checked } = context.parent
        // Validation for tare_or_weight_empty
        if (tare_or_weight_empty_checked && !tare_or_weight_empty) {
          return this.createError({
            path: 'tare_or_weight_empty',
            message: 'Empty item weight is required when the checkbox is checked',
          })
        }
        if (tare_or_weight_empty && !tare_or_weight_empty_checked) {
          return this.createError({
            path: 'tare_or_weight_empty_checked',
            message: 'Checkbox is required when a value is entered',
          })
        }

        return true
      },
    ),
  })

export const addNewRefernceValidationSchemawithIndividual = () =>
  Yup.object().shape({
    item_name: Yup.string()
      .trim()
      .max(50, 'Maximum 50 Characters allowed')
      .min(1, 'Minimum 1 Characters required')
      .required('Item name is required'),
    brand_name: Yup.string().trim().max(50, 'Maximum 50 Characters allowed'),
    // .required('Item brand is required'),
    category: Yup.string().required('Category name is required'),
    sub_category: Yup.string(), //.required('Subcategory name is required'),
    barcode: Yup.string().trim(), //.required('Barcode is required'),
    vendor: Yup.string().required('Supplier name is required'),
    unit_size: Yup.number().typeError('Unit size must be a number').required('Unit size is required').min(1),
    unit_of_measure: Yup.string().required('Unit of measure is required'),
    container: Yup.string().required('Container is required'),
    cost_price: Yup.number().typeError('Cost price must be a number').min(1).required('Cost price is required'),
    alc_per_volume: Yup.number()
      .typeError('Alcohol per volume must be a number')
      .required('Alcohol per volume is required'),
    PLU_code: Yup.string().trim().required('PLU code is required'),
    sell_price: Yup.number().typeError('Sell price must be a number').required('Sell price is required'),
    tare_or_weight: Yup.number().nullable().typeError('Full item weight must be a number'),
    tare_or_weight_checked: Yup.boolean(),
    tare_or_weight_empty: Yup.number().nullable().typeError('Empty item weight must be a number'),
    tare_or_weight_empty_checked: Yup.boolean(),
    tare_and_weight_validation: Yup.mixed().test(
      'tare-and-weight-validation',
      'Please ensure all weight fields and checkboxes are filled correctly',
      function (value, context) {
        const { tare_or_weight, tare_or_weight_checked } = context.parent

        // Validation for tare_or_weight
        if (tare_or_weight && !tare_or_weight_checked) {
          return this.createError({
            path: 'tare_or_weight_checked',
            message: 'Checkbox is required when a value is entered',
          })
        }
        if (tare_or_weight_checked && !tare_or_weight) {
          return this.createError({
            path: 'tare_or_weight',
            message: 'Full item weight is required when the checkbox is checked',
          })
        }
        return true
      },
    ),
    tare_and_empty_validation: Yup.mixed().test(
      'tare-and-empty-validation',
      'Please ensure all weight fields and checkboxes are filled correctly',
      function (value, context) {
        const { tare_or_weight_empty, tare_or_weight_empty_checked } = context.parent
        // Validation for tare_or_weight_empty
        if (tare_or_weight_empty_checked && !tare_or_weight_empty) {
          return this.createError({
            path: 'tare_or_weight_empty',
            message: 'Empty item weight is required when the checkbox is checked',
          })
        }
        if (tare_or_weight_empty && !tare_or_weight_empty_checked) {
          return this.createError({
            path: 'tare_or_weight_empty_checked',
            message: 'Checkbox is required when a value is entered',
          })
        }

        return true
      },
    ),
  })

// bar_venue
// item_name
// brand_name
// category
// sub_category
// barcode
// vendor
// unit_size
// unit_of_measure
// container
// case_size
// cost_price
// is_sold_individually
// alc_per_volume
// PLU_code
// sell_price
// tare_or_weight_checked
// tare_or_weight
// tare_or_weight_unit_of_measure
// tare_or_weight_empty_checked
// tare_or_weight_empty
// tare_or_weight_unit_of_measure_empty
