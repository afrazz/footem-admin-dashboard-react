import React, { useEffect } from 'react'
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import { APP_PREFIX_PATH, AUTHENTICATED_ENTRY } from 'configs/AppConfig'
import { protectedRoutes, publicRoutes } from 'configs/RoutesConfig'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AppRoute from './AppRoute'
import { useDispatch, useSelector } from 'react-redux'
import Loading from 'components/shared-components/Loading'
import { auth } from 'auth/FirebaseAuth'
import AuthService from 'services/AuthService'
import { AUTH_TOKEN } from 'constants/AuthConstant'
import {
  authenticated,
  getCurrentUser,
  setPageLoading,
  setToken,
} from 'store/slices/authSlice'

const Routes = () => {
  const { pageLoading, user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(setPageLoading(true))
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const { token } = await user.getIdTokenResult(true)

        await dispatch(setToken(token))
        // await window.localStorage.setItem(AUTH_TOKEN, token)
        console.log(user, 'user-changed')
        if (token) {
          await dispatch(getCurrentUser(token))
          // const { data } = await AuthService.currentUser()
          // if (data?.user) {
          //   dispatch(authenticated({ token: token, user: data.user }))
          // }
        }

        // Redux Store

        // currentUser(idTokenResult.token)
        //   .then((res) => {
        //     dispatch({
        //       type: 'LOGGED_IN_USER',
        //       payload: {
        //         name: res.data.name,
        //         email: res.data.email,
        //         token: idTokenResult.token,
        //         role: res.data.role,
        //         _id: res.data._id,
        //       },
        //     })
        //   })
        //   .catch(console.log)
      }
      dispatch(setPageLoading(false))
    })

    // Clean Up
    return () => unsubscribe()
  }, [])

  return (
    <>
      {pageLoading ? (
        <Loading cover="content" />
      ) : (
        <RouterRoutes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <Navigate
                  replace
                  to={
                    AUTHENTICATED_ENTRY
                    // user.accessManagment.includes('analytic') ||
                    // user.role === 'Admin'
                    //   ? AUTHENTICATED_ENTRY
                    //   : `${APP_PREFIX_PATH}/dashboards/${user.accessManagment[0]}`
                  }
                />
              }
            />
            {protectedRoutes.map((route, index) => {
              return (
                <Route
                  key={route.key + index}
                  path={route.path}
                  element={
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  }
                />
              )
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/" element={<PublicRoute />}>
            {publicRoutes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  }
                />
              )
            })}
          </Route>
        </RouterRoutes>
      )}
    </>
  )
}

export default Routes
