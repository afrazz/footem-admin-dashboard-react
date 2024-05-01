import fetch from 'auth/FetchInterceptor'

const userService = {}

const Route = '/user'

userService.updateUserInfo = async (sendingData) => {
  const { data } = await fetch({
    url: `${Route}/profile/updateInfo`,
    method: 'put',
    data: sendingData,
  })

  return data
}

userService.getUsers = async function (paginationQuery = '', filterQuery = '') {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

userService.getUserById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

userService.createUser = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  console.log(data, 'category')
  return data
}

userService.editUser = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

userService.deleteUser = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

userService.sendNoticationNewsToUsers = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/sendNewsNotificationToUsers`,
    method: 'post',
    data: sendingData,
  })

  console.log(data, 'sendNewsNotificationToUsers')
  return data
}

export default userService
