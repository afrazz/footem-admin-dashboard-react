import React from 'react'
import LanguageForm from '../LanguageForm'
import { useParams } from 'react-router-dom'

const EditProduct = () => {
  const params = useParams()

  return <LanguageForm mode="EDIT" param={params} />
}

export default EditProduct
