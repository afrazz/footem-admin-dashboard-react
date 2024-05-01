import React from 'react'
import NewsForm from '../NewsForm'
import { useParams } from 'react-router-dom'

const EditNews = () => {
  const params = useParams()

  return <NewsForm mode="EDIT" param={params} />
}

export default EditNews
