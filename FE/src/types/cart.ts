export interface Cart {
  _id: string
  account: string
  items: CartItems[]
  total: number
}

interface CartItems {
  product: string
  quantity: number
  price: number
  _id: string
}
