import React from 'react'
import { Input, Row, Col, Card, Form, Select } from 'antd'

// const { Dragger } = Upload
const { Option } = Select

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
}

const GeneralField = () => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="name" label="Name" rules={rules.name}>
            <Input placeholder="Name" />
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
      {/* <Col xs={24} sm={24} md={7}>
        <Card title="Media">
          <Upload
            listType="picture-card"
            name="image"
            {...propsImages}
            accept="image/*"
          >
            <CustomIcon className="display-3" svg={ImageSvg} />
          </Upload>
          size: 80px * 80px
        </Card>
        <Card title="Banner">
          <Upload listType="picture-card" name="image" {...propsBannerImage}>
            <CustomIcon className="display-3" svg={ImageSvg} />
          </Upload>
          size: 1586px * 205px
        </Card>
      </Col> */}
    </Row>
  )
}

export default GeneralField
