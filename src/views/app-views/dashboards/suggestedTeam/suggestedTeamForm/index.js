import React, { useState, useEffect, useRef } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import suggestedTeamService from 'services/suggestedTeamService'
import leagueFootballApiService from 'services/football-api/league'
import teamsFootballApiService from 'services/football-api/team'
// import leagueDataDummy from 'mock/data/leagueData'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const SuggestedTeamForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [uploadedImg, setImage] = useState(null)
  //   const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formLeagueData, setFormLeagueData] = useState({})
  const [formTeamData, setFormTeamData] = useState({})
  const [footballLeagueData, setFootballLeagueData] = useState([])

  const getFootballApiLeaguesData = async () => {
    const data = await leagueFootballApiService.getAllLeaguesData()
    setFootballLeagueData(data)
  }

  useEffect(() => {
    getFootballApiLeaguesData()
  }, [])

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        // values.tags=tags
        const sendingValues = {
          ...values,
          league: { ...formLeagueData },
          ...formTeamData,
        }
        if (mode === ADD) {
          const created = await suggestedTeamService.createSuggestedTeam(
            sendingValues
          )
          if (created) {
            message.success(
              `Created ${sendingValues.name} to Suggested Team list`
            )
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
          status: 'Active',
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
              <h2 className="mb-3">Add New SuggestedTeam</h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() =>
                    navigate('/app/dashboards/suggestedTeam/suggestedTeam-list')
                  }
                >
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  Add
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField
                form={form}
                setFormLeagueData={setFormLeagueData}
                footballLeagueData={footballLeagueData}
                setFormTeamData={setFormTeamData}
                formLeagueData={formLeagueData}
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

export default SuggestedTeamForm
