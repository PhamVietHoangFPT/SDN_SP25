import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { UserData, AuthState } from '../../types/auth'

// Lấy userData từ Cookies
const userData: UserData | null = Cookies.get('userData')
  ? JSON.parse(Cookies.get('userData') as string)
  : null

const userToken = Cookies.get('userToken')

const initialState: AuthState = {
  userData,
  userToken: userToken ? { token: userToken } : null,
  isAuthenticated: !!userData,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload

      const decodedToken: any = jwtDecode(token)
      state.userData = {
        email: decodedToken.email,
        id: decodedToken.id,
        address: decodedToken.address,
        role: decodedToken.role,
        gender: decodedToken.gender,
        birthday: decodedToken.birthday,
        username: decodedToken.username,
        phone: decodedToken.phone,
        exp: decodedToken.exp,
      }

      state.userToken = { token: token } // Chỉ lưu Access Token tạm thời
      state.isAuthenticated = true

      const expirationDate = new Date(state.userData.exp * 1000)
      Cookies.set('userData', JSON.stringify(state.userData), {
        expires: expirationDate,
      })
      Cookies.set('userToken', token, { expires: expirationDate })
    },
    logout: (state) => {
      state.userData = null
      state.userToken = null
      state.isAuthenticated = false

      // ✅ Xóa userData trong Cookies
      Cookies.remove('userData')
    },
  },
})

export const { login, logout, setLoading } = authSlice.actions
export default authSlice.reducer
