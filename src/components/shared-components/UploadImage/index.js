import React, { useEffect, useState } from 'react'
import { Image, Upload, message } from 'antd'

const ImageUpload = ({ setFile, imageUrl }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  useEffect(() => {
    if (imageUrl) {
      setImagePreviewUrl(imageUrl)
    }
  }, [imageUrl])

  const beforeUpload = (file) => {
    const isImage = file.type.indexOf('image/') === 0
    if (!isImage) {
      message.error('Only image files are allowed')
    }
    const isLt2M = file.size / 1024 / 1024 < 3
    if (!isLt2M) {
      message.error('Image must be smaller than 3MB')
    }

    if (isImage && isLt2M) {
      setImagePreviewUrl(URL.createObjectURL(file))
      setFile(file)
    }
    return false
  }

  return (
    <Upload
      name="image"
      listType="picture-card"
      showUploadList={false}
      beforeUpload={beforeUpload}
      accept="image/*"
    >
      {imagePreviewUrl ? (
        <Image
          preview={false}
          src={imagePreviewUrl}
          style={{ maxHeight: '122px', maxWidth: '122px' }}
          alt="Preview"
        />
      ) : (
        '+ Upload'
      )}
    </Upload>
  )
}

export default ImageUpload
