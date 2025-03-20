import React, { useState, useMemo, useEffect } from 'react'
import {
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import { Menu, Layout } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import Logo from '../../../assets/Logo.png'

const { Header } = Layout

const Navbar: React.FC = () => {
  const location = useLocation()
  const [current, setCurrent] = useState(() => {
    const path = location.pathname.split('/')[1] || 'home'
    return path
  })

  useEffect(() => {
    setCurrent(location.pathname.split('/')[1] || 'home')
  }, [location.pathname])

  const userData = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null
  const navigate = useNavigate()

  const items = useMemo(() => {
    return [
      { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ', url: '/' },
      {
        key: 'products',
        label: 'Sản phẩm',
        icon: <FontAwesomeIcon icon={faBox} />,
        url: '/products?pageNumber=1&pageSize=12',
      },
      {
        key: userData ? 'profile' : 'login',
        icon: userData ? <UserOutlined /> : <LoginOutlined />,
        label: userData ? 'Hồ sơ' : 'Đăng nhập / Đăng ký',
        url: userData ? '/profile' : '/login',
      },
    ]
  }, [userData])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    const findItem = (items: any[], key: string) => {
      for (const item of items) {
        if (item.key === key) return item
        if (item.children) {
          const found: any = findItem(item.children, key)
          if (found) return found
        }
      }
      return null
    }

    const item = findItem(items, e.key)
    if (item?.url) {
      navigate(item.url)
    }
  }

  return (
    <Header
      style={{
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode='horizontal'
        style={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '20px',
            fontWeight: 'bold',
            height: '30px',
            margin: 20,
          }}
        >
          <img
            src={Logo}
            alt='Logo'
            style={{
              width: '50px',
              borderRadius: '50%',
            }}
          />
        </div>
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        ))}
        {userData && (
          <Menu.Item
            key='cart'
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/cart')}
          >
            Giỏ hàng của bạn
          </Menu.Item>
        )}
        {userData && (
          <Menu.Item
            key='orders'
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/orders')}
          >
            Đơn hàng đã đặt
          </Menu.Item>
        )}
        {userData && (
          <Menu.Item
            key='logout'
            icon={<LogoutOutlined />}
            onClick={() => {
              Cookies.remove('userData')
              Cookies.remove('userToken')
              navigate('/login')
            }}
          >
            Đăng xuất
          </Menu.Item>
        )}
      </Menu>
    </Header>
  )
}

export default Navbar
