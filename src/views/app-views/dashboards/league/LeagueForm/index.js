import React, { useState, useEffect, useRef } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import leagueService from 'services/leagueService'
import leagueDataDummy from 'mock/data/leagueData'
import leagueFootballApiService from 'services/football-api/league'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const LanguageForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [uploadedImg, setImage] = useState(null)
  //   const [uploadLoading, setUploadLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [leagueData, setLeagueData] = useState({})
  const [footballLeagueData, setFootballLeagueData] = useState([])

  const getFootballApiLeaguesData = async (searchTerm) => {
    if (searchTerm.length > 2) {
      const data = await leagueFootballApiService.getAllLeaguesData(
        '',
        `search=${searchTerm}`
      )
      console.log(data, 'league-data')
      setFootballLeagueData(data)
    } else {
      setFootballLeagueData([])
    }
  }

  useEffect(() => {
    // getFootballApiLeaguesData()
  }, [])

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        // values.tags=tags
        const sendingValues = { ...values, ...leagueData }
        if (mode === ADD) {
          const created = await leagueService.createLeague(sendingValues)
          if (created) {
            message.success(`Created ${sendingValues.name} to Leagues list`)
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
              <h2 className="mb-3">Add New League</h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() => navigate('/app/dashboards/league/league-list')}
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
                setLeagueData={setLeagueData}
                footballLeagueData={footballLeagueData}
                getFootballApiLeaguesData={getFootballApiLeaguesData}

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

export default LanguageForm
