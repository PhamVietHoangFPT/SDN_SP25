import React, { useEffect, useState } from 'react';
import { Account } from '../../../types/account';
import { useSearchParams } from 'react-router-dom';
import { useDeleteAccountMutation, useGetAccountListQuery } from '../../../features/account/accountAPI';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import UpdateAccountModal from '../../../components/modal/updateAccountModal';
import AddAccountModal from '../../../components/modal/addAccountModal';

interface AccountListResponse {
    data: {
        accounts: Account[];
        totalItems: number;
    };
    error: any;
    isLoading: boolean;
    isFetching: boolean;
}

const userData = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null;

const ManageAccount: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(
        parseInt(searchParams.get('page') || '1', 10)
    );
    const [searchTerm, setSearchTerm] = useState(searchParams.get('username') || '');
    const pageSize = 7;
    // Modal state
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState(false) // State for add modal
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

    const {
        data: accounts,
        isLoading: accountLoading,
        isFetching: accountFetching,
    } = useGetAccountListQuery<AccountListResponse>({
        pageNumber: currentPage,
        pageSize: pageSize,
        username: searchTerm,
    });

    const dataAccount = accounts?.accounts ?? [];
    const totalAccount = accounts?.totalItems ?? 0;
    // Filter out the current user's account
    const filteredDataAccount = dataAccount.filter((account) =>
        account.username !== userData?.username
    );
    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation()

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this account? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteAccount(id).unwrap();
                    message.success('Account deleted successfully!');
                } catch (error: any) {
                    console.error('Delete error:', error);
                    message.error(error.data?.message || 'Failed to delete account');
                }
            },
            onCancel() {
                // Do nothing if canceled
            },
        });
    };
    useEffect(() => {
        setSearchParams({
            page: currentPage.toString(),
            username: searchTerm,
        });
    }, [currentPage, searchTerm, setSearchParams]);

    if (accountLoading) {
        return (
            <LoadingOutlined
                style={{
                    fontSize: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30vh',
                }}
            />
        );
    }

    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Date of birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (dateOfBirth: Date) => {
                return dateOfBirth ? dayjs(dateOfBirth).format('DD-MM-YYYY') : '-';
            },
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: boolean) => (gender ? 'Male' : 'Female'),
        },
        {
            title: 'Update',
            key: 'update',
            render: (_: any, record: Account) => (
                <Button
                    type='primary'
                    icon={<EditOutlined />}
                    onClick={() => {
                        setSelectedChildId(record._id) // Set the selected customer ID
                        setIsDetailModalVisible(true) // Show the modal
                    }}
                />
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_: any, record: Account) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record._id)}
                    loading={isDeleting}
                />
            ),
        },
    ];

    // Handle modal close
    const handleDetailModalClose = () => {
        setIsDetailModalVisible(false)
        setSelectedChildId(null)
    }
    return (
        <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    allowClear
                />
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                >
                    Add Account
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredDataAccount.map((item, index) => ({
                    ...item,
                    key: item._id,
                    index: (currentPage - 1) * pageSize + index + 1,
                    children: undefined,
                }))}
                loading={accountFetching}
                bordered
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalAccount - (userData ? 1 : 0), // Adjust total count
                    onChange: (page) => {
                        setCurrentPage(page);
                    },
                }}
            />
            <UpdateAccountModal
                visible={isDetailModalVisible}
                id={selectedChildId}
                onClose={handleDetailModalClose}
            />
            <AddAccountModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
            />
        </div>
    );
};

export default ManageAccount;