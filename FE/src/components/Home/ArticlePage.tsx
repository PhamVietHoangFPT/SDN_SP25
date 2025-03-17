import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Spin,
  Input,
  Alert,
  Tag,
} from 'antd'
import {
  CalendarOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'
import axios from 'axios'

const { Title, Text, Paragraph } = Typography

const Home = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/articles')
        setArticles(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Lỗi khi lấy bài viết:', err)
        setError('Không thể tải bài viết. Vui lòng thử lại sau!')
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #e6e9f0 100%)',
        padding: '30px',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Featured Article */}
      <FeaturedArticle />

      {/* Latest Articles */}
      <section
        style={{
          maxWidth: 1200,
          margin: '50px auto',
          padding: '30px',
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <Space
          direction='horizontal'
          style={{
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
              color: '#2c3e50',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            Bài viết mới nhất
          </Title>
          <Button
            type='link'
            icon={<RightOutlined />}
            style={{
              color: '#e74c3c',
              fontWeight: 600,
              fontSize: 16,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c0392b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e74c3c')}
          >
            Xem tất cả
          </Button>
        </Space>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size='large' tip='Đang tải bài viết...' />
          </div>
        ) : error ? (
          <Alert
            message={error}
            type='error'
            showIcon
            style={{ marginBottom: 20, borderRadius: 10 }}
          />
        ) : (
          <ArticleGrid articles={articles} />
        )}
      </section>
    </div>
  )
}

// Featured Article Component
const FeaturedArticle = () => (
  <section
    style={{
      maxWidth: 1200,
      margin: '50px auto',
      padding: '30px',
      background: '#ffffff',
      borderRadius: 20,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)'
      e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.12)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)'
    }}
  >
    <Row gutter={[32, 32]} align='middle'>
      <Col xs={24} md={12}>
        <img
          src='/placeholder.svg?height=400&width=600'
          alt='Featured Article'
          style={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: 15,
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Col>
      <Col xs={24} md={12}>
        <Space direction='vertical' size='large'>
          <Tag
            color='#3498db'
            style={{
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 14,
            }}
          >
            Nổi bật
          </Tag>
          <Title
            level={2}
            style={{
              margin: 0,
              color: '#2c3e50',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Hướng dẫn chăm sóc da tối ưu
          </Title>
          <Space size='middle'>
            <Text style={{ color: '#7f8c8d', fontSize: 14 }}>
              <CalendarOutlined /> 15/03/2025
            </Text>
            <Text style={{ color: '#7f8c8d', fontSize: 14 }}>
              <ClockCircleOutlined /> 8 phút đọc
            </Text>
          </Space>
          <Paragraph
            style={{
              color: '#34495e',
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Khám phá cách chăm sóc da hiệu quả dựa trên khoa học để có làn da
            rạng rỡ.
          </Paragraph>
          <Button
            type='primary'
            style={{
              borderRadius: 10,
              background: '#e74c3c',
              border: 'none',
              padding: '10px 25px',
              fontSize: 16,
              fontWeight: 600,
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#c0392b')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#e74c3c')}
          >
            Đọc bài viết
          </Button>
        </Space>
      </Col>
    </Row>
  </section>
)

// Article Grid Component
const ArticleGrid = ({ articles }) => (
  <Row gutter={[24, 24]}>
    {articles.map((article) => (
      <Col xs={24} sm={12} md={8} key={article._id}>
        <Card
          hoverable
          cover={
            <img
              src={article.image || '/placeholder.svg'}
              alt={article.title}
              style={{
                height: 200,
                objectFit: 'cover',
                borderRadius: '15px 15px 0 0',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            />
          }
          style={{
            borderRadius: 15,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.06)'
          }}
        >
          <Space direction='vertical' size='middle' style={{ padding: '15px' }}>
            <Tag
              color='#1abc9c'
              style={{
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {article.category}
            </Tag>
            <Title
              level={4}
              style={{
                margin: 0,
                color: '#2c3e50',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              <a
                href={`/articles/${article._id}`}
                style={{ color: '#2c3e50', textDecoration: 'none' }}
              >
                {article.title}
              </a>
            </Title>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ color: '#7f8c8d', fontSize: 14, lineHeight: 1.5 }}
            >
              {article.content.substring(0, 100) + '...'}
            </Paragraph>
            <Space split={<Text type='secondary'>•</Text>}>
              <Text style={{ color: '#95a5a6', fontSize: 13 }}>
                {new Date(article.createdAt).toLocaleDateString()}
              </Text>
              <Text style={{ color: '#95a5a6', fontSize: 13 }}>5 phút đọc</Text>
            </Space>
          </Space>
        </Card>
      </Col>
    ))}
  </Row>
)

export default Home
