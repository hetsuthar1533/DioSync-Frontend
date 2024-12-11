import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/lib/storage/session'
import userReducer from './slices/userSlice'
import toastReducer from './slices/toastSlice'
import siteLoaderReducer from './slices/siteLoaderSlice'
import venueReducer from './slices/ownerVenueSlice'
import loadDataReducer from './slices/loadDataSlice'
import generalDataReducer from './slices/generalDataSlice'
import cartSupplierReducer from './slices/cartSupplierSlice'

const persistConfig = {
  key: 'DioSync',
  storage: sessionStorage,
  whitelist: ['user', 'venue'],
}

const rootReducer = combineReducers({
  venue: venueReducer,
  user: userReducer,
  toast: toastReducer,
  siteLoader: siteLoaderReducer,
  loadData: loadDataReducer,
  generalData: generalDataReducer,
  cartSupplier: cartSupplierReducer,
})

export default persistReducer(persistConfig, rootReducer)
