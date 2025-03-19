import React from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { useAddCategoryMutation } from '../../features/category/categoryAPI'

interface AddCategoryModalProps {
  visible: boolean
  onClose: () => void
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm()
  const [addCategory, { isLoading }] = useAddCategoryMutation()

  const handleAdd = async (values: any) => {
    try {
      await addCategory({ name: values.name }).unwrap()
      message.success('Category added successfully!')
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Add error:', error)
      message.error('Failed to add category')
    }
  }

  return (
    <Modal
      title='Add New Category'
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout='vertical' onFinish={handleAdd}>
        <Form.Item
          label='Category Name'
          name='name'
          rules={[
            { required: true, message: 'Please enter a category name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input placeholder='Enter category name' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={isLoading}>
            Add Category
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCategoryModal
