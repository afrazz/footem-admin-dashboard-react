import fetch from 'auth/FetchInterceptor'

const newsService = {}

const Route = '/news'

newsService.getNews = async function (paginationQuery = '', filterQuery = '') {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

newsService.getNewsById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

newsService.createNews = async function (sendingData) {
  console.log(sendingData, 'yess')
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

newsService.editNews = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/update/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

newsService.deleteNews = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default newsService
