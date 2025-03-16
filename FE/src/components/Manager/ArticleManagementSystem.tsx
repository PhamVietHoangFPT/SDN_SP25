
import { useState } from 'react'
import {
  Layout,
  Typography,
  message,
  Button,
  Table,
  Tag,
  Space,
  Popconfirm,
  Form,
  Input,
  Card,
  Select,
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

const { Content } = Layout
const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

export interface Article {
  id: string
  title: string
  content: string
  author: string
  publishDate: Date
  imageUrl: string
  tags: string[]
}

export default function ArticleManagementSystem() {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  // Gọi API để lấy danh sách articles
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
      messageApi.success('Article deleted successfully')
    } catch (error) {
      messageApi.error('Failed to delete article')
    }
  }

  const handleSaveArticle = async (article: Article) => {
    try {
      if (editingArticle) {
        // Cập nhật article
        await updateArticle({ id: article.id, ...article }).unwrap()
        messageApi.success('Article updated successfully')
      } else {
        // Thêm article mới
        await addArticle(article).unwrap()
        messageApi.success('Article added successfully')
      }
      setIsFormVisible(false)
    } catch (error) {
      messageApi.error('Failed to save article')
    }
  }

  const handleCancelForm = () => {
    setIsFormVisible(false)
  }

  return (
    <Layout className='min-h-screen bg-white'>
      {contextHolder}
      <Content className='p-4 md:p-6'>
        <Title level={2} className='mb-6'>
          Article Management
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Article) => (
        <a onClick={() => onEdit(record)}>{text}</a>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Publish Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color='blue' key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record: Article) => (
        <Space size='middle'>
          <Button
            icon={<EditOutlined className='h-4 w-4' />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title='Delete this article?'
            description='This action cannot be undone.'
            onConfirm={() => onDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger icon={<DeleteOutlined className='h-4 w-4' />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row className='mb-4' justify='space-between' align='middle'>
        <Col>
          <Title level={4}>Articles ({articles.length})</Title>
        </Col>
        <Col>
          <Button
            type='primary'
            icon={<PlusOutlined className='h-4 w-4' />}
            onClick={onAdd}
          >
            Add Article
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={articles.map((article) => ({
          ...article,
          key: article.id,
        }))}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

function ArticleForm({ article, onSave, onCancel }) {
  const [form] = Form.useForm()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const isEditing = !!article

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        ...article,
        tags: article.tags,
      })
      setSelectedTags(article.tags)
    }
  }, [article, form])

  const handleFinish = (values) => {
    const savedArticle: Article = {
      id: article?.id || '',
      title: values.title,
      content: values.content,
      author: values.author,
      publishDate: article?.publishDate || new Date(),
      imageUrl: values.imageUrl || '',
      tags: values.tags,
    }
    onSave(savedArticle)
  }

  const tagOptions = [
    'React',
    'JavaScript',
    'TypeScript',
    'Next.js',
    'Ant Design',
    'UI',
    'UX',
    'Frontend',
    'Backend',
    'Design System',
    'CSS',
    'HTML',
    'Web Development',
  ]

  return (
    <Card>
      <Row className='mb-4' align='middle'>
        <Col span={24}>
          <Space>
            <Button icon={<ArrowLeft className='h-4 w-4' />} onClick={onCancel}>
              Back
            </Button>
            <Title level={4} className='m-0'>
              {isEditing ? 'Edit Article' : 'Add New Article'}
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
          author: '',
          imageUrl: '',
          tags: [],
        }}
      >
        <Form.Item
          name='title'
          label='Title'
          rules={[
            { required: true, message: 'Please enter the article title' },
          ]}
        >
          <Input placeholder='Enter article title' />
        </Form.Item>

        <Form.Item
          name='author'
          label='Author'
          rules={[{ required: true, message: 'Please enter the author name' }]}
        >
          <Input placeholder='Enter author name' />
        </Form.Item>

        <Form.Item name='imageUrl' label='Image URL'>
          <Input placeholder='Enter image URL or leave empty' />
        </Form.Item>

        <Form.Item
          name='content'
          label='Content'
          rules={[
            { required: true, message: 'Please enter the article content' },
          ]}
        >
          <TextArea rows={6} placeholder='Enter article content' />
        </Form.Item>

        <Form.Item name='tags' label='Tags'>
          <Select
            mode='multiple'
            placeholder='Select tags'
            style={{ width: '100%' }}
            onChange={setSelectedTags}
            value={selectedTags}
          >
            {tagOptions.map((tag) => (
              <Option key={tag} value={tag}>
                {tag}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type='primary'
              htmlType='submit'
              icon={<Save className='h-4 w-4' />}
            >
              Save Article
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}
