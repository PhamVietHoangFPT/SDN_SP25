import React, { useEffect, useState } from 'react'
import { Category } from '../../types/category'
import { useGetCategoryListQuery } from '../../features/cateogory/categoryAPI'
import { useSearchParams } from 'react-router-dom'
import { DeleteOutlined, EditOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Table } from 'antd'
interface CategoryListResponse {
    data: {
        categories: Category[]
        totalItems: number
    }
    error: any
    isLoading: boolean
    isFetching: boolean
}

const ManageCategory: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    // Pagination and search states
    const initialPage = parseInt(searchParams.get('page') || '1', 10)
    const initialSearch = searchParams.get('name') || ''
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [searchTerm, setSearchTerm] = useState(initialSearch)


    const pageSize = 7
    const {
        data: categories,
        isLoading: categoryLoading,
        isFetching: categoryFetching,
    } = useGetCategoryListQuery<CategoryListResponse>({
        pageNumber: currentPage,
        pageSize: pageSize,
        name: searchTerm
    })

    const dateCategory = categories?.categories ?? []
    const totalCategory = categories?.totalItems ?? 0
    // Update URL search params
    useEffect(() => {
        setSearchParams({
            page: currentPage.toString(),
            name: searchTerm,
        })
    }, [currentPage, searchTerm, setSearchParams])

    if (categoryLoading) {
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

    // Table columns
    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            render: (_: any, __: any, index: number) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
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
            render: (_: any,) => (
                <Button
                    color='primary'
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
                    placeholder="Search by category name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={dateCategory.map((item, index) => ({
                    ...item,
                    key: item.id,
                    index: (currentPage - 1) * pageSize + index + 1,
                    children: undefined,
                }))}
                loading={categoryFetching}
                bordered
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalCategory,
                    onChange: (page) => {
                        setCurrentPage(page)
                    },
                }}
            />
        </div>
    )
}
export default ManageCategory;
