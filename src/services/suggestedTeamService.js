import fetch from 'auth/FetchInterceptor'

const suggestedTeamService = {}

const Route = '/suggestedTeam'

suggestedTeamService.getSuggestedTeams = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

suggestedTeamService.createSuggestedTeam = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

suggestedTeamService.deleteSuggestedTeam = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default suggestedTeamService
