import React, { useState } from 'react'
import { Button, Divider, Modal, Popconfirm, Select } from 'antd'
import userService from 'services/userService'
const NotificationSentModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedNotificationNews,
  setSelectedNotificationNews,
}) => {
  const [selectedValue, setSelectedValue] = useState('followingUsers')
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    setLoading(true)
    console.log(selectedNotificationNews, 'newss')
    const newsId = selectedNotificationNews._id
    const league = selectedNotificationNews.league._id
    const teams = selectedNotificationNews.teams.map((team) => team.teamId)
    // const newsImage = selectedNotificationNews.imageUrl
    const startDate = selectedNotificationNews.startDate
    const news = selectedNotificationNews.newsData.map((news) => ({
      language: news.language._id,
      title: news.title,
      shortDesc: news.shortDesc,
    }))

    console.log(news, 'NEWSDATA')

    // league, teams, newsImage, news[{language, title, shortDesc}],

    await userService.sendNoticationNewsToUsers({
      type: selectedValue,
      league,
      teams,
      newsId,
      // newsImage,
      news,
      startDate,
    })
    setLoading(false)
    setSelectedNotificationNews({})
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setLoading(false)
    setSelectedNotificationNews({})
  }

  const handleChange = (value) => {
    setSelectedValue(value)
  }

  return (
    <>
      <Modal
        title="News Notification"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <div className="d-flex justify-content-end">
            <Popconfirm
              title="Are You Sure Action is Irreversible?"
              description="Clicking Yes Will Sent Notification. do you want continue?"
              onConfirm={handleOk}
              okButtonProps={{
                loading: loading,
              }}

              //   onCancel={() => setSelectedRowId(false)}
            >
              <Button type="primary">Send Notification</Button>
            </Popconfirm>
          </div>
        }
      >
        <div className="w-100 mt-3">
          <div className="mb-1">Sent Notification</div>

          <Select
            // style={{ width: 120 }}
            value={selectedValue}
            onChange={handleChange}
            options={[
              { value: 'followingUsers', label: 'Following Users' },
              { value: 'allUsers', label: 'All Users' },
            ]}
          />
        </div>
      </Modal>
    </>
  )
}
export default NotificationSentModal
