import fetch from 'auth/FetchInterceptor'

const analyticsService = {}

const Route = '/analytics'

analyticsService.getUsersAnalytics = async function () {
  const { data } = await fetch({
    url: `${Route}/users/getAll`,
    method: 'get',
  })

  return data
}

export default analyticsService
