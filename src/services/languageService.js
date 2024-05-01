import fetch from 'auth/FetchInterceptor'

const languageService = {}

const Route = '/language'

languageService.getlanguages = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

languageService.getlanguageById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

languageService.createLanguage = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  return data
}

languageService.editLanguage = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/update/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

languageService.deleteLanguage = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default languageService
