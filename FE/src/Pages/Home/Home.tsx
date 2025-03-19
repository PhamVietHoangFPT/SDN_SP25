import React from 'react'
import { Layout, Typography } from 'antd'
import { ProductSlider } from '../../components/product/productSlider'
import { Banner } from '../../components/layout/Banner/Banner'

const { Content } = Layout
const { Title, Paragraph } = Typography

const Homepage: React.FC = () => {
  return (
    <Layout>
      <Content>
        <Banner />
        <Title style={{ display: 'flex', justifyContent: 'center' }} level={1}>
          Chào mừng bạn đến với hệ thống chăm sóc da của chúng tôi
        </Title>
        <Paragraph style={{ display: 'flex', justifyContent: 'center' }}>
          Chúng tôi cung cấp các sản phẩm chăm sóc da tốt nhất cho bạn.
        </Paragraph>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '70vw',
              height: '200px',
            }}
          >
            <Title
              level={2}
              style={{ textAlign: 'center', marginBottom: '32px' }}
            >
              Sản phẩm phổ biến
            </Title>
            {/* <ProductSlider /> */}
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default Homepage
