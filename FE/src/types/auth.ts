export interface UserToken {
  token: string
}
export interface UserData {
  email: string
  id: string
  address: string
  role: string
  gender: boolean
  birthday: string
  username: string
  phone: string
  exp: number
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
