import { persistStore } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { setRefreshToken, setToken } from './slices/userSlice'

const Middlewares = []

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(Middlewares),
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

window.addEventListener('storage', (event) => {
  if (event.storageArea === sessionStorage && !sessionStorage.getItem('persist:diosync')) {
    store.dispatch({ type: 'user/clearUser' }) // Adjust the action to match your needs
    persistor.purge() // Clear persisted state
  }
})

const exportStore = { store, persistor }

export default exportStore
