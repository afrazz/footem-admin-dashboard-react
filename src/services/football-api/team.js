import fetch from 'auth/FetchInterceptor'
import leagueTeamsData from 'mock/data/leagueTeamsData'

const teamsFootballApiService = {}

const Route = '/football/teams'

// For Football APi
teamsFootballApiService.getAllTeamsData = async function (query) {
  const { data } = await fetch({
    url: `${Route}/getAll`,
    method: 'get',
    params: query,
  })

  return data.response
  // return leagueTeamsData
}

export default teamsFootballApiService
