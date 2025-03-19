import React, { useEffect, useState } from 'react'
import { Account } from '../../../types/account'
import { useSearchParams } from 'react-router-dom'
import { useGetAccountListQuery } from '../../../features/account/accountAPI'
import { DeleteOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'
interface AccountListResponse {
    data: {
        accounts: Account[]
        totalItems: number
    }
    error: any
    isLoading: boolean
    isFetching: boolean
}
const ManageAccount: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(
        parseInt(searchParams.get('page') || '1', 10)
    )
    const [searchTerm, setSearchTerm] = useState(searchParams.get('username') || '')
    const pageSize = 7

    const {
        data: accounts,
        isLoading: accountLoading,
        isFetching: accountFetching,
    } = useGetAccountListQuery<AccountListResponse>({
        pageNumber: currentPage,
        pageSize: pageSize,
        username: searchTerm,
    })
    const dataAccount = accounts?.accounts ?? []
    const totalAccount = accounts?.totalItems ?? 0

    useEffect(() => {
        setSearchParams({
            page: currentPage.toString(),
            username: searchTerm,
        })
    }, [currentPage, searchTerm, setSearchParams])

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
        )
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Update',
            key: 'update',
            render: (_: any) => (
                <Button
                    type='primary'
                    icon={<EditOutlined />}
                />
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_: any) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                />
            ),
        },
    ]
    return (
        <div style={{ padding: 20, background: '#fff', borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder='Search by name'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={dataAccount.map((item, index) => ({
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
                    total: totalAccount,
                    onChange: (page) => {
                        setCurrentPage(page)
                    },
                }}
            />
        </div>
    )
}
export default ManageAccount
