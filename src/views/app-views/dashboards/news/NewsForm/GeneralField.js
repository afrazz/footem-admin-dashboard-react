import React, { useEffect, useRef, useState } from 'react'
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Select,
  Upload,
  Button,
  Image,
  InputNumber,
  Tabs,
  List as ComponentList,
  Popconfirm,
  Modal,
  Space,
  DatePicker,
  Avatar,
  Tooltip,
} from 'antd'
import ImageUpload from 'components/shared-components/UploadImage'
import TextEditor from 'components/shared-components/Editor'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined } from '@ant-design/icons'
import leagueTeamsData from 'mock/data/leagueTeamsData'
import dayjs from 'dayjs'
import moment from 'moment'
import countriesData from 'mock/data/countriesData'
import teamsFootballApiService from 'services/football-api/team'

const { Option } = Select

const { RangePicker } = DatePicker

const rules = {
  startEndDateRange: [
    { type: 'array', required: true, message: 'Please select a date range' },
  ],
  isTrending: [
    {
      type: 'boolean',
      required: true,
      message: 'Is Trending Field is Required',
    },
  ],
  isTransferNews: [
    {
      type: 'boolean',
      required: true,
      message: 'Is isTransferNews Field is Required',
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
  imageUrl,
  languages,
  leagues,
  hideAdd,
  setHideAdd,
  restLanguageData,
  getFootballApiTeams,
  setTeams,
  teams,
  setIsTrending,
  isTrending,
}) => {
  const [countries, setCountries] = useState(countriesData)
  const [teamsInCountry, setTeamsInCountry] = useState([])

  const addNewsTeam = (team) => {
    setTeams([...teams, team])
  }

  const removeNewsTeam = (teamId) => {
    const restNewsTeam = teams.filter((team) => team?.teamId != teamId)
    setTeams(restNewsTeam)
  }

  const setFile = (file) => {
    form.setFieldValue('image', file)
  }

  const fetchTeamsInCountry = async (country) => {
    const allTeams = await teamsFootballApiService.getAllTeamsData({
      country: country,
    })
    setTeamsInCountry(allTeams)
  }

  console.log(teamsInCountry, 'teamsss')

  // TABS ------------------------------------------------------------------------------------

  const { Item, List } = Form
  const { TabPane } = Tabs

  const doneAdd = (currentKey, languageName) => {
    const newFields = form.getFieldValue('newsData')
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
      newsData: updatedPanes,
    })
  }

  const handleSelectChange = (value, key) => {
    const fields = form.getFieldValue('newsData')
    fields[key].language = value

    form.setFields([{ name: 'newsData', value: fields }])
  }

  const onEdit = (targetKey, action, add, remove) => {
    const key = form.getFieldValue('newsData').length

    if (action === 'add') {
      // Here we are hiding closable icon beside to tab label
      const updatedPanes = form
        .getFieldValue('newsData')
        .map((pane) => ({ ...pane, closable: false, disabled: true }))

      console.log(updatedPanes, 'nooppp')

      form.setFieldsValue({
        newsData: updatedPanes,
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
              {restLanguageData(form.getFieldValue('newsData')).map((item) => (
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

        desc: '',
        title: '',
        shortDesc: '',
      })
    } else {
      Modal.confirm({
        title: 'Are you sure you want to Remove this Tab?',
        onOk: () => {
          remove(Number(targetKey))
          // Here we enabling every close button to be shown except first item
          const updatedPanes = form.getFieldValue('newsData').map((pane, i) => {
            // if (i === 0) return { ...pane, closable: false, disabled: false }
            return { ...pane, closable: true, disabled: false }
          })
          if (updatedPanes.length === 1) updatedPanes[0].closable = false

          form.setFieldsValue({
            newsData: updatedPanes,
          })
        },
        onCancel: () => {},
      })
    }
  }

  const setEditorValue = (value, index) => {
    const updateDesc = form.getFieldValue('newsData')
    updateDesc[index].desc = value
    form.setFieldsValue({ newsData: updateDesc })
  }

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
          <Form.Item name="minuteRead" label="Minutes Read">
            <InputNumber placeholder="minuteRead" />
          </Form.Item>
          <Form.Item name="league" label="Select League">
            <Select placeholder="League">
              {leagues.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* TODO: This functionality ant methods shouldUpdate is not working properly. need to switch to state method*/}

          {/* <Form.Item
            name="teams"
            label="Select Teams"
            shouldUpdate={(prevValues, curValues) =>
              prevValues.league !== curValues.league
            }
          >
            {(form) => (
              <Select
                mode="multiple"
                style={{
                  width: '100%',
                }}
                placeholder="Select Teams"
                optionLabelProp="label"
                optionFilterProp="label"
                {...form}
              >
                {leagueTeamsData.map(({ team }) => {
                  return (
                    <Option value={team.id} label={team.name}>
                      <Space>
                        <span role="img" aria-label={team.name}>
                          <Image
                            src={team.logo}
                            preview={false}
                            alt="team-logo"
                            height={50}
                            width={50}
                          />
                        </span>
                        {team.name}
                      </Space>
                    </Option>
                  )
                })}
              </Select>
            )}
          </Form.Item> */}
          <Form.Item
            name="startEndDateRange"
            label="start - End DateRange Picker"
            rules={rules.startEndDateRange}
          >
            <RangePicker
              showTime
              format={'YYYY-MM-DD hh:mm a'}
              onChange={(val, formatString) =>
                console.log(val, formatString, 'DATE_STRING')
              }
            />
          </Form.Item>
          <Form.Item
            name="isTransferNews"
            label="Is Transfer News"
            rules={rules.isTransferNews}
          >
            <Select placeholder="Is Trending">
              <Option key={'yes'} value={true}>
                Yes
              </Option>
              <Option key={'no'} value={false}>
                No
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isTrending"
            label="Is Trending"
            rules={rules.isTrending}
          >
            <Select
              placeholder="Is Trending"
              onChange={(val) => {
                setIsTrending(val)
                form.setFieldValue('isTrending', val)
              }}
            >
              <Option key={'yes'} value={true}>
                Yes
              </Option>
              <Option key={'no'} value={false}>
                No
              </Option>
            </Select>
          </Form.Item>
          {isTrending && (
            <Form.Item
              name="trendingPeroid"
              label="Trending Peroid"
              initialValue={dayjs().add(2, 'day')}
              rules={[
                {
                  required: true,
                  message: 'Required',
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          )}
        </Card>

        <Card title="Link Teams Section">
          <div className="mb-2">Select Country</div>
          <Select
            placeholder="Select Country of the Team"
            onChange={(country) => {
              fetchTeamsInCountry(country)
            }}
            showSearch
            style={{ width: '100%' }}
          >
            {countries.map((country) => (
              <Option key={country.name} value={country.name}>
                {country.name}
              </Option>
            ))}
          </Select>
          <div className="mb-2 mt-4">Select Team</div>
          <Select
            placeholder="Select Team"
            onChange={(_, { value, label, logo }) => {
              addNewsTeam({ teamId: value, name: label, logo })
            }}
            showSearch
            style={{ width: '100%' }}
            optionLabelProp="label"
            optionFilterProp="label"
          >
            {teamsInCountry.map(({ team }) => {
              return (
                <Option value={team.id} label={team.name} logo={team.logo}>
                  <Space>
                    <span role="img" aria-label={team.name}>
                      <Image
                        src={team.logo}
                        preview={false}
                        alt="team-logo"
                        height={50}
                        width={50}
                      />
                    </span>
                    {team.name}
                  </Space>
                </Option>
              )
            })}
          </Select>
          <Card className="mt-3" title="Selected Teams">
            <ComponentList
              itemLayout="horizontal"
              dataSource={teams}
              renderItem={(item, index) => (
                <ComponentList.Item
                  actions={[
                    <Tooltip title="Remove">
                      <Button
                        type="secondary"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => removeNewsTeam(item.teamId)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <ComponentList.Item.Meta
                    avatar={<Avatar src={item?.logo} />}
                    title={item.name}
                  />
                </ComponentList.Item>
              )}
            />
          </Card>

          {/* {teams?.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={teams}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item?.logo} alt="team-logo" />}
                    title={item?.name}
                    // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          )} */}
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Media">
          <Form.Item name="image">
            <ImageUpload setFile={setFile} imageUrl={imageUrl} />
          </Form.Item>
        </Card>
      </Col>

      <Col xs={24} sm={24} md={24}>
        <Card title="News Section">
          <List name="newsData">
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
                      tab={form.getFieldValue('newsData')[index].label}
                      key={index}
                      closable={form.getFieldValue('newsData')[index].closable}
                      disabled={form.getFieldValue('newsData')[index].disabled}
                    >
                      <Item
                        name={[field.name, 'title']}
                        rules={[{ required: true }]}
                        label="News Title"
                      >
                        <Input placeholder="Tab Title" />
                      </Item>
                      <Item
                        name={[field.name, 'shortDesc']}
                        rules={[{ required: true }]}
                        label="Short Desc"
                      >
                        <Input.TextArea placeholder="Short Desc" />
                      </Item>
                      <Item name={[field.name, 'desc']}>
                        <TextEditor
                          initialValue={
                            form.getFieldValue('newsData')[index].desc
                          }
                          index={index}
                          setValue={setEditorValue}
                        />
                      </Item>
                    </TabPane>
                  ))}
                </Tabs>
              </>
            )}
          </List>
        </Card>
      </Col>
    </Row>
  )
}

export default GeneralField
