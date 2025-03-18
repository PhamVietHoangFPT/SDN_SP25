import { Typography, Space, Carousel, Card, Spin } from 'antd'
import { Products } from '../../types/product'
import { useGetProductListQuery } from '../../features/product/productAPI'
const { Title, Text, Paragraph } = Typography
interface ProductsResponse {
  data: {
    products: Products[]
  }
  error: any
  isLoading: boolean
}

export const ProductSlider = () => {
  const { data, error, isLoading } = useGetProductListQuery<ProductsResponse>({
    pageSize: 10,
    pageNumber: 1,
  })

  if (isLoading)
    return (
      <Spin
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    )
  if (error) return <p>Error: {error}</p>
  return (
    <Carousel
      autoplay
      dots={false}
      infinite
      slidesToShow={4} // Hiển thị 4 items trên màn hình lớn
      slidesToScroll={1}
      responsive={[
        { breakpoint: 1024, settings: { slidesToShow: 2 } }, // Tablet
        { breakpoint: 768, settings: { slidesToShow: 1 } }, // Mobile
      ]}
    >
      {data.products.map((product) => (
        <div key={product.id}>
          <Card
            hoverable
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              margin: '8px',
              minHeight: '400px', // Giữ chiều cao đồng đều
              display: 'flex',
              flexDirection: 'column',
            }}
            // cover={
            //   <img
            //     src={
            //       vaccine.images && vaccine.images.length > 0
            //         ? import.meta.env.VITE_IMAGE_ENDPOINT +
            //           vaccine.images[0].imageSource
            //         : '/placeholder.svg'
            //     }
            //     alt={vaccine.name}
            //     style={{
            //       width: '100%',
            //       height: '200px',
            //       objectFit: 'cover',
            //       borderTopLeftRadius: '12px',
            //       borderTopRightRadius: '12px',
            //     }}
            //   />
            // }
          >
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title level={4}>{product.name}</Title>
              <Paragraph style={{ flexGrow: 1 }}>
                {product.description}
              </Paragraph>
              <Space direction='vertical' size='middle'>
                <Text strong>Price: ${product.price}</Text>
              </Space>
            </div>
          </Card>
        </div>
      ))}
    </Carousel>
  )
}
