import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import headlineService from 'services/headlineService'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const HeadlineForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (mode === EDIT) {
      const fetchLanguageById = async () => {
        const { id } = param
        const data = await headlineService.getHeadlineById(id)
        if (data) {
          form.setFieldsValue({
            title: data.title,
            status: data.status,
            layout: data.layout,
          })
        } else {
          navigate('/app/dashboards/headline/headline-list')
        }
      }

      fetchLanguageById()
    }
  }, [form, mode, param, props])

  const onFinish = async () => {
    setSubmitLoading(true)
    form
      .validateFields()
      .then(async (values) => {
        if (mode === ADD) {
          const created = await headlineService.createHeadline(values)
          if (created) {
            message.success(`Created ${values.title} to Headline list`)
            navigate(-1)
          }
        }
        if (mode === EDIT) {
          const edited = await headlineService.editHeadline(param.id, values)
          if (edited) {
            message.success(`Edited ${values.title} to Headline list`)
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

  

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          status: 'Hold',
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
              <h2 className="mb-3">
                {mode === 'ADD' ? 'Add New Headline' : `Edit Headline`}{' '}
              </h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() =>
                    navigate('/app/dashboards/headline/headline-list')
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
                  {mode === 'ADD' ? 'Add' : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField form={form} />
            </TabPane>
          </Tabs>
        </div>
      </Form>
    </>
  )
}

export default HeadlineForm
