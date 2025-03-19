import { useCallback, useEffect, useState } from 'react'
import { useGetOrdersQuery, useUpdateOrderMutation } from '../../features/order/orderAPI'
import { Order as OrderType } from '../../types/order'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Table, Select, Spin, Tag, Button, message } from 'antd'

const { Option } = Select

const validStatuses = [
  'Processing',
  'Pending',
  'Delivered',
  'Cancelled',
  'Paid',
  'Refunded'
]

interface OrderResponse {
  data: OrderType[]
  isLoading: boolean
}

export default function StaffOrder() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const navigate = useNavigate()

  const { data, isLoading } = useGetOrdersQuery<OrderResponse>({ status })
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation()

  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (status.length > 0) params.append('status', status)
    navigate(`/staff/orders?${params.toString()}`)
  }, [status, navigate])

  useEffect(() => {
    const handler = setTimeout(() => {
      updateURL()
    }, 500)
    return () => clearTimeout(handler)
  }, [updateURL])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder({ id: orderId, status: newStatus }).unwrap()
      message.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      message.error('Failed to update order status')
    }
  }

  const productColumns = [
    {
      title: 'Product Name',
      dataIndex: ['product', 'name'],
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: ['product', 'price'],
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (record: any) =>
        `${(record.product.price * record.quantity).toLocaleString()} VND`,
    },
  ]

  const columns = [
    {
      title: '#',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products: any[]) =>
        products.map((p) => p.product.name).join(', '),
    },
    {
      title: 'Quantity',
      dataIndex: 'products',
      key: 'quantity',
      render: (products: any[]) =>
        products.reduce((sum, p) => sum + p.quantity, 0),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${total.toLocaleString()} VND`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag
          color={
            text === 'Pending'
              ? 'orange'
              : text === 'Processing'
                ? 'blue'
                : text === 'Shipped'
                  ? 'purple'
                  : text === 'Delivered'
                    ? 'green'
                    : text === 'Cancelled'
                      ? 'red'
                      : 'default'
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: OrderType) => (
        <div>
          {record.status === 'Processing' && (
            <>
              <Button
                type='primary'
                size='small'
                onClick={() => handleStatusChange(record._id, 'Pending')}
                loading={isUpdating}
                style={{ marginRight: 8 }}
              >
                Confirm
              </Button>
              <Button
                type='default'
                size='small'
                danger
                onClick={() => handleStatusChange(record._id, 'Cancelled')}
                loading={isUpdating}
              >
                Cancel
              </Button>
            </>
          )}
          {record.status === 'Paid' && (
            <>
              <Button
                type='primary'
                size='small'
                onClick={() => handleStatusChange(record._id, 'Delivered')}
                loading={isUpdating}
                style={{ marginRight: 8 }}
              >
                Delivered
              </Button>
              <Button
                type='default'
                size='small'
                danger
                onClick={() => handleStatusChange(record._id, 'Refunded')}
                loading={isUpdating}
              >
                Refunded
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <h2>Orders</h2>
      <Select
        value={status}
        onChange={setStatus}
        style={{ width: 200, marginBottom: 16 }}
        placeholder='Select status'
      >
        <Option value=''>All</Option>
        {validStatuses.map((s) => (
          <Option key={s} value={s}>
            {s}
          </Option>
        ))}
      </Select>
      {isLoading ? (
        <Spin size='large' />
      ) : (
        <Table
          dataSource={data || []}
          columns={columns}
          rowKey='_id'
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={productColumns}
                dataSource={record.products}
                pagination={false}
                rowKey="_id"
              />
            ),
            rowExpandable: (record) => record.products && record.products.length > 0,
          }}
        />
      )}
    </div>
  )
}