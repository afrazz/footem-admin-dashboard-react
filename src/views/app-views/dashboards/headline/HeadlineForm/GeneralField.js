import React from 'react'
import { Input, Row, Col, Card, Form, Select } from 'antd'

const { Option } = Select

const rules = {
  title: [
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
  layout: [
    {
      required: true,
      message: 'Required',
    },
  ],
}

const layout = [
  { label: 'Full Width Post Scroll', value: 1 },
  { label: 'Full Width Post', value: 2 },
  { label: 'Image And Content in Row', value: 3 },
]

const GeneralField = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="title" label="Title" rules={rules.title}>
            <Input placeholder="Title" />
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
          <Form.Item name="layout" label="Layout" rules={rules.layout}>
            <Select placeholder="Layout">
              {layout.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
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
