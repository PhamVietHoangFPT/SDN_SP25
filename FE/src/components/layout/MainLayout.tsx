import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'

const { Content } = Layout

function MainLayout() {
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
      <Footer/>
    </Layout>
  )
}

export default MainLayout
