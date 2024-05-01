import React, { useState, useEffect, useRef } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import userService from 'services/userService'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const UserForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  //   const [uploadedImg, setImage] = useState(null)
  //   const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  // const [uploadedBanner, setBannerImage] = useState(null)

  // const {
  //   fileList: fileListImages,
  //   beforeUpload: beforeUploadImages,
  //   onChange: onChangeImages,
  //   onRemove: onRemoveImages,
  //   setFileList: setFileListImages,
  // } = useUpload(1)

  // Banner
  // const {
  //   fileList: fileListBannerImages,
  //   beforeUpload: beforeUploadBannerImage,
  //   onChange: onChangeBannerImage,
  //   onRemove: onRemoveBannerImage,
  //   setFileList: setFileListBannerImage,
  // } = useUpload(1)

  useEffect(() => {
    if (mode === EDIT) {
      const fetchUserById = async () => {
        const { id } = param
        const data = await userService.getUserById(id)
        if (data) {
          console.log(data, 'user-data-id')
          // let himg = []
          // if (data.image) {
          //   himg = [
          //     {
          //       uid: Math.random() * 1000,
          //       name: Utils.getBaseName(data.image),
          //       url: data.image,
          //       thumbUrl: data.image,
          //     },
          //   ]

          //   setImage(himg)
          //   // setFileListImages(himg)
          // }
          // if (data.banner) {
          //   himg = [
          //     {
          //       uid: Math.random() * 1000,
          //       name: Utils.getBaseName(data.banner),
          //       url: data.banner,
          //       thumbUrl: data.banner,
          //     },
          //   ]

          //   setBannerImage(himg)
          //   // setFileListBannerImage(himg)
          // }
          form.setFieldsValue({
            username: data.username,
            email: data.email,
            accessManagment: data.accessManagment,
          })
        } else {
          navigate('/app/dashboards/users/users-list')
        }
      }

      fetchUserById()
    }
    // else {
    //   // getCategories(ADD)
    // }
  }, [form, mode, param, props])

  // const propsImages = {
  //   multiple: true,
  //   beforeUpload: beforeUploadImages,
  //   onRemove: onRemoveImages,
  //   onChange: onChangeImages,
  //   fileList: fileListImages,
  // }

  // useEffect(() => {
  //   console.log(fileListImages, 'hey-me')
  //   setImage(fileListImages)
  // }, [fileListImages])

  // const propsBannerImage = {
  //   multiple: false,
  //   beforeUpload: beforeUploadBannerImage,
  //   onRemove: onRemoveBannerImage,
  //   onChange: onChangeBannerImage,
  //   fileList: fileListBannerImages,
  // }
  // useEffect(() => {
  //   setBannerImage(fileListBannerImages)
  // }, [fileListBannerImages])

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        console.log(values, 'hererer')
        // values.tags=tags
        if (mode === ADD) {
          const created = await userService.createUser(values)
          if (created) {
            message.success(`Created ${values.username} to Users list`)
            navigate(-1)
          }
        }
        if (mode === EDIT) {
          // // Checking if image exists
          // if (uploadedImg.length !== 0 && uploadedImg !== null) {

          //   const imageCategory = imageCategories.find(
          //     (imgCat) => imgCat.imageFor === 'Categories'
          //   )
          //   const imgValue = await singleImageUploader(
          //     uploadedImg[0].originFileObj,
          //     uploadedImg,
          //     uploadedImg[0].url,
          //     imageCategory.id
          //   )
          //   values.image = imgValue
          // } else {
          //   values.image = null
          // }
          //checking banner exists
          // if (uploadedBanner.length !== 0 && uploadedBanner !== null) {
          //   const imageCategory = imageCategories.find(
          //     (imgCat) => imgCat.imageFor === 'CategoryBanners'
          //   )
          //   console.log('uploadedBanner', uploadedBanner)
          //   const bannerValue = await singleImageUploader(
          //     uploadedBanner[0].originFileObj,
          //     uploadedBanner,
          //     uploadedBanner[0].url,
          //     imageCategory.id
          //   )
          //   values.banner = bannerValue
          // } else {
          //   values.banner = null
          // }
          console.log('getting-heheheh')
          if (!values.password) delete values.password

          const edited = await userService.editUser(param.id, values)
          if (edited) {
            message.success(`Edited ${values.username} to Users list`)
            navigate(-1)
          }
        }
        setSubmitLoading(false)
      })
      .catch((info) => {
        setSubmitLoading(false)
        console.log('info', info)
        message.error('Please enter all required field ')
      })
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          status: 'Hold',
          accessManagment: ['analytics'],
        }}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="space-between"
              alignItems="center"
            >
              <h2 className="mb-3">
                {mode === 'ADD' ? 'Add New User' : `Edit User`}{' '}
              </h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() => navigate('/app/dashboards/users/users-list')}
                >
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {mode === 'ADD' ? 'Add' : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField
                // uploadedImg={uploadedImg}
                form={form}
                mode={mode}
                // uploadLoading={uploadLoading}
                // handleUploadChange={handleUploadChange}
              />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default UserForm
