import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { paths } from './path'
import { useSelector } from 'react-redux'
import { tokenSelector, userTypeSelector } from '../redux/slices/userSlice'
import { userRoles } from '../constants/roleConstants'

function GuestRoute({ children }) {
  const location = useLocation()
  const userType = useSelector(userTypeSelector)
  const token = useSelector(tokenSelector)
  const isToken = token ? true : false
  const renderDashboard =
    userType === userRoles.Owner
      ? paths.owner.dashboard
      : userType === userRoles.Manager
        ? paths.manager.dashboard
        : paths.admin.dashboard

  if (isToken) {
    // Redirect them to the home page if they are logged
    return <Navigate to={renderDashboard} state={{ from: location }} />
  }

  return children
}

export default GuestRoute
