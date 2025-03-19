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
    data: categories = [],
    isLoading: isLoadingCategories,
    error,
  } = useGetCategoryListQuery({})
  console.log('Categories:', categories)
  console.log('Error:', error)

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values)
      })
      .catch((error) => {
        console.log('Validation failed:', error)
      })
  }

  return (
    <Modal
      open={open}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      okText={isEditing ? 'Update' : 'Create'}
      cancelText='Cancel'
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
          label='Product Name'
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder='Enter product name' />
        </Form.Item>

        <Form.Item
          name='category'
          label='Category'
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder='Select a category'
            loading={isLoadingCategories}
            disabled={isLoadingCategories || categories.length === 0}
          >
            {categories.map((category: any) => (
              <Select.Option key={category._id} value={category.name}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='price'
          label='Price ($)'
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            placeholder='Enter price'
            className='w-full'
            addonBefore='$'
          />
        </Form.Item>

        <Form.Item
          name='stock'
          label='Stock'
          rules={[{ required: true, message: 'Please enter stock quantity' }]}
        >
          <InputNumber
            min={0}
            placeholder='Enter stock quantity'
            className='w-full'
          />
        </Form.Item>

        <Form.Item
          name='description'
          label='Description'
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder='Enter product description' rows={3} />
        </Form.Item>

        <Form.Item
          name='images'
          label='Image URL'
          rules={[{ required: true, message: 'Please enter image URL' }]}
        >
          <Input placeholder='Enter image URL (e.g., http://example.com/image.jpg)' />
        </Form.Item>

        {isEditing && (
          <Form.Item name='sold' label='Sold'>
            <InputNumber
              min={0}
              placeholder='Number of items sold'
              className='w-full'
              disabled
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
