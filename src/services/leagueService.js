import fetch from 'auth/FetchInterceptor'

const leagueService = {}

const Route = '/league'

leagueService.getLeagues = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

leagueService.createLeague = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

leagueService.deleteLeague = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default leagueService
