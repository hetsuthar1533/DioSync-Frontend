import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  item:{

  },
  category:{

  },
  subcategory:{

  }

}

const ItemSlice = createSlice({
  name: 'cartSupplier',
  initialState,
  reducers: {
    ItemData: (state, action) => {
      state.item = action.payload
    },
    Category:(state,action)=>{
        state.category=action.payload
    },
    subcategory:(state,action)=>{
        state.subcategory=action.payload
    }
  },
})

export const { ItemData,Category,subcategory } = ItemSlice.actions

export default ItemSlice.reducer
