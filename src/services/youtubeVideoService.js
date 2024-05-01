import fetch from 'auth/FetchInterceptor'

const youtubeVideoService = {}

const Route = '/youtubeVideo'

youtubeVideoService.getYoutubeVideos = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

youtubeVideoService.getYoutubeVideoById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

youtubeVideoService.createYoutubeVideo = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

youtubeVideoService.editYoutubeVideo = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/update/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

youtubeVideoService.deleteYoutubeVideo = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default youtubeVideoService
