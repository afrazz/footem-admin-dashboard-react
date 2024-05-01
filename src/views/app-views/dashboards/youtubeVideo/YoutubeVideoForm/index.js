import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import youtubeVideoService from 'services/youtubeVideoService'
import languageService from 'services/languageService'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const YoutubeVideoForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [languages, setLanguages] = useState([])
  const [hideAdd, setHideAdd] = useState(false)

  useEffect(() => {
    if (mode === EDIT) {
      const fetchYoutubeVideoById = async () => {
        const { id } = param
        const data = await youtubeVideoService.getYoutubeVideoById(id)
        if (data) {
          const youtubeData = data.data.map((ytData, index) => {
            return {
              ...ytData,
              label: ytData.language.name,
              language: ytData.language._id,
              closable: true,
            }
          })

          if (youtubeData.length === 1) youtubeData[0].closable = false

          form.setFieldsValue({
            videoId: data.videoId,
            title: data.title,
            status: data.status,
            data: youtubeData,
          })

          const restLanguages = restLanguageData(youtubeData)

          if (restLanguages?.length === 0) {
            setHideAdd(true)
          } else {
            setHideAdd(false)
          }
        } else {
          navigate('/app/dashboards/youtubeVideo/youtubeVideo-list')
        }
      }

      fetchYoutubeVideoById()
    } else {
      if (languages?.length > 0) {
        const languagesTabData = languages.map((lang, index) => {
          return {
            label: lang.name,
            key: index,
            closable: true,
            language: lang._id,
            title: '',
          }
        })

        if (languagesTabData.length === 1) languagesTabData[0].closable = false

        setHideAdd(true)

        form.setFieldsValue({ data: languagesTabData })
      }
    }
  }, [form, mode, param, props, languages])

  const getLanguages = async () => {
    const { results } = await languageService.getlanguages()
    results && setLanguages(results)
  }

  useEffect(() => {
    getLanguages()
  }, [])

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        if (mode === ADD) {
          console.log('valuesss-submit')
          const created = await youtubeVideoService.createYoutubeVideo(values)
          if (created) {
            message.success(`Created ${values.videoId} to Youtube Video list`)
            navigate('/app/dashboards/youtubeVideo')
          }
        }
        if (mode === EDIT) {
          const edited = await youtubeVideoService.editYoutubeVideo(
            param.id,
            values
          )
          if (edited) {
            message.success(`Edited ${values.videoId} to Youtube Video list`)
            navigate('/app/dashboards/youtubeVideo')
          }
        }
        setSubmitLoading(false)
      })
      .catch((info) => {
        setSubmitLoading(false)
        console.log('info', info)
        message.error('Please enter all required field')
      })
  }

  //  Returning remaining language Data
  const restLanguageData = (tabData) => {
    console.log(tabData, 'hkgh')
    const remainingLanguages = languages.filter(function (cv) {
      return !tabData.find(function (e) {
        console.log(e, cv._id, 'logger')
        return e.language === cv._id
      })
    })
    return remainingLanguages
  }

  // Here we are hiding Add button if we have used all languages in tabs
  const handleValuesChange = (changedValue, allValues) => {
    if (allValues.data) {
      const restLanguages = restLanguageData(allValues.data)
      if (restLanguages?.length === 0) {
        setHideAdd(true)
      } else {
        setHideAdd(false)
      }
    }
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          status: 'Hold',
          data: [],
        }}
        onValuesChange={handleValuesChange}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="space-between"
              alignItems="center"
            >
              <h2 className="mb-3">
                {mode === 'ADD'
                  ? 'Add New Youtube Video'
                  : `Edit Youtube Video`}{' '}
              </h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() => navigate('/app/dashboards/youtubeVideo')}
                >
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={submitLoading}
                >
                  {mode === 'ADD' ? 'Add' : `Save`}
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
                languages={languages}
                hideAdd={hideAdd}
                setHideAdd={setHideAdd}
                restLanguageData={restLanguageData}
              />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default YoutubeVideoForm
