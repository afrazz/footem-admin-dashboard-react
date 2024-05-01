import React from 'react'
import { Dropdown, Menu } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const EllipsisDropdown = (props) => {
  return (
    <Dropdown
      menu={{
        items: props.menu,
      }}
      placement={props.placement}
      trigger={['click']}
      open={props.selectedRowId === props.rowId ? true : false}
      onOpenChange={(state) => {
        props.onOpenChange(state ? props.rowId : null)
      }}
    >
      <div className="ellipsis-dropdown">
        <EllipsisOutlined />
      </div>
    </Dropdown>
  )
}

EllipsisDropdown.propTypes = {
  trigger: PropTypes.string,
  placement: PropTypes.string,
}

EllipsisDropdown.defaultProps = {
  trigger: 'click',
  placement: 'bottomRight',
  menu: <Menu />,
}

export default EllipsisDropdown
