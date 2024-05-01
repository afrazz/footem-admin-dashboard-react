import fetch from 'auth/FetchInterceptor'
import leagueData from 'mock/data/leagueData'

const leagueFootballApiService = {}

const Route = '/football/leagues'

// For Football APi
leagueFootballApiService.getAllLeaguesData = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data.response
  // return leagueData
}

export default leagueFootballApiService
