import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import setupAxios from './axios/axiosMiddleware'
import SvgAnimation from './components/core/loader/SvgAnimation'
import { PersistGate } from 'redux-persist/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'))
setupAxios(store)
root.render(
  <BrowserRouter>
    <Suspense fallback={<SvgAnimation />}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </Suspense>
  </BrowserRouter>,
)
