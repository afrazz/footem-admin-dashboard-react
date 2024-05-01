import fetch from 'auth/FetchInterceptor'

const headlineService = {}

const Route = '/headline'

headlineService.getHeadlines = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

headlineService.getHeadlineById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

headlineService.createHeadline = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

headlineService.editHeadline = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/update/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

headlineService.deleteHeadline = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default headlineService
