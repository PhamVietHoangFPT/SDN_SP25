import React from 'react';
import { Modal, Form, Input, Button, message, DatePicker, Select, Switch } from 'antd';
import { useAddAccountMutation } from '../../features/account/accountAPI';
import dayjs from 'dayjs';

interface AddAccountModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [addAccount, { isLoading }] = useAddAccountMutation();

    const handleAdd = async (values: any) => {
        try {
            // Prepare the data to match the backend API
            const accountData = {
                username: values.username,
                password: values.password, // Only send password, not confirmPassword
                email: values.email,
                phoneNumber: values.phoneNumber,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : undefined,
                gender: values.gender,
                role: values.role,
            };

            await addAccount(accountData).unwrap();
            message.success('Account added successfully!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Add account error:', error);
            message.error('Failed to add account');
        }
    };

    return (
        <Modal
            title="Add New Account"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleAdd}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Please enter a username' },
                        { min: 3, message: 'Username must be at least 3 characters' },
                    ]}
                >
                    <Input placeholder="Enter username" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter a password' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']} // This field depends on the password field
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm password" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter an email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: 'Please enter a phone number' },
                        { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits' },
                    ]}
                >
                    <Input placeholder="Enter phone number" />
                </Form.Item>

                <Form.Item
                    label='Date Of Birth'
                    name='dateOfBirth'
                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                >
                    <DatePicker
                        disabledDate={(current) => current && current > dayjs().endOf('day')} // Không cho chọn ngày tương lai
                        style={{ width: '100%' }} format='DD-MM-YYYY' />
                </Form.Item>
                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select a role' }]}
                >
                    <Select placeholder="Select a role">
                        <Select.Option value="Customer">Customer</Select.Option>
                        <Select.Option value="Staff">Staff</Select.Option>
                        <Select.Option value="Manager">Manager</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label='Gender'
                    name='gender'
                    valuePropName='checked' // Switch dùng "checked" thay vì "value"
                >
                    <Switch />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Add Account
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={onClose}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddAccountModal;