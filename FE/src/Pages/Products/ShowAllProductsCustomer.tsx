import { useCallback, useState, useEffect } from 'react'
import { useGetProductListQuery } from '../../features/product/productAPI'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Pagination, Card, Row, Col, Typography, Select, Input } from 'antd'

const { Meta } = Card
import { Products } from '../../types/product'
const { Option } = Select
const { Title } = Typography

interface ProductsResponse {
  data: {
    products: Products[]
    currentPage: number
    totalPages: number
    totalItems: number
  }
  isFetching: boolean
  isLoading: boolean
}

export default function ShowAllProductsCustomer() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [debouncedProductsName, setDebouncedProductsName] = useState('')
  const [sort, setSort] = useState(searchParams.get('sort') || '')
  const [productName, setProductsName] = useState(
    searchParams.get('name') || ''
  )
  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get('pageNumber')) || 1
  )
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get('pageSize')) || 12
  )

  // Cập nhật URL khi bộ lọc thay đổi
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    params.append('pageNumber', pageNumber.toString())
    if (productName) params.append('name', productName)
    if (sort) params.append('sort', sort)
    if (pageSize) params.append('pageSize', pageSize.toString())

    navigate(`/products?${params.toString()}`)
  }, [pageNumber, productName, sort, pageSize, navigate])

  useEffect(() => {
    setPageNumber(1) // Reset về trang 1 khi thay đổi bộ lọc
  }, [productName, sort])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductsName(productName)
      updateURL()
    }, 500) // Debounce 500ms

    return () => clearTimeout(handler)
  }, [productName, sort, updateURL])

  const sortValue = [
    { value: 'priceAsc', label: 'Giá tăng dần' },
    { value: 'priceDesc', label: 'Giá giảm dần' },
    { value: 'soldDesc', label: 'Bán chạy nhất' },
    { value: 'nameAsc', label: 'Tên A-Z' },
    { value: 'nameDesc', label: 'Tên Z-A' },
  ]

  // Gọi API lấy danh sách sản phẩm
  const { data, isFetching, isLoading } =
    useGetProductListQuery<ProductsResponse>({
      pageNumber,
      pageSize,
      name: debouncedProductsName,
      sort,
    })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Danh sách sản phẩm
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Select
          value={sort ? sort : undefined}
          style={{ width: 200 }}
          onChange={setSort}
          allowClear
          placeholder='Sắp xếp theo'
        >
          {sortValue.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
        <Input.Search
          placeholder='Tìm kiếm sản phẩm'
          allowClear
          enterButton
          style={{ width: 250 }}
          onSearch={(value) => setProductsName(value)}
        />
      </div>

      {/* Hiển thị danh sách sản phẩm */}
      <Row gutter={[16, 16]} justify='center'>
        {isLoading || isFetching
          ? Array.from({ length: pageSize }).map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card loading={true} />
              </Col>
            ))
          : data?.products?.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.name}
                      src={product.images || '/placeholder.png'}
                    />
                  }
                  onClick={() => navigate(`/products/${product._id}`)}
                  style={{ borderRadius: 12, maxHeight: '500px' }}
                >
                  <Meta title={product.name} description={product.category} />
                  <p>${product.price}</p>
                  <p>
                    Đã bán: {product.sold} | Còn trong kho: {product.stock}
                  </p>
                </Card>
              </Col>
            ))}
      </Row>

      {/* Phân trang */}
      {!isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Pagination
            current={pageNumber}
            pageSize={pageSize}
            total={data?.totalItems}
            showSizeChanger
            onChange={(page, size) => {
              setPageNumber(page)
              setPageSize(size)
            }}
          />
        </div>
      )}
    </div>
  )
}
