import SiteLoader from './components/core/loader/SiteLoader'
import ToastNotification from './components/core/toastNotification/ToastNotification'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <SiteLoader />
      <AppRoutes />
      <ToastNotification />
    </>
  )
}

export default App
