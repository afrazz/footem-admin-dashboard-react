import React from 'react'
import { Input, Row, Col, Card, Form, Select, InputNumber } from 'antd'

const { Option } = Select

const validateIso2CountryCode = (rule, value, callback) => {
  if (!value) {
    // If the field is empty, show the required error message
    callback('Required')
  } else if (value.length !== 2) {
    // If the length is not exactly 2, show the length error message
    callback('Must be exactly 2 characters long')
  } else {
    callback() // No error
  }
}

const rules = {
  name: [
    {
      required: true,
      message: 'Required',
    },
  ],
  status: [
    {
      required: true,
      message: 'Required',
    },
  ],
  priority: [
    {
      required: true,
      message: 'Required',
    },
  ],
  iso2CountryCode: [
    {
      required: true,
      validator: validateIso2CountryCode,
      // message: 'Required',
    },
  ],
}

const GeneralField = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Name" rules={rules.name}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={rules.priority}>
            <InputNumber placeholder="Priority" />
          </Form.Item>

          <Form.Item
            name="iso2CountryCode"
            label="ISO2 CountryCode"
            rules={rules.iso2CountryCode}
          >
            <Input placeholder="ISO2CountryCode" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={rules.status}>
            <Select placeholder="Status">
              {['Active', 'Hold'].map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
