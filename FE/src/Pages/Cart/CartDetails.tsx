import { Button, Card, InputNumber, notification, Space, Table } from 'antd'
import {
  useGetCartQuery,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
} from '../../features/cart/cartAPI'
import { Cart } from '../../types/cart'
import { useAddOrderMutation } from '../../features/order/orderAPI'
interface CartResponse {
  data: Cart
  isLoading: boolean
}
export default function CartDetails() {
  const { data: cart, isLoading } = useGetCartQuery<CartResponse>({})
  const [updateCart] = useUpdateCartMutation()
  const [removeFromCart] = useRemoveFromCartMutation()
  const [addOrder] = useAddOrderMutation()
  if (isLoading) return <p>Loading...</p>

  const handleIncrease = async (id: string, quantity: number) => {
    const idProduct = id
    const newQuantity = quantity + 1
    try {
      const result = await updateCart({
        productId: idProduct,
        quantity: newQuantity,
      }).unwrap()
      notification.success({
        message: 'Success', // Notification title
        description: result.message, // Detailed content
        placement: 'topRight', // Display position
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.data.error as string,
        placement: 'topRight',
      })
    }
  }

  const handleDecrease = async (id: string, quantity: number) => {
    const idProduct = id
    const newQuantity = quantity - 1
    try {
      const result = await updateCart({
        productId: idProduct,
        quantity: newQuantity,
      }).unwrap()
      notification.success({
        message: 'Success', // Notification title
        description: result.message, // Detailed content
        placement: 'topRight', // Display position
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.data.error as string,
        placement: 'topRight',
      })
    }
  }

  const handleRemove = async (id: string) => {
    const idProduct = id
    try {
      const result = await removeFromCart({
        productId: idProduct,
      }).unwrap()
      notification.success({
        message: 'Success', // Notification title
        description: result.message, // Detailed content
        placement: 'topRight', // Display position
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.data.error as string,
        placement: 'topRight',
      })
    }
  }

  const handleCheckout = async () => {
    try {
      const result = await addOrder({
        account: cart.account,
        products: cart.items,
      }).unwrap()
      notification.success({
        message: 'Success', // Notification title
        description: result.message, // Detailed content
        placement: 'topRight', // Display position
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.data.error as string,
        placement: 'topRight',
      })
    }
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
          <Button
            onClick={() => handleDecrease(record.product._id, record.quantity)}
          >
            -
          </Button>
          <InputNumber min={1} value={text} readOnly />
          <Button
            onClick={() => handleIncrease(record.product._id, record.quantity)}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type='primary'
          danger
          onClick={() => handleRemove(record.product._id)}
        >
          Remove
        </Button>
      ),
    },
  ]

  return (
    <>
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
      <Button type='primary' style={{ marginTop: 16 }} onClick={handleCheckout}>
        Checkout
      </Button>
    </>
  )
}
