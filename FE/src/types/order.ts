import { Cart } from './cart'

export interface Order {
  _id: string
  account: []
  status: string
  total: number
  createdAt: string
  updatedAt: string
  products: [Cart[]]
}
