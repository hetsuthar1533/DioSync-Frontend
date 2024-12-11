import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, tokenSelector, userTypeSelector } from '../../redux/slices/userSlice' // Adjust import as needed
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { paths } from '../../routes/path'

function SecurityCheck() {
  const token = useSelector(tokenSelector)
  const userType = useSelector(userTypeSelector)
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (!token && !userType) {
      dispatch(clearUser()) // Clear user data from Redux if token is invalid
    }
  }, [token, dispatch])

  const isAuthenticated = Boolean(token && userType)

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default SecurityCheck
