import fetch from 'auth/FetchInterceptor'

const categoryService = {}

const Route = '/category'

categoryService.getCategories = async function (
  paginationQuery = '',
  filterQuery = ''
) {
  const { data } = await fetch({
    url: `${Route}/getAll?${paginationQuery}&${filterQuery}`,
    method: 'get',
  })

  return data
}

categoryService.getCategoryById = async function (id) {
  const { data } = await fetch({
    url: `${Route}/${id}`,
    method: 'get',
  })

  return data
}

categoryService.createCategory = async function (sendingData) {
  const { data } = await fetch({
    url: `${Route}/create`,
    method: 'post',
    data: sendingData,
  })

  console.log(data, 'category')
  return data
}

categoryService.editCategory = async function (id, sendingData) {
  const { data } = await fetch({
    url: `${Route}/update/${id}`,
    method: 'put',
    data: sendingData,
  })

  return data
}

categoryService.deleteCategory = async function (id) {
  const { data } = await fetch({
    url: `${Route}/delete/${id}`,
    method: 'delete',
  })

  return data
}

export default categoryService
