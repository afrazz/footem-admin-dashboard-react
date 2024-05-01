import React, { useRef } from 'react'
import { Form, Button, Input, Row, Col, message } from 'antd'
import { auth } from 'auth/FirebaseAuth'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

export const ChangePassword = () => {
  const changePasswordFormRef = useRef()

  const onFinish = async (values) => {
    const user = auth.currentUser

    const currentPassword = values.currentPassword

    const credential = EmailAuthProvider.credential(user.email, currentPassword)

    reauthenticateWithCredential(user, credential)
      .then((result) => {
        const newPassword = values.newPassword

        updatePassword(user, newPassword)
          .then(() => {
            // Update successful.
            message.success({ content: 'Password Changed!', duration: 2 })
            onReset()
          })
          .catch((error) => {
            message.error(error.message)
            // An error ocurred
            // ...
          })
      })
      .catch((error) => {
        //Incorrect password or some other error
        message.error('Current password is not match. Try Again!')
      })

    // console.log(isValidCurrentPassword, 'password')

    // var credential = auth.EmailAuthProvider.credential(
    // 	firebase.auth().currentUser.email,
    // 	providedPassword
    //   );
  }

  const onReset = () => {
    changePasswordFormRef.current.resetFields()
  }

  return (
    <>
      <h2 className="mb-4">Change Password</h2>
      <Row>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form
            name="changePasswordForm"
            layout="vertical"
            ref={changePasswordFormRef}
            onFinish={onFinish}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your currrent password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('Password not matched!')
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Change password
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default ChangePassword
