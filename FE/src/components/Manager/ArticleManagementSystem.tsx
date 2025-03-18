import { useState, useEffect } from 'react'
import {
  Layout,
  Typography,
  message,
  Button,
  Table,
  Space,
  Popconfirm,
  Form,
  Input,
  Card,
  Row,
  Col,
} from 'antd'
import {
  UnderlineIcon as EditOutlined,
  DeleteIcon as DeleteOutlined,
  PlusIcon as PlusOutlined,
  ArrowLeft,
  Save,
} from 'lucide-react'
import {
  useGetArticlesQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} from '../../features/articles/articles'
import './ArticleManagement.css' // Thêm dòng này

const { Content } = Layout
const { Title } = Typography
const { TextArea } = Input

export interface Article {
  _id: string
  title: string
  content: string
  category: string
  image: string
  createdAt: string
  __v?: number
}

export default function ArticleManagementSystem() {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const { data: articles = [], isLoading } = useGetArticlesQuery({})
  const [addArticle] = useAddArticleMutation()
  const [updateArticle] = useUpdateArticleMutation()
  const [deleteArticle] = useDeleteArticleMutation()

  const handleAddArticle = () => {
    setEditingArticle(null)
    setIsFormVisible(true)
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setIsFormVisible(true)
  }

  const handleDeleteArticle = async (id: string) => {
    try {
      await deleteArticle(id).unwrap()
      messageApi.success('Bài viết đã được xóa thành công')
    } catch (error) {
      messageApi.error('Xóa bài viết thất bại')
    }
  }

  const handleSaveArticle = async (article: Article) => {
    try {
      if (editingArticle) {
        await updateArticle({ _id: article._id, ...article }).unwrap()
        messageApi.success('Bài viết đã được cập nhật thành công')
      } else {
        await addArticle(article).unwrap()
        messageApi.success('Bài viết đã được thêm thành công')
      }
      setIsFormVisible(false)
    } catch (error) {
      messageApi.error('Lưu bài viết thất bại')
    }
  }

  const handleCancelForm = () => {
    setIsFormVisible(false)
  }

  return (
    <Layout className='layout'>
      {contextHolder}
      <Content className='content'>
        <Title level={2} className='title title-level-2'>
          Quản lý bài viết
        </Title>

        {isFormVisible ? (
          <ArticleForm
            article={editingArticle}
            onSave={handleSaveArticle}
            onCancel={handleCancelForm}
          />
        ) : (
          <ArticleList
            articles={articles}
            onAdd={handleAddArticle}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
            isLoading={isLoading}
          />
        )}
      </Content>
    </Layout>
  )
}

function ArticleList({ articles, onAdd, onEdit, onDelete, isLoading }) {
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Article) => (
        <a onClick={() => onEdit(record)}>{text}</a>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: Article) => (
        <Space size='middle'>
          <Button
            icon={<EditOutlined className='lucide-icon' />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa bài viết này?'
            description='Hành động này không thể hoàn tác.'
            onConfirm={() => onDelete(record._id)}
            okText='Có'
            cancelText='Không'
          >
            <Button danger icon={<DeleteOutlined className='lucide-icon' />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const dataSource = (articles || []).map((article) => ({
    ...article,
    key: article._id,
  }))

  return (
    <div>
      <Row className='mb-4' justify='space-between' align='middle'>
        <Col>
          <Title level={4} className='title title-level-4'>
            Bài viết ({(articles || []).length})
          </Title>
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined className='lucide-icon' />}
            onClick={onAdd}
            style={{ marginLeft: '30px' }}
          >
            Thêm bài viết
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

function ArticleForm({ article, onSave, onCancel }) {
  const [form] = Form.useForm()

  const isEditing = !!article

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        ...article,
      })
    }
  }, [article, form])

  const handleFinish = (values) => {
    const savedArticle: Article = {
      _id: article?._id || '',
      title: values.title,
      content: values.content,
      category: values.category,
      image: values.image || '',
      createdAt: article?.createdAt || new Date().toISOString(),
    }
    onSave(savedArticle)
  }

  return (
    <Card className='ant-card'>
      <Row className='mb-4' align='middle'>
        <Col span={24}>
          <Space>
            <Button
              icon={<ArrowLeft className='lucide-icon' />}
              onClick={onCancel}
            >
              Quay lại
            </Button>
            <Title level={4} className='title title-level-4 m-0'>
              {isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}
            </Title>
          </Space>
        </Col>
      </Row>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          title: '',
          content: '',
          category: '',
          image: '',
        }}
      >
        <Form.Item
          name='title'
          label='Tiêu đề'
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề bài viết' },
          ]}
        >
          <Input placeholder='Nhập tiêu đề bài viết' />
        </Form.Item>

        <Form.Item
          name='category'
          label='Danh mục'
          rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
        >
          <Input placeholder='Nhập danh mục' />
        </Form.Item>

        <Form.Item name='image' label='URL hình ảnh'>
          <Input placeholder='Nhập URL hình ảnh hoặc để trống' />
        </Form.Item>

        <Form.Item
          name='content'
          label='Nội dung'
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung bài viết' },
          ]}
        >
          <TextArea rows={6} placeholder='Nhập nội dung bài viết' />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type='primary'
              htmlType='submit'
              icon={<Save className='lucide-icon' />}
            >
              Lưu bài viết
            </Button>
            <Button onClick={onCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
