import React, { Component } from 'react'
import {
  Form,
  Avatar,
  Button,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Upload,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { ROW_GUTTER } from 'constants/ThemeConstant'
import Flex from 'components/shared-components/Flex'
import { useDispatch, useSelector } from 'react-redux'
import userService from 'services/userService'
import { updateUserInfo } from 'store/slices/authSlice'

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  //   const getBase64 = (img, callback) => {
  //     const reader = new FileReader()
  //     reader.addEventListener('load', () => callback(reader.result))
  //     reader.readAsDataURL(img)
  //   }

  const onFinish = async (values) => {
    const key = 'updatable'
    message.loading({ content: 'Updating...', key })

    const username = values.username

    const updateUser = await userService.updateUserInfo({ username })
    if (updateUser) {
      dispatch(updateUserInfo({ username }))
    }

    message.success({ content: 'Done!', key, duration: 2 })
    //   setTimeout(() => {
    //     this.setState({
    //       name: values.name,
    //       email: values.email,
    //       userName: values.userName,
    //       dateOfBirth: values.dateOfBirth,
    //       phoneNumber: values.phoneNumber,
    //       website: values.website,
    //       address: values.address,
    //       city: values.city,
    //       postcode: values.postcode,
    //     })
    //     message.success({ content: 'Done!', key, duration: 2 })
    //   }, 1000)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // const onUploadAavater = (info) => {
  //   const key = 'updatable'
  //   if (info.file.status === 'uploading') {
  //     message.loading({ content: 'Uploading...', key, duration: 1000 })
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     this.getBase64(info.file.originFileObj, (imageUrl) =>
  //       this.setState({
  //         avatarUrl: imageUrl,
  //       })
  //     )
  //     message.success({ content: 'Uploaded!', key, duration: 1.5 })
  //   }
  // }

  // const onRemoveAvater = () => {
  //   this.setState({
  //     avatarUrl: '',
  //   })
  // }

  // const {
  //   name,
  //   email,
  //   userName,
  //   dateOfBirth,
  //   phoneNumber,
  //   website,
  //   address,
  //   city,
  //   postcode,
  //   avatarUrl,
  // } = this.state

  return (
    <>
      <Flex
        alignItems="center"
        mobileFlex={false}
        className="text-center text-md-left"
      >
        {/* <Avatar icon={<UserOutlined />}></Avatar> */}
        {/* <div className="ml-3 mt-md-0 mt-3">
						<Upload onChange={onUploadAavater} showUploadList={false} action={this.avatarEndpoint}>
							<Button type="primary">Change Avatar</Button>
						</Upload>
						<Button className="ml-2" onClick={onRemoveAvater}>Remove</Button>
					</div> */}
      </Flex>
      <div className="mt-4">
        <Form
          name="basicInformation"
          layout="vertical"
          initialValues={{
            username: user?.username,
            //   name: name,
            //   email: email,
            //   username: userName,
            //   dateOfBirth: dateOfBirth,
            //   phoneNumber: phoneNumber,
            //   website: website,
            //   address: address,
            //   city: city,
            //   postcode: postcode,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Row gutter={ROW_GUTTER}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your username!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Role"
                    name="role"

                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input your name!',
                    //   },
                    // ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    // rules={[
                    //   {
                    //     required: true,
                    //     type: 'email',
                    //     message: 'Please enter a valid email!',
                    //   },
                    // ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Save Change
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  )
}

export default EditProfile
