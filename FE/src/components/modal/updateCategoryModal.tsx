import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, message } from 'antd';
import { Category } from '../../types/category';
import { LoadingOutlined } from '@ant-design/icons'
import { useGetCategoryDetailQuery, useUpdateCategoryMutation } from '../../features/cateogory/categoryAPI';
interface CategoryDetailResponse {
    data:Category
    isLoading: boolean
    isFetching: boolean
    error: any
}
interface UpdateCategoryModalProps {
    visible: boolean;
    id: string | null
    onClose: () => void
}
const { Text } = Typography
const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
    visible,
    id,
    onClose,
}) => {
    const {
        data: childrenDetailData,
        isLoading: childrenDetailLoading,
        isFetching: chilrenDetailFetching,
        error: childrenDetailError,
    } = useGetCategoryDetailQuery<CategoryDetailResponse>(id, {
        skip: !id, // Skip query if no id
    })

    const [updateChildren, { isLoading: isUpdating }] =
        useUpdateCategoryMutation()

    const childrenDetail = childrenDetailData ?? null
    console.log(childrenDetail)
    const [form] = Form.useForm();
    // Set dữ liệu vào form khi có data
    useEffect(() => {
        if (childrenDetail) {
            form.setFieldsValue({
                name: childrenDetail.name || '',
            })
        }
    }, [childrenDetail, form])
    const handleUpdate = async (values: any) => {
        if (!id) return
        const inputValues = {
            name: values.name,
        }
        try {
            await updateChildren({
                id,
                data: inputValues,
            }).unwrap()
            message.success('Successfully updated')
            onClose()
        } catch (err: any) {
            console.error('Lỗi từ API:', err) //
            message.error(err.data?.message || 'Fail to update')
        }
    }
    if (childrenDetailError) {
        const errorMessage =
            'status' in childrenDetailError
                ? childrenDetailError.status
                : childrenDetailError.message
        return (
            <Modal
                title='Lỗi'
                visible={visible}
                onCancel={onClose}
                footer={<Button onClick={onClose}>Đóng</Button>}
            >
                <Text type='danger'>Lỗi: {errorMessage}</Text>
            </Modal>
        )
    }

    return (
        <Modal
            title='Category Details'
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key='close' onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            {childrenDetailLoading || chilrenDetailFetching ? (
                <LoadingOutlined
                    style={{
                        fontSize: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '30vh',
                    }}
                />
            ) : childrenDetail ? (
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleUpdate}
                    initialValues={{
                        name: childrenDetail.name,
                    }}
                >
                    <Form.Item
                        label='Category Name'
                        name='name'
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' loading={isUpdating}>
                        Update
                    </Button>
                </Form>
            ) : (
                <p>No customer data available</p>
            )}
        </Modal>
    );
};

export default UpdateCategoryModal;