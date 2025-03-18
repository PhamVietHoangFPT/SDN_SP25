import { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Typography,
  Input,
  Form,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import ProductForm from './ProductForm'
import {
  useGetProductListQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../../features/product/productAPI'

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  const {
    data,
    isLoading: isFetchingProducts,
    isError,
  } = useGetProductListQuery({
    pageNumber: 1,
    pageSize: 100,
    sort: 'name',
    name: searchText,
  })

  const products = Array.isArray(data) ? data : []

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation()
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation()

  const handleAdd = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setEditingProduct(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap()
      message.success('Product deleted successfully')
    } catch (error) {
      message.error('Failed to delete product')
    }
  }

  const handleSave = async (values: any) => {
    console.log('Saving values:', values)
    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct._id,
          ...values,
        }).unwrap()
        message.success('Product updated successfully')
      } else {
        await addProduct(values).unwrap()
        message.success('Product added successfully')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(`Failed to ${editingProduct ? 'update' : 'add'} product`)
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (text: string) => (
        <img
          style={{ width: '200px', height: '200px' }}
          src={text || '/placeholder.svg'}
          alt='Product'
          className='w-16 h-16 object-cover rounded'
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: Array.from(new Set(products.map((p: any) => p.category))).map(
        (category) => ({
          text: category,
          value: category,
        })
      ),
      onFilter: (value: any, record: any) => record.category === value,
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            loading={isUpdating && editingProduct?._id === record._id}
          >
            Edit
          </Button>
          <Popconfirm
            title='Delete this product?'
            description='Are you sure you want to delete this product?'
            onConfirm={() => handleDelete(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (isError) {
    return <div>Error loading products. Please try again later.</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Typography.Title level={2}>Product Management</Typography.Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAdd}
          loading={isAdding}
          style={{ marginBottom: '20px' }}
        >
          Add Product
        </Button>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Search products by name or category'
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          className='max-w-md'
          allowClear
          style={{ marginBottom: '20px' }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey='_id'
        loading={isFetchingProducts}
        pagination={{ pageSize: 5 }}
      />

      <ProductForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
        form={form}
      />
    </div>
  )
}
