import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  AUTH_PREFIX_PATH,
  UNAUTHENTICATED_ENTRY,
  REDIRECT_URL_KEY,
} from 'configs/AppConfig'

const ProtectedRoute = () => {
  const { token, pageLoading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!pageLoading) {
    // setTimeout(() => {
    if (!token) {
      return (
        <Navigate
          to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}?${REDIRECT_URL_KEY}=${location.pathname}`}
          replace
        />
      )
    }
    // }, 500)
  }

  return <Outlet />
}

export default ProtectedRoute
