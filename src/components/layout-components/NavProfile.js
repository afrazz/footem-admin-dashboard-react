import React from 'react'
import { Dropdown, Avatar } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import {
  EditOutlined,
  SettingOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import NavItem from './NavItem'
import Flex from 'components/shared-components/Flex'
import { signOut } from 'store/slices/authSlice'
import styled from '@emotion/styled'
import {
  FONT_WEIGHT,
  MEDIA_QUERIES,
  SPACER,
  FONT_SIZES,
} from 'constants/ThemeConstant'
import { Link } from 'react-router-dom'

const Icon = styled.div(() => ({
  fontSize: FONT_SIZES.LG,
}))

const Profile = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
}))

const UserInfo = styled('div')`
  padding-left: ${SPACER[2]};

  @media ${MEDIA_QUERIES.MOBILE} {
    display: none;
  }
`

const Name = styled.div(() => ({
  fontWeight: FONT_WEIGHT.SEMIBOLD,
}))

const Title = styled.span(() => ({
  opacity: 0.8,
}))

const MenuItem = (props) => (
  <Link to={props.path}>
    <Flex alignItems="center" gap={SPACER[2]}>
      <Icon>{props.icon}</Icon>
      <span>{props.label}</span>
    </Flex>
  </Link>
)

const MenuItemSignOut = (props) => {
  const dispatch = useDispatch()

  const handleSignOut = () => {
    dispatch(signOut())
  }

  return (
    <div onClick={handleSignOut}>
      <Flex alignItems="center" gap={SPACER[2]}>
        <Icon>
          <LogoutOutlined />
        </Icon>
        <span>{props.label}</span>
      </Flex>
    </div>
  )
}

const items = [
  {
    key: 'Edit Profile',
    label: (
      <MenuItem
        path="/app/pages/setting/edit-profile"
        label="Edit Profile"
        icon={<EditOutlined />}
      />
    ),
  },
  // {
  //   key: 'Account Setting',
  //   label: (
  //     <MenuItem path="/" label="Account Setting" icon={<SettingOutlined />} />
  //   ),
  // },
  // {
  //   key: 'Account Billing',
  //   label: (
  //     <MenuItem path="/" label="Account Billing" icon={<ShopOutlined />} />
  //   ),
  // },
  // {
  //   key: 'Help Center',
  //   label: (
  //     <MenuItem
  //       path="/"
  //       label="Help Center"
  //       icon={<QuestionCircleOutlined />}
  //     />
  //   ),
  // },
  {
    key: 'Sign Out',
    label: <MenuItemSignOut label="Sign Out" />,
  },
]

export const NavProfile = ({ mode }) => {
  const { user } = useSelector((state) => state.auth)
  console.log('my-user', user)
  return (
    <Dropdown placement="bottomRight" menu={{ items }} trigger={['click']}>
      <NavItem mode={mode}>
        <Profile>
          <Avatar icon={<UserOutlined />} />
          <UserInfo className="profile-text">
            <Name>{user?.username}</Name>
            <Title>{user?.role}</Title>
          </UserInfo>
        </Profile>
      </NavItem>
    </Dropdown>
  )
}

export default NavProfile
