import React from 'react'
import HeadlineForm from '../HeadlineForm'
import { useParams } from 'react-router-dom'

const EditProduct = () => {
  const params = useParams()

  return <HeadlineForm mode="EDIT" param={params} />
}

export default EditProduct
