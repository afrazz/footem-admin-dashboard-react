import React from 'react'
import YoutubeVideoForm from '../YoutubeVideoForm'
import { useParams } from 'react-router-dom'

const EditYoutubeVideo = () => {
  const params = useParams()

  return <YoutubeVideoForm mode="EDIT" param={params} />
}

export default EditYoutubeVideo
