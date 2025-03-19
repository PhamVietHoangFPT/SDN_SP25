import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  type FormInstance,
} from 'antd'
import { useGetCategoryListQuery } from '../../../features/category/categoryAPI'

interface ProductFormProps {
  open: boolean
  onCancel: () => void
  onSave: (values: any) => void
  product: any
  form: FormInstance
}

export default function ProductForm({
  open,
  onCancel,
  onSave,
  product,
  form,
}: ProductFormProps) {
  const isEditing = !!product

  const {
    data,
    isLoading: isLoadingCategories,
    error,
  } = useGetCategoryListQuery({})

  const categories = data?.categories || []
  console.log('Dữ liệu từ API:', data)
  console.log('Categories:', categories)
  console.log('Product:', product) // Log để kiểm tra khi sửa
  console.log('Lỗi:', error)

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Dữ liệu gửi đi:', values) // Log để kiểm tra giá trị gửi lên
        onSave(values)
      })
      .catch((error) => {
        console.log('Xác thực thất bại:', error)
      })
  }

  return (
    <Modal
      open={open}
      title={isEditing ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
      okText={isEditing ? 'Cập Nhật' : 'Tạo'}
      cancelText='Hủy'
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={product || { images: 'none', sold: 0 }}
        className='pt-4'
      >
        <Form.Item
          name='name'
          label='Tên Sản Phẩm'
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder='Nhập tên sản phẩm' />
        </Form.Item>

        <Form.Item
          name='category'
          label='Danh Mục'
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select
            placeholder='Chọn danh mục'
            loading={isLoadingCategories}
            disabled={isLoadingCategories || categories.length === 0}
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category: any) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name} {/* Hiển thị tên */}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value=''>
                Không có danh mục
              </Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name='price'
          label='Giá ($)'
          rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            placeholder='Nhập giá'
            className='w-full'
            addonBefore='$'
          />
        </Form.Item>

        <Form.Item
          name='stock'
          label='Số Lượng Tồn'
          rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn' }]}
        >
          <InputNumber
            min={0}
            placeholder='Nhập số lượng tồn'
            className='w-full'
          />
        </Form.Item>

        <Form.Item name='description' label='Mô Tả'>
          <Input.TextArea placeholder='Nhập mô tả sản phẩm' rows={3} />
        </Form.Item>

        <Form.Item
          name='images'
          label='URL Hình Ảnh'
          rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
        >
          <Input placeholder='Nhập URL hình ảnh (ví dụ: http://example.com/image.jpg)' />
        </Form.Item>

        {isEditing && (
          <Form.Item name='sold' label='Đã Bán'>
            <InputNumber
              min={0}
              placeholder='Số lượng đã bán'
              className='w-full'
              disabled
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
