import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd'
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
// import useUpload from 'hooks/useUpload'

import { useNavigate } from 'react-router-dom'
import languageService from 'services/languageService'

const { TabPane } = Tabs

const ADD = 'ADD'
const EDIT = 'EDIT'

const LanguageForm = (props) => {
  const { mode = ADD, param } = props
  const navigate = useNavigate()

  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    if (mode === EDIT) {
      const fetchLanguageById = async () => {
        const { id } = param
        const data = await languageService.getlanguageById(id)
        if (data) {
          form.setFieldsValue({
            name: data.name,
            priority: data.priority,
            status: data.status,
            iso2CountryCode: data.iso2CountryCode,
          })
        } else {
          navigate('/app/dashboards/language/language-list')
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
        console.log(values, 'one')
        const sendingValues = {
          ...values,
          iso2CountryCode: values.iso2CountryCode.toLowerCase(),
        }

        console.log(sendingValues, 'two')

        if (mode === ADD) {
          const created = await languageService.createLanguage(sendingValues)
          if (created) {
            message.success(`Created ${sendingValues.name} to Language list`)
            navigate(-1)
          }
        }
        if (mode === EDIT) {
          const edited = await languageService.editLanguage(
            param.id,
            sendingValues
          )
          if (edited) {
            message.success(`Edited ${sendingValues.name} to Language list`)
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
                {mode === 'ADD' ? 'Add New Language' : `Edit Language`}{' '}
              </h2>
              <div className="mb-3">
                <Button
                  className="mr-2"
                  onClick={() =>
                    navigate('/app/dashboards/language/language-list')
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

export default LanguageForm
