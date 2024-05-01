import React from 'react'
import { Input, Row, Col, Card, Form, Select, Image } from 'antd'

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

const GeneralField = ({
  form,
  setLeagueData,
  footballLeagueData,
  getFootballApiLeaguesData,
}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item name="status" label="Status" rules={rules.status}>
            <Select placeholder="Status">
              {['Active', 'Hold'].map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="League">
            <Select
              placeholder="League"
              onChange={(val) => {
                const value = JSON.parse(val)
                setLeagueData({
                  _id: value.league.id,
                  type: value.league.type,
                  name: value.league.name,
                  logo: value.league.logo,
                  country: value.country,
                })
                // form.setFieldsValue({
                //   _id: value.league.id,
                //   type: value.league.type,
                //   name: value.league.name,
                //   logo: value.league.logo,
                //   status: value.country,
                // })
              }}
              onSearch={(searchTerm) => {
                // alert(searchTerm)
                getFootballApiLeaguesData(searchTerm)
              }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                const value = JSON.parse(option?.value)
                return (
                  value?.league?.name
                    .toLowerCase()
                    .includes(input?.toLowerCase()) ||
                  value?.country?.name
                    ?.toLowerCase()
                    ?.includes(input?.toLowerCase())
                )
                // (option?.label ?? '').includes(input)
              }}
              // filterSort={(optionA, optionB) =>
              //   (optionA?.label ?? '')
              //     .toLowerCase()
              //     .localeCompare((optionB?.label ?? '').toLowerCase())
              // }
            >
              {footballLeagueData.map((item) => (
                <Option key={JSON.stringify(item)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={item?.league?.logo}
                      height={40}
                      width={40}
                      preview={false}
                    />
                    <div className="ml-2">{`${item?.league?.name} (${item?.country?.name})`}</div>
                  </div>
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
