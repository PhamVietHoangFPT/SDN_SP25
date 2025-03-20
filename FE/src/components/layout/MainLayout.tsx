import { Outlet, useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import Navbar from './Navbar/Navbar'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
const { Content } = Layout

function MainLayout() {
  const userData = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null
  const navigate = useNavigate()

  useEffect(() => {
    if (userData.role === 'Manager' || userData.role === 'Staff') {
      navigate(`/${userData.role}`)
    }
  }, [userData, navigate])

  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Navbar />
      <Content
        style={{
          margin: '24px',
          padding: '20px',
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout
