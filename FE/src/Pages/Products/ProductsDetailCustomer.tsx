import { useParams } from 'react-router-dom'
import { useGetProductDetailQuery } from '../../features/product/productAPI'

export default function ProductsDetailCustomer() {
  const { id } = useParams()
  const { data, isLoading } = useGetProductDetailQuery(id)
  console.log(data, isLoading)
  return <div>ProductsDetailCustomer</div>
}
