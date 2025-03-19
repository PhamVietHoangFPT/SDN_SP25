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
import { useGetCategoryListQuery } from '../../../features/category/categoryAPI' // Thêm import

export default function ProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  const {
    data: productData,
    isLoading: isFetchingProducts,
    isError: isProductError,
  } = useGetProductListQuery({
    pageNumber: 1,
    pageSize: 100,
    sort: 'name',
    name: searchText,
  })

  const { data: categoryData, isLoading: isFetchingCategories } =
    useGetCategoryListQuery({}) // Lấy danh sách danh mục

  const products = Array.isArray(productData) ? productData : []
  const categories = categoryData?.categories || [] // Danh sách danh mục

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
      message.success('Xóa sản phẩm thành công')
    } catch (error) {
      message.error('Xóa sản phẩm thất bại')
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
        message.success('Cập nhật sản phẩm thành công')
      } else {
        await addProduct(values).unwrap()
        message.success('Thêm sản phẩm thành công')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(
        `Không thể ${editingProduct ? 'cập nhật' : 'thêm'} sản phẩm`
      )
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const columns = [
    {
      title: 'Hình Ảnh',
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
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh Mục',
      dataIndex: 'category',
      key: 'category',
      render: (categoryId: string) => {
        const category = categories.find((cat: any) => cat._id === categoryId)
        return category ? category.name : 'Không xác định' // Hiển thị tên thay vì _id
      },
      filters: categories.map((category: any) => ({
        text: category.name, // Hiển thị tên trong bộ lọc
        value: category._id, // Giá trị lọc vẫn là _id
      })),
      onFilter: (value: any, record: any) => record.category === value,
    },
    {
      title: 'Giá ($)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Tồn Kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    {
      title: 'Hành Động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            loading={isUpdating && editingProduct?._id === record._id}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xóa sản phẩm này?'
            description='Bạn có chắc muốn xóa sản phẩm này không?'
            onConfirm={() => handleDelete(record._id)}
            okText='Có'
            cancelText='Không'
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (isProductError) {
    return <div>Lỗi khi tải sản phẩm. Vui lòng thử lại sau.</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <Typography.Title level={2}>Quản Lý Sản Phẩm</Typography.Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAdd}
          loading={isAdding}
          style={{ marginBottom: '20px' }}
        >
          Thêm Sản Phẩm
        </Button>
      </div>

      <div className='mb-4'>
        <Input
          placeholder='Tìm kiếm sản phẩm theo tên hoặc danh mục'
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
        loading={isFetchingProducts || isFetchingCategories} // Thêm isFetchingCategories
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
