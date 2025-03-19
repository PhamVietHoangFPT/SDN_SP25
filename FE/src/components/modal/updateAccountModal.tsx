import React, { useEffect } from 'react'
import { Modal, Form, Input, Button, Typography, message, DatePicker, Switch } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Account } from '../../types/account'
import dayjs from 'dayjs'
import { useGetAccountDetailQuery, useUpdateAccountMutation } from '../../features/account/accountAPI'
interface AccountDetailResponse {
    data: Account
    isLoading: boolean
    isFetching: boolean
    error: any
}
interface UpdateAccountModalProps {
    visible: boolean
    id: string | null
    onClose: () => void
}
const { Text } = Typography
const UpdateAccountModal: React.FC<UpdateAccountModalProps> = ({
    visible,
    id,
    onClose,
}) => {
    const {
        data: childrenDetailData,
        isLoading: childrenDetailLoading,
        isFetching: chilrenDetailFetching,
        error: childrenDetailError,
    } = useGetAccountDetailQuery<AccountDetailResponse>(id, {
        skip: !id, // Skip query if no id
    })

    const [updateChildren, { isLoading: isUpdating }] =
        useUpdateAccountMutation()
    const childrenDetail = childrenDetailData ?? null
    console.log(childrenDetail)
    const [form] = Form.useForm()
    // Set dữ liệu vào form khi có data
    useEffect(() => {
        if (childrenDetail) {
            form.setFieldsValue({
                email: childrenDetail.email || '',
                dateOfBirth: childrenDetail.dateOfBirth
                    ? dayjs(childrenDetail.dateOfBirth)
                    : null, // Convert thành dayjs object
                phoneNumber: childrenDetail.phoneNumber,
                gender: childrenDetail.gender ? childrenDetail.gender : false,
            })
        }
    }, [childrenDetail, form])
    const handleUpdate = async (values: any) => {
        if (!id) return
        const inputValues = {
            email: values.email || '',
            dateOfBirth: values.dateOfBirth
                ? dayjs(values.dateOfBirth)
                : null, // Convert thành dayjs object
            phoneNumber: values.phoneNumber,
            gender: values.gender
        }
        try {
            await updateChildren({
                id,
                data: inputValues,
            }).unwrap()
            message.success('Successfully updated!')
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
                        dateOfBirth: childrenDetail.dateOfBirth
                            ? dayjs(childrenDetail.dateOfBirth)
                            : null,
                        email: childrenDetail.email,
                        phoneNumber: childrenDetail.phoneNumber,

                    }}
                >
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Phone Number'
                        name='phoneNumber'
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Date Of Birth'
                        name='dateOfBirth'
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker
                            disabledDate={(current) => current && current > dayjs().endOf('day')} // Không cho chọn ngày tương lai
                            style={{ width: '100%' }} format='YYYY-MM-DD' />
                    </Form.Item>
                    <Form.Item
                        label='Gender'
                        name='gender'
                        valuePropName='checked' // Switch dùng "checked" thay vì "value"
                    >
                        <Switch />
                    </Form.Item>
                    <Button type='primary' htmlType='submit' loading={isUpdating}>
                        Update
                    </Button>
                </Form>
            ) : (
                <p>No customer data available</p>
            )}
        </Modal>
    )
}

export default UpdateAccountModal
