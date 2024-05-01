import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import newsService from 'services/NewsService'
import categoryService from 'services/category'
import headlineService from 'services/headlineService'
import languageService from 'services/languageService'
import leagueService from 'services/leagueService'
import teamsFootballApiService from 'services/football-api/team'
import moment from 'moment'
import dayjs from 'dayjs'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const NewsForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [languages, setLanguages] = useState([])
  const [leagues, setLeagues] = useState([])
  const [teams, setTeams] = useState([])
  const [isTrending, setIsTrending] = useState(false)

  const [hideAdd, setHideAdd] = useState(false)

  useEffect(() => {
    if (mode === EDIT) {
      const fetchLanguageById = async () => {
        const { id } = param
        const data = await newsService.getNewsById(id)
        if (data) {
          const newsData = data.newsData.map((news, index) => {
            return {
              ...news,
              label: news.language.name,
              language: news.language._id,
              closable: true,
            }
          })

          if (newsData.length === 1) newsData[0].closable = false

          form.setFieldsValue({
            status: data?.status,
            minuteRead: data?.minuteRead,
            category: data?.category?._id,
            headline: data?.headline?._id,
            league: data?.league?._id,
            startEndDateRange: [dayjs(data?.startDate), dayjs(data?.endDate)],
            isTrending: data?.isTrending,
            isTransferNews: data?.isTransferNews,
            newsData: newsData,
          })

          setIsTrending(data?.isTrending)

          setTeams(data?.teams)

          if (data.imageUrl) {
            setImageUrl(data.imageUrl)
          }

          const restLanguages = restLanguageData(newsData)
          if (restLanguages?.length === 0) {
            setHideAdd(true)
          } else {
            setHideAdd(false)
          }
        } else {
          navigate('/app/dashboards/news/news-list')
        }
      }

      fetchLanguageById()
    } else {
      if (languages?.length > 0) {
        const languagesTabData = languages.map((lang, index) => {
          return {
            label: lang.name,
            key: index,
            closable: true,
            language: lang._id,
            desc: '',
            shortDesc: '',
            title: '',
          }
        })

        if (languagesTabData.length === 1) languagesTabData[0].closable = false

        setHideAdd(true)

        form.setFieldsValue({ newsData: languagesTabData })
      }
    }
  }, [form, mode, param, props, languages])

  function createFormData(data) {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value, 'yaayayaya')
      if (Array.isArray(value)) {
        if (typeof value[0] === 'object') {
          value.forEach((item, i) => {
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              console.log(`${key}[${i}][${itemKey}]`, itemValue)
              formData.append(`${key}[${i}][${itemKey}]`, itemValue)
            })
          })
        }
      } else {
        formData.append(key, value)
      }
    })

    // Iterate over the array and append each object as a separate entry in the FormData
    teams?.length > 0 &&
      teams.forEach((obj, index) => {
        // Generate a unique key for each object using the index
        const keyPrefix = `teams`

        // Iterate over the object properties and append them to the FormData
        Object.entries(obj).forEach(([property, value]) => {
          const key = `${keyPrefix}[${index}][${property}]`
          formData.append(key, value)
        })
      })

    return formData
  }

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        const sendingValues = { ...values }

        sendingValues.newsData = sendingValues.newsData.map((news) => ({
          title: news.title,
          desc: news.desc,
          language: news.language,
          shortDesc: news.shortDesc,
        }))

        sendingValues.trendingPeroid = dayjs(sendingValues.trendingPeroid)
          .format('YYYY-MM-DD')
          .toString()
        sendingValues.startDate = dayjs(sendingValues.startEndDateRange[0])
          .format('YYYY-MM-DD hh:mm a')
          .toString()
        sendingValues.endDate = dayjs(sendingValues.startEndDateRange[1])
          .format('YYYY-MM-DD hh:mm a')
          .toString()

        delete sendingValues.startEndDateRange

        const formDataValues = createFormData(sendingValues)

        if (mode === ADD) {
          const created = await newsService.createNews(formDataValues)
          if (created) {
            message.success(`Created News to News list`)
            navigate(-1)
          }
        }
        if (mode === EDIT) {
          const edited = await newsService.editNews(param.id, formDataValues)
          if (edited) {
            message.success(`Edited News to News list`)
            navigate(-1)
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

  const getLanguages = async () => {
    const { results } = await languageService.getlanguages()
    results && setLanguages(results)
  }

  const getLeagues = async () => {
    const { results } = await leagueService.getLeagues()
    setLeagues(results)
  }

  const getFootballApiTeams = async (query) => {
    const data = await teamsFootballApiService.getAllTeamsData(query)
    console.log('sgihk', data)
    return data
  }

  useEffect(() => {
    getLanguages()
    getLeagues()
  }, [])

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
    if (allValues.newsData) {
      const restLanguages = restLanguageData(allValues.newsData)
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
          newsData: [],
          startEndDateRange: [dayjs(), dayjs().add(14, 'day')],
          isTrending: false,
          isTransferNews: false,
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
                {mode === 'ADD' ? 'Add New News' : `Edit News`}{' '}
              </h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() => navigate('/app/dashboards/news/news-list')}
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
                imageUrl={imageUrl}
                languages={languages}
                leagues={leagues}
                hideAdd={hideAdd}
                setHideAdd={setHideAdd}
                restLanguageData={restLanguageData}
                getFootballApiTeams={getFootballApiTeams}
                setTeams={setTeams}
                teams={teams}
                setIsTrending={setIsTrending}
                isTrending={isTrending}
                // data={data}
              />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default NewsForm
