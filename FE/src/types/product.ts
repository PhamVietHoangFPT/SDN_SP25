export interface Products {
  _id: number
  name: string
  description: string
  price: number
  stock: number
  sold: number
  category: {
    _id: number
    name: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  images: string
  createdAt: string
  updatedAt: string
  __v: number
}
