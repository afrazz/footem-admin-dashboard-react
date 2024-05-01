import React, { useEffect, useState } from 'react'
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Select,
  Button,
  List,
  Tabs,
  Modal,
} from 'antd'

const { Option } = Select

const rules = {
  videoId: [
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
  language: [
    {
      required: true,
      message: 'Required',
    },
  ],
}

const GeneralField = ({
  languages,
  form,
  restLanguageData,
  setHideAdd,
  hideAdd,
}) => {
  const [youtubePreviewUrl, setYoutubePreviewUrl] = useState('')

  const { TabPane } = Tabs
  const { Item, List } = Form

  useEffect(() => {
    setTimeout(() => {
      setYoutubePreviewUrl(form?.getFieldValue('videoId'))
    }, 1000)
  }, [])

  const handleSelectChange = (value, key) => {
    const fields = form.getFieldValue('data')
    fields[key].language = value

    form.setFields([{ name: 'data', value: fields }])
  }

  const doneAdd = (currentKey, languageName) => {
    const newFields = form.getFieldValue('data')
    console.log(newFields, 'ssknk', currentKey)
    newFields[Number(currentKey)].label = languageName

    // Here we enabling every close button to be shown except first item
    const updatedPanes = newFields.map((pane, i) => {
      // if (i === 0) return { ...pane, closable: false, disabled: false }
      return { ...pane, closable: true, disabled: false }
    })

    if (updatedPanes.length === 1) updatedPanes[0].closable = false

    const restDataLan = restLanguageData(updatedPanes)
    if (restDataLan?.length === 0) {
      setHideAdd(true)
    }

    form.setFieldsValue({
      data: updatedPanes,
    })
  }

  const onEdit = (targetKey, action, add, remove) => {
    const key = form.getFieldValue('data').length

    if (action === 'add') {
      // Here we are hiding closable icon beside to tab label
      const updatedPanes = form
        .getFieldValue('data')
        .map((pane) => ({ ...pane, closable: false, disabled: true }))

      console.log(updatedPanes, 'nooppp')

      form.setFieldsValue({
        data: updatedPanes,
      })

      let languageName = null

      add({
        label: (
          <div className="d-flex">
            <Select
              placeholder="Language"
              style={{ width: '140px', marginRight: '10px' }}
              onChange={(val, { children }) => {
                languageName = children
                handleSelectChange(val, key)
              }}
            >
              {restLanguageData(form.getFieldValue('data')).map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
            <Button
              onClick={() => {
                doneAdd(key, languageName)
              }}
            >
              Done
            </Button>
          </div>
        ),
        key,
        closable: true,
        title: '',
      })
    } else {
      Modal.confirm({
        title: 'Are you sure you want to Remove this Tab?',
        onOk: () => {
          remove(Number(targetKey))
          // Here we enabling every close button to be shown except first item
          const updatedPanes = form.getFieldValue('data').map((pane, i) => {
            // if (i === 0) return { ...pane, closable: false, disabled: false }
            return { ...pane, closable: true, disabled: false }
          })
          if (updatedPanes.length === 1) updatedPanes[0].closable = false

          form.setFieldsValue({
            data: updatedPanes,
          })
        },
        onCancel: () => {},
      })
    }
  }

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Form.Item
            name="videoId"
            label="Youtube Video ID"
            rules={rules.videoId}
          >
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

          {/* <Form.Item name="language" label="Language" rules={rules.language}>
            <Select placeholder="Language">
              {languages.map((cur) => (
                <Option key={cur._id} value={cur._id}>
                  {cur.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          {/* <Form.Item name="language" label="Language" rules={rules.language}>
            <Select
              mode="multiple"
              style={{
                width: '100%',
              }}
              placeholder="Select Languages"
              optionLabelProp="label"
              optionFilterProp="label"
              {...form}
            >
              {languages.map((lang) => {
                return (
                  <Option value={lang._id} label={lang.name}>
                    {lang.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item> */}

          <Col xs={24} sm={24} md={24}>
            <Card title="Youtube Section">
              <List name="data">
                {(fields, { add, remove }) => (
                  <>
                    <Tabs
                      type="editable-card"
                      onEdit={(targetKey, action, dd, ddd) => {
                        onEdit(targetKey, action, add, remove)
                      }}
                      hideAdd={hideAdd}
                    >
                      {fields.map((field, index) => (
                        <TabPane
                          tab={form.getFieldValue('data')[index].label}
                          key={index}
                          closable={form.getFieldValue('data')[index].closable}
                          disabled={form.getFieldValue('data')[index].disabled}
                        >
                          <Item
                            name={[field.name, 'title']}
                            rules={[{ required: true }]}
                            label="Youtube Title"
                          >
                            <Input placeholder="Youtube Title" />
                          </Item>
                        </TabPane>
                      ))}
                    </Tabs>
                  </>
                )}
              </List>
            </Card>
          </Col>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={7}>
        <Card title="Check Youtube Video Preview">
          <iframe
            title={`youtube-video-${form.getFieldValue('videoId')}`}
            itemType="video"
            src={`https://www.youtube.com/embed/${form.getFieldValue(
              'videoId'
            )}?rel=0&autoplay=0&showinfo=0&fullscreen=1`}
            width="250px"
            allowFullScreen
          />
          <Button
            className="mt-2"
            type="default"
            htmlType="button"
            onClick={() => setYoutubePreviewUrl(form.getFieldValue('videoId'))}
          >
            Update Preview
          </Button>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
