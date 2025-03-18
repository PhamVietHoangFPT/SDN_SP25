import { Button, Card, InputNumber, Space, Table } from 'antd'
import { useGetCartQuery } from '../../features/cart/cartAPI'
import { Cart } from '../../types/cart'

interface CartResponse {
  data: Cart
  isLoading: boolean
}
export default function CartDetails() {
  const { data: cart, isLoading } = useGetCartQuery<CartResponse>({})

  if (isLoading) return <p>Loading...</p>
  const handleIncrease = (id: string) => {
    console.log('Increase quantity for:', id)
  }

  const handleDecrease = (id: string) => {
    console.log('Decrease quantity for:', id)
  }

  const handleRemove = (id: string) => {
    console.log('Remove item from cart:', id)
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: any) => product.name,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: any) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: any, record: any) => (
        <Space>
          <Button onClick={() => handleDecrease(record._id)}>-</Button>
          <InputNumber min={1} value={text} readOnly />
          <Button onClick={() => handleIncrease(record._id)}>+</Button>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button type='primary' danger onClick={() => handleRemove(record._id)}>
          Remove
        </Button>
      ),
    },
  ]

  return (
    <Card title='Cart Details'>
      <Table
        dataSource={cart.items}
        columns={columns}
        rowKey='_id'
        pagination={false}
      />
      <h3 style={{ marginTop: 16 }}>
        Total: {cart.total.toLocaleString()} VND
      </h3>
    </Card>
  )
}
