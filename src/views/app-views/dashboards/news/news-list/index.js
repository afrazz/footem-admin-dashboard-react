import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Menu,
  Tag,
  Form,
  Row,
  Col,
  Popconfirm,
  Avatar,
  Image,
} from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import AvatarStatus from 'components/shared-components/AvatarStatus'
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import Flex from 'components/shared-components/Flex'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'
import utils from 'utils'
import _ from 'lodash'
import newsService from 'services/NewsService'
import categoryService from 'services/category'
import headlineService from 'services/headlineService'
import NotificationSentModal from './NotificationSentModal'

const { Option } = Select

const getStockStatus = (status) => {
  if (status === 'Active') {
    return (
      <>
        <Tag color="green">Active</Tag>
      </>
    )
  }
  if (status === 'Hold') {
    return (
      <>
        <Tag color="orange">Hold</Tag>
      </>
    )
  }

  return null
}
const NewsList = () => {
  let navigate = useNavigate()
  const [form] = Form.useForm()

  const [list, setList] = useState([])
  const [selectedRowId, setSelectedRowId] = useState(null)
  // Added for Pagination
  const [loading, setLoading] = useState(false)
  const [filterEnabled, setFilterEnabled] = useState(false)
  const [categories, setCategories] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)
  const [selectedNotificationNews, setSelectedNotificationNews] = useState({})

  const statuses = ['Active', 'Hold']

  // pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
  })

  function handleMenuVisibleChange(rowId) {
    setSelectedRowId(rowId)
  }

  function handleDelete(row) {
    // Perform the deletion here
    deleteRow(row)
    // Close the menu
    setSelectedRowId(false)
  }

  const getCategories = async () => {
    const { results } = await categoryService.getCategories()

    results && setCategories(results)
  }

  const getHeadlines = async () => {
    const { results } = await headlineService.getHeadlines()
    results && setHeadlines(results)
  }

  // Changed here for pagination
  const getNews = async (paginationParams = {}, filterParams) => {
    setLoading(true)
    const data = await newsService.getNews(
      qs.stringify(getPaginationParams(paginationParams)),
      qs.stringify(filterParams)
    )

    if (data) {
      console.log('read-news', data.results)
      setList(data.results)

      // Pagination
      setPagination({
        ...paginationParams.pagination,
        total: data.total,
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    getNews({
      pagination,
    })
    getCategories()
    getHeadlines()
  }, [])

  // pagination generator
  const getPaginationParams = (params) => ({
    limit: params.pagination?.pageSize,
    page: params.pagination?.current,
    // ...params,
  })

  // On pagination Change
  const handleTableChange = (newPagination, filters, sorter, { action }) => {
    if (action === 'paginate') {
      getNews(
        {
          pagination: newPagination,
        },
        filterEnabled ? _.pickBy(form.getFieldsValue(), _.identity) : {}
      )
    }
  }

  const dropdownMenu = (row) => {
    return [
      {
        key: '1',
        label: (
          <div onClick={() => viewDetails(row)}>
            <Flex alignItems="center">
              <EyeOutlined />
              <span className="ml-2">View Details</span>
            </Flex>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => Newtab(row)}>
            <Flex alignItems="center">
              <EyeOutlined />
              <span className="ml-2">Open In New Tab</span>
            </Flex>
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div
            onClick={() => {
              setSelectedNotificationNews(row)
              setNotificationModalOpen(true)
            }}
          >
            <Flex alignItems="center">
              <EyeOutlined />
              <span className="ml-2">Sent Notification</span>
            </Flex>
          </div>
        ),
      },
      {
        key: '4',
        label: (
          <Popconfirm
            title="Want To Delete?"
            description="Clicking Yes Will delete Permantely. do you want continue?"
            onConfirm={() => handleDelete(row)}
            onCancel={() => setSelectedRowId(false)}
          >
            <Flex alignItems="center">
              <DeleteOutlined />
              <span className="ml-2">Delete</span>
            </Flex>
          </Popconfirm>
        ),
      },
    ]
  }

  const addNews = () => {
    navigate(`/app/dashboards/news/add-news`)
  }

  const viewDetails = (row) => {
    navigate(`/app/dashboards/news/edit-news/${row._id}`)
  }
  const Newtab = (row) => {
    window.open(`/app/dashboards/news/edit-news/${row._id}`)
  }

  const deleteRow = async (row) => {
    const resp = await newsService.deleteNews(row._id)

    if (resp) {
      const objKey = '_id'
      let data = list
      // if (selectedRows.length > 1) {
      //   selectedRows.forEach((elm) => {
      //     data = utils.deleteArrayRow(data, objKey, elm._id)
      //     setList(data)
      //     setSelectedRows([])
      //   })
      // } else {
      data = utils.deleteArrayRow(data, objKey, row._id)
      setList(data)
      // }
    }
  }
  // Pagination
  const resetPagination = () => ({
    ...pagination,
    current: 1,
    pageSize: 10,
  })

  // Filter Submit
  const handleFilterSubmit = async () => {
    setPagination(resetPagination())

    form
      .validateFields()
      .then(async (values) => {
        setFilterEnabled(true)
        // Removing falsy Values from values
        const sendingValues = _.pickBy(values, _.identity)
        getNews({ pagination: resetPagination() }, sendingValues)
      })
      .catch((info) => {
        console.log('info', info)
        setFilterEnabled(false)
      })
  }

  // Clear Filter
  const handleClearFilter = async () => {
    form.resetFields()

    setPagination(resetPagination())
    getNews({ pagination: resetPagination() }, {})
    setFilterEnabled(false)
  }

  const tableColumns = [
    {
      title: 'News',
      dataIndex: 'newsData',
      render: (newsData, record) => {
        return (
          <>
            <Image
              width={100}
              height={100}
              src={record.imageUrl}
              alt="News Image"
            />

            {newsData.map((newsData) => {
              return <div>{newsData?.title}</div>
            })}
          </>
        )
      },
      sorter: (a, b) => utils.antdTableSorter(a, b, 'title'),
    },

    {
      title: 'Transfer News',
      dataIndex: 'isTransferNews',
      render: (isTransferNews) => (
        <Flex alignItems="center">{isTransferNews ? 'Yes' : 'No'}</Flex>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'isTransferNews'),
    },
    // {
    //   title: 'Headline',
    //   dataIndex: 'headline',
    //   render: (headline) => <Flex alignItems="center">{headline?.title}</Flex>,
    //   sorter: (a, b) => utils.antdTableSorter(a, b, 'headline.title'),
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   render: (status) => (
    //     <Flex alignItems="center">{getStockStatus(status)}</Flex>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, 'status'),
    // },
    {
      title: 'Notification Sent',
      dataIndex: 'notified',
      render: (notified, _) => <>{notified ? 'Yes' : 'No'}</>,
    },
    {
      title: 'Minute Read',
      dataIndex: 'minuteRead',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'minuteRead'),
    },
    {
      title: '',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown
            onOpenChange={handleMenuVisibleChange}
            menu={dropdownMenu(elm)}
            selectedRowId={selectedRowId}
            rowId={elm._id}
          />
        </div>
      ),
    },
  ]

  // Table Filters JSX Elements
  const filtersComponent = () => (
    <Form
      layout="vertical"
      form={form}
      name="filter_form"
      className="ant-advanced-search-form"
    >
      <Row gutter={8} align="bottom">
        <Col md={6} sm={24} xs={24} lg={6}>
          <Form.Item name="search" label="Search">
            <Input placeholder="Search" prefix={<SearchOutlined />} />
          </Form.Item>
        </Col>

        <Col md={6} sm={24} xs={24} lg={6}>
          <Form.Item name="isTrending" label="IsTrending">
            <Select
              className="w-100"
              style={{ minWidth: 180 }}
              placeholder="Select Is Trending"
            >
              <Option key={'yes'} value={'true'}>
                Yes
              </Option>
              <Option key={'yes'} value={'false'}>
                No
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col md={6} sm={24} xs={24} lg={6}>
          <Form.Item name="isTransferNews" label="Is TransferNews">
            <Select
              className="w-100"
              style={{ minWidth: 180 }}
              placeholder="Select Is TransferNews"
            >
              <Option key={'yes'} value={'true'}>
                Yes
              </Option>
              <Option key={'yes'} value={'false'}>
                No
              </Option>
            </Select>
          </Form.Item>
        </Col>

        <Col className="mb-4">
          <Button type="primary" onClick={handleFilterSubmit}>
            Filter
          </Button>
        </Col>
        <Col className="mb-4">
          <Button type="primary" onClick={handleClearFilter}>
            Clear
          </Button>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card>
      {/* <Flex alignItems="center" justifyContent="between" mobileFlex={false}> */}
      {filtersComponent()}
      {/* </Flex> */}
      <div>
        <Button onClick={addNews} type="primary" icon={<PlusCircleOutlined />}>
          Add news
        </Button>
      </div>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={list}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </div>
      <NotificationSentModal
        isModalOpen={notificationModalOpen}
        setIsModalOpen={setNotificationModalOpen}
        selectedNotificationNews={selectedNotificationNews}
        setSelectedNotificationNews={setSelectedNotificationNews}
      />
    </Card>
  )
}

export default NewsList
