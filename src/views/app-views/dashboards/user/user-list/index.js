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
import userService from 'services/userService'
import moment from 'moment'

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
const UserList = () => {
  let navigate = useNavigate()
  const [form] = Form.useForm()

  const [list, setList] = useState([])

  const [selectedRowId, setSelectedRowId] = useState(null)

  function handleMenuVisibleChange(rowId) {
    setSelectedRowId(rowId)
  }

  function handleDelete(row) {
    // Perform the deletion here
    deleteRow(row)
    // Close the menu
    setSelectedRowId(false)
  }

  // Added for Pagination
  const [loading, setLoading] = useState(false)
  const [filterEnabled, setFilterEnabled] = useState(false)

  const statuses = ['Active', 'Hold']
  const ROLES = ['SubAdmin', 'User']

  // pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 30,
  })

  // Changed here for pagination
  const getUsers = async (paginationParams = {}, filterParams) => {
    setLoading(true)
    const data = await userService.getUsers(
      qs.stringify(getPaginationParams(paginationParams)),
      qs.stringify(filterParams)
    )

    if (data) {
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
    getUsers({
      pagination,
    })
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
      getUsers(
        {
          pagination: newPagination,
        },
        filterEnabled ? _.pickBy(form.getFieldsValue(), _.identity) : {}
      )
    }
  }

  // const dropdownMenu = (row) => (
  //   <Menu>
  //     <Menu.Item onClick={() => viewDetails(row)}>
  //       <Flex alignItems="center">
  //         <EyeOutlined />
  //         <span className="ml-2">View Details</span>
  //       </Flex>
  //     </Menu.Item>
  //     <Menu.Item onClick={() => Newtab(row)}>
  //       <Flex alignItems="center">
  //         <EyeOutlined />
  //         <span className="ml-2">Open In New Tab</span>
  //       </Flex>
  //     </Menu.Item>
  //     <Menu.Item onClick={() => deleteRow(row)}>
  //       <Flex alignItems="center">
  //         <DeleteOutlined />
  //         <span className="ml-2">
  //           {/* {selectedRows.length > 0
  //             ? `Delete (${selectedRows.length})`
  //             : 'Delete'} */}
  //             Delete
  //         </span>
  //       </Flex>
  //     </Menu.Item>
  //   </Menu>
  // )

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

  const addProduct = () => {
    navigate(`/app/dashboards/users/add-user`)
  }

  const viewDetails = (row) => {
    navigate(`/app/dashboards/users/edit-user/${row._id}`)
  }
  const Newtab = (row) => {
    window.open(`/app/dashboards/users/edit-user/${row._id}`)
  }

  const deleteRow = async (row) => {
    const resp = await userService.deleteUser(row._id)

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
        getUsers({ pagination: resetPagination() }, sendingValues)
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
    getUsers({ pagination: resetPagination() }, {})
    setFilterEnabled(false)
  }

  const tableColumns = [
    {
      title: 'User',
      dataIndex: 'username',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            size={60}
            type="square"
            // src={record.image}
            name={record.username}
          />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'username'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'email'),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'country'),
    },
    {
      title: 'Selected Lang',
      dataIndex: 'language',
      render: (language) => <>{language?.name}</>,
      sorter: (a, b) => utils.antdTableSorter(a, b, 'language.name'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: (a, b) => utils.antdTableSorter(a, b, 'role'),
    },
    {
      title: 'Joined At',
      dataIndex: 'createdAt',
      render: (createdAt) => (
        <>{moment(createdAt).format('YYYY-MM-DD hh:mm a')}</>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, 'role'),
    },

    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   render: (status) => (
    //     <Flex alignItems="center">{getStockStatus(status)}</Flex>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, 'status'),
    // },
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
          <Form.Item name="search" label="Search User">
            <Input placeholder="Search User" prefix={<SearchOutlined />} />
          </Form.Item>
        </Col>
        <Col md={6} sm={24} xs={24} lg={6}>
          <Form.Item name="role" label="Role">
            <Select
              className="w-100"
              style={{ minWidth: 180 }}
              placeholder="Role"
            >
              <Option value="">All</Option>
              {ROLES.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
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
        <Button
          onClick={addProduct}
          type="primary"
          icon={<PlusCircleOutlined />}
        >
          Add User
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
    </Card>
  )
}

export default UserList
