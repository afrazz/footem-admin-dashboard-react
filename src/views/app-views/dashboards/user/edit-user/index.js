import React from 'react'
import UserForm from '../UserForm'
import { useParams } from 'react-router-dom'

const EditProduct = () => {
  const params = useParams()

  return <UserForm mode="EDIT" param={params} />
}

export default EditProduct
