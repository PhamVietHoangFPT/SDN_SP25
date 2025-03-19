import { useCallback, useEffect, useState } from 'react'
import { useGetOrdersQuery } from '../../features/order/orderAPI'
import { Order as OrderType } from '../../types/order'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Table, Select, Spin, Tag, Button } from 'antd'

const { Option } = Select

const validStatuses = [
  'Processing',
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
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

  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (status.length > 0) params.append('status', status)
    navigate(`/staff/orders?${params.toString()}`)
  }, [status, navigate])

  useEffect(() => {
    const handler = setTimeout(() => {
      updateURL()
    }, 500) // Debounce 500ms

    return () => clearTimeout(handler)
  }, [updateURL])

  const columns = [
    {
      title: '#',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Product',
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
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
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
      title: 'Action',
      key: 'action',
      render: (record: OrderType) => (
        <Button
          type='link'
          onClick={() => navigate(`/staff/orders/${record._id}`)}
        >
          View
        </Button>
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
        <Table dataSource={data || []} columns={columns} rowKey='_id' />
      )}
    </div>
  )
}
