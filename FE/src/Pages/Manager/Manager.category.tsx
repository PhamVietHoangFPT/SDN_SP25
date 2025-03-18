import React, { useEffect, useState } from 'react';
import { Category } from '../../types/category';
import { useDeleteCategoryMutation, useGetCategoryListQuery } from '../../features/cateogory/categoryAPI';
import { useSearchParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Table } from 'antd';
import UpdateCategoryModal from '../../components/modal/updateCategoryModal';
import AddCategoryModal from '../../components/modal/addCategoryModal';

interface CategoryListResponse {
    data: {
        categories: Category[];
        totalItems: number;
    };
    error: any;
    isLoading: boolean;
    isFetching: boolean;
}

const ManageCategory: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
    const [searchTerm, setSearchTerm] = useState(searchParams.get('name') || '');
    // Modal state
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for add modal
    const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
    const pageSize = 7;
    const {
        data: categories,
        isLoading: categoryLoading,
        isFetching: categoryFetching,
    } = useGetCategoryListQuery<CategoryListResponse>({
        pageNumber: currentPage,
        pageSize: pageSize,
        name: searchTerm,
    });

    const dateCategory = categories?.categories ?? [];
    const totalCategory = categories?.totalItems ?? 0;
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const handleDelete = async (_id: string) => {
        try {
            await deleteCategory(_id).unwrap();
            message.success('Category deleted successfully!');
        } catch (error:any) {
            console.error('Delete error:', error);
            message.error(error.data?.message || 'Không thể cập nhật thông tin')
        }
    };
    useEffect(() => {
        setSearchParams({
            page: currentPage.toString(),
            name: searchTerm,
        });
    }, [currentPage, searchTerm, setSearchParams]);

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
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Update',
            key: 'update',
            render: (_: any, record: Category) => (
                <Button
                    type="primary"
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
            render: (_: any, record: Category) => (
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
                    placeholder="Search by category name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    allowClear
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalVisible(true)}
                >
                    Add Category
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={dateCategory.map((item, index) => ({
                    ...item,
                    key: item._id,
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
                        setCurrentPage(page);
                    },
                }}
            />
            <UpdateCategoryModal
                visible={isDetailModalVisible}
                id={selectedChildId}
                onClose={handleDetailModalClose}
            />
            <AddCategoryModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
            />
        </div>
    );
};

export default ManageCategory;