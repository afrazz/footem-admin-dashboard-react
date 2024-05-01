import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import navigationConfig from 'configs/NavigationConfig'
import { AUTH_TOKEN } from 'constants/AuthConstant'
import _ from 'lodash'
import AuthService from 'services/AuthService'
import FirebaseService from 'services/FirebaseService'

export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: null,
  user: null,
  pageLoading: true,
  navigationData: [],
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (data, { dispatch, rejectWithValue }) => {
    const { email, password } = data
    // const userData = await AuthService.login({ email, password })

    // if (userData.token) {
    //   const token = userData.token
    //   localStorage.setItem(AUTH_TOKEN, token)
    //   localStorage.setItem('User', userData.user)

    //   dispatch(authenticated(userData))

    //   return { token, user: userData.user }
    //   //     localStorage.setItem(AUTH_TOKEN, response.user.refreshToken)
    //   //     return token
    //   //   dispatch(authenticated())
    // }

    try {
      const response = await FirebaseService.signInEmailRequest(email, password)
      if (response.user) {
        console.log(response.user, 'getting-user')
        const { token } = await response.user.getIdTokenResult()

        await dispatch(setToken(token))

        // await localStorage.setItem(AUTH_TOKEN, token)

        const { data } = await AuthService.login()

        return { token, user: data.user }
      } else {
        return rejectWithValue(response.message?.replace('Firebase: ', ''))
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error')
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/currentUser',
  async (token, { dispatch, rejectWithValue }) => {
    // const userData = await AuthService.login({ email, password })

    // if (userData.token) {
    //   const token = userData.token
    //   localStorage.setItem(AUTH_TOKEN, token)
    //   localStorage.setItem('User', userData.user)

    //   dispatch(authenticated(userData))

    //   return { token, user: userData.user }
    //   //     localStorage.setItem(AUTH_TOKEN, response.user.refreshToken)
    //   //     return token
    //   //   dispatch(authenticated())
    // }

    const { data } = await AuthService.currentUser()
    if (data.user) {
      const user = data.user
      if (user.role === 'SubAdmin') {
        // let updateSideBar = [...navigationConfig]
        let updateSideBar = _.cloneDeep(navigationConfig)
        // console.log(navigationData, 'navigationData')
        const subMenus = updateSideBar[0].submenu.filter((menu) =>
          user.accessManagment.includes(menu.key)
        )

        updateSideBar[0].submenu = subMenus

        dispatch(setNavigationData(updateSideBar))
      } else if (user.role === 'Admin') {
        dispatch(setNavigationData(navigationConfig))
      }

      return { token, user: data.user }
    }
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    const { email, password } = data

    try {
      const response = await FirebaseService.signUpEmailRequest(email, password)
      if (response.user) {
        const token = response.user.refreshToken
        // localStorage.setItem(AUTH_TOKEN, response.user.refreshToken)
        return token
      } else {
        return rejectWithValue(response.message?.replace('Firebase: ', ''))
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Error')
    }
  }
)

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const response = await FirebaseService.signOutRequest()
  // localStorage.removeItem(AUTH_TOKEN)
  // localStorage.removeItem('User')
  return response.data
})

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    const response = await FirebaseService.signInGoogleRequest()
    if (response.user) {
      const token = await response.user.getIdTokenResult()
      // localStorage.setItem(AUTH_TOKEN, token)
      return token
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''))
    }
  }
)

export const signInWithFacebook = createAsyncThunk(
  'auth/signInWithFacebook',
  async (_, { rejectWithValue }) => {
    const response = await FirebaseService.signInFacebookRequest()
    if (response.user) {
      const token = response.user.refreshToken
      // localStorage.setItem(AUTH_TOKEN, response.user.refreshToken)
      return token
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''))
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      console.log(state.loading, action.payload.token, 'auteheh')
      state.loading = false
      state.redirect = '/'
      state.token = action?.payload?.token
      state.user = action?.payload?.user
    },
    updateUserInfo: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload
      state.showMessage = true
      state.loading = false
    },
    hideAuthMessage: (state) => {
      state.message = ''
      state.showMessage = false
    },
    signOutSuccess: (state) => {
      state.loading = false
      state.token = null
      state.redirect = '/'
    },
    showLoading: (state) => {
      state.loading = true
    },
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload
    },
    signInSuccess: (state, action) => {
      state.loading = false
      state.token = action.payload
    },
    setNavigationData: (state, action) => {
      state.navigationData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true
      })
      .addCase(signIn.fulfilled, (state, action) => {
        console.log(action.payload, 'THE-USER-DATA')
        state.loading = false
        state.redirect = '/'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.token = null
        state.redirect = '/'
        state.token = null
        state.user = null
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false
        state.token = null
        state.redirect = '/'
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = '/'
        state.token = action.payload
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = '/'
        state.token = action.payload
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(signInWithFacebook.pending, (state) => {
        state.loading = true
      })
      .addCase(signInWithFacebook.fulfilled, (state, action) => {
        state.loading = false
        state.redirect = '/'
        state.token = action.payload
      })
      .addCase(signInWithFacebook.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.loading = false
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.pageLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log(action.payload, 'THE-USER-DATA')
        state.redirect = '/'
        state.token = action.payload.token
        state.user = action.payload.user
        state.pageLoading = false
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.message = action.payload
        state.showMessage = true
        state.pageLoading = false
      })
  },
})

export const {
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  setPageLoading,
  signInSuccess,
  setToken,
  setNavigationData,
  updateUserInfo,
} = authSlice.actions

export default authSlice.reducer
