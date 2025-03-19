import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import SideBarManager from './SiderBar/SideBarManager'

const { Content } = Layout

function ManagerLayout() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <SideBarManager></SideBarManager>
      <Content
        style={{
          margin: '24px',
          overflow: 'initial',
          width: '100vw',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  )
}

export default ManagerLayout
