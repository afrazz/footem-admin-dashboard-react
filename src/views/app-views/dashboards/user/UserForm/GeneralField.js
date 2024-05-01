import React from 'react'
import { Input, Row, Col, Card, Form, Select, Checkbox } from 'antd'

// const { Dragger } = Upload
const { Option } = Select

const rules = {
  username: [
    {
      required: true,
      message: 'Required',
    },
  ],
  email: [
    {
      required: true,
      message: 'Required',
    },
  ],
  password: [
    {
      required: true,
      message: 'Required',
    },
  ],
  accessManagement: [
    {
      required: true,
      message: 'Please Select Atleast One Option',
    },
    // ({ getFieldValue }) => ({
    //   validator(_, value) {
    //     if (!value || getFieldValue('password') === value) {
    //       return Promise.resolve();
    //     }
    //     return Promise.reject(new Error('The new password that you entered do not match!'));
    //   },
    // }),
  ],
}

const GeneralField = ({ mode }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="username" label="Username" rules={rules.username}>
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={rules.email}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={mode === 'ADD' ? rules.password : [{ required: false }]}
          >
            <Input placeholder="Password" />
          </Form.Item>

          {/* <Form.Item name="status" label="Status" rules={rules.status}>
            <Select placeholder="Status">
              {['Active', 'Hold'].map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Access Managment">
          <Form.Item name="accessManagment" rules={rules.accessManagement}>
            <Checkbox.Group
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Checkbox value="analytics" style={{ marginLeft: 8 }} disabled>
                Analytics
              </Checkbox>

              <Checkbox value="user" style={{ marginTop: 8 }}>
                Users
              </Checkbox>

              <Checkbox value="language" style={{ marginTop: 8 }}>
                Language
              </Checkbox>

              <Checkbox value="league" style={{ marginTop: 8 }}>
                League
              </Checkbox>

              <Checkbox value="suggestedTeam" style={{ marginTop: 8 }}>
                Sugggested Teams
              </Checkbox>

              <Checkbox value="news" style={{ marginTop: 8 }}>
                News
              </Checkbox>

              <Checkbox value="youtubeVideo" style={{ marginTop: 8 }}>
                Youtube Videos
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
