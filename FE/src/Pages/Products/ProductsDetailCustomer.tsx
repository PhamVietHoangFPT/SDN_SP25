import { useParams } from 'react-router-dom'
import { useGetProductDetailCustomerQuery } from '../../features/product/productAPI'
import { Button, Card, InputNumber, notification } from 'antd'
import { Products } from '../../types/product'
import { useState } from 'react'
import { useAddToCartMutation } from '../../features/cart/cartAPI'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
interface ProductsResponse {
  data: Products
  isLoading: boolean
}

export default function ProductsDetailCustomer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } =
    useGetProductDetailCustomerQuery<ProductsResponse>(id)
  const [addToCart] = useAddToCartMutation()
  const [quantity, setQuantity] = useState(1)
  const token = Cookies.get('userToken')

  const handleAddToCart = async () => {
    try {
      const result = await addToCart({ productId: id, quantity }).unwrap()
      notification.success({
        message: 'Success', // Notification title
        description: result.message, // Detailed content
        placement: 'topRight', // Display position
      })
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.data.message as string,
        placement: 'topRight',
      })
    }
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <Card
        title={data.name}
        cover={
          <img
            alt={data.name}
            src={data.images}
            style={{ width: '50%', objectFit: 'cover', margin: 'auto' }}
          />
        }
        style={{
          width: '50%',
          margin: 'auto',
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>
          <strong>Price:</strong> {data.price.toLocaleString()} VND
        </p>
        <p>
          <strong>Description:</strong> {data.description}
        </p>
        <p>
          <strong>Category:</strong> {data.category?.name}
        </p>
        <p>
          <strong>Stock:</strong> {data.stock} products
        </p>

        <div style={{ marginTop: 16 }}>
          <InputNumber
            min={1}
            max={data.stock}
            value={quantity}
            onChange={(value) => setQuantity(value ?? 1)}
            style={{ marginRight: 10 }}
          />
          {token ? (
            <Button type='primary' onClick={() => handleAddToCart()}>
              Add to Cart
            </Button>
          ) : (
            <Button type='primary' onClick={() => navigate('/login')}>
              Đăng nhập để tiếp tục
            </Button>
          )}
        </div>
      </Card>
    </>
  )
}
