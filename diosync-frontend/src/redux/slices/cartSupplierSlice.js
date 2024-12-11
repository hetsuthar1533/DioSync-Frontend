import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  suppliers: [],
}

const cartSupplierSlice = createSlice({
  name: 'cartSupplier',
  initialState,
  reducers: {
    setSupplierData: (state, action) => {
      state.suppliers = action.payload
    },
    updateEmailSubject: (state, action) => {
      const { supplierId, subject } = action.payload
      const supplier = state.suppliers.find((sup) => sup.id === supplierId)
      if (supplier) {
        supplier.email_template.subject = subject
      }
    },
    updateEmailContent: (state, action) => {
      const { supplierId, content } = action.payload
      const supplier = state.suppliers.find((sup) => sup.id === supplierId)
      if (supplier) {
        supplier.email_template.content = content
      }
    },
  },
})

export const { setSupplierData, updateEmailSubject, updateEmailContent } = cartSupplierSlice.actions

export default cartSupplierSlice.reducer
