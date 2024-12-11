import * as Yup from 'yup'

export const addRecipeValidationSchema = () =>
  Yup.object().shape({
    recipe_name: Yup.string()
      .trim()
      .required('Recipe name is required')
      .max(100, 'Recipe name must be less than 100 characters'),
    sale_price: Yup.number()
      .required('Sales price is required')
      .min(0, 'Sales price must be a positive number')
      .test(
        'is-greater-than-or-equal-to-total-cost',
        'Sales price must be greater than or equal to total cost',
        function (value) {
          const { total_cost } = this.parent
          return value >= total_cost
        },
      ),
    total_cost: Yup.number().required('Total cost is required').min(0, 'Total cost must be a positive number'),
    total_cost_percentage: Yup.number()
      .required('Total cost % is required')
      .min(0, 'Total cost percentage must be a positive number')
      .test(
        'is-less-than-or-equal-to-cost-alert',
        'Total cost percentage must be less than or equal to cost alert percentage',
        function (value) {
          const { cost_alert } = this.parent
          return value <= cost_alert
        },
      ),
    sale_profit: Yup.number().required('Sales profit is required').min(0, 'Sales profit must be a positive number'),
    cost_alert: Yup.number().required('Cost alert is required').min(0, 'Cost alert must be a positive number'),
    mist_cost: Yup.number().min(0, 'Miscellaneous cost must be a positive number').nullable(),
    PLU_code: Yup.string().required('PLU code is required').matches(/^\d+$/, 'PLU code must be a numeric string'),
  })
