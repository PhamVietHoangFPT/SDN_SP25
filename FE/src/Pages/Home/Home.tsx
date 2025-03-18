import React from 'react'
import { Layout, Typography } from 'antd'
import { ProductSlider } from '../../components/product/productSlider'

const { Content } = Layout
const { Title, Paragraph } = Typography

const Homepage: React.FC = () => {
  return (
    <Layout>
      <Content>
        <Title level={1}>Welcome to the our skincare system</Title>
        <Paragraph>We provide the best skincare products for you.</Paragraph>
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
            }}
          >
            <Title
              level={2}
              style={{ textAlign: 'center', marginBottom: '32px' }}
            >
              Popular Products
            </Title>
            <ProductSlider />
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default Homepage
