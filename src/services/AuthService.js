import fetch from 'auth/FetchInterceptor'

const AuthService = {}

AuthService.login = async function (sendingData) {
  // const { data } = await fetch({
  //   url: '/auth/login',
  //   method: 'post',
  //   data: sendingData,
  // })

  // console.log(data, 'lnjl')
  // return data
  return fetch({
    url: '/auth/register-or-login-user',
    method: 'post',
    // data: sendingData,
  })
}

AuthService.currentUser = async function () {
  // const { data } = await fetch({
  //   url: '/auth/login',
  //   method: 'post',
  //   data: sendingData,
  // })

  // console.log(data, 'lnjl')
  // return data
  return fetch({
    url: '/auth/current-user',
    method: 'post',
    // data: sendingData,
  })
}

AuthService.register = function (data) {
  return fetch({
    url: '/auth/register',
    method: 'post',
    data: data,
  })
}

// New Add

// AuthService.LoginUser = function (data) {
//   return fetch({
//     url: '/auth/register-or-login-user',
//     method: 'post',
//     data: data,
//   })
// }

export default AuthService
