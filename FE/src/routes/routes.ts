import LoginRegisterLayout from '../components/layout/LoginRegisterLayout'
import MainLayout from '../components/layout/MainLayout'
import ArticleManagementSystem from '../components/Manager/ArticleManagementSystem'
import Homepage from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import ShowAllProductsManager from '../Pages/Products/ShowAllProductsCustomer'
import { LayoutRoute } from '../types/routes'
import ProductsDetailCustomer from '../Pages/Products/ProductsDetailCustomer'

const routes: LayoutRoute[] = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: Homepage,
        exact: true,
      },
      {
        path: '/products',
        component: ShowAllProductsManager,
      },
      {
        path: '/products/:id',
        component: ProductsDetailCustomer,
      },
    ],
  },

  // ManagerManager
  {
    layout: MainLayout,
    data: [
      {
        path: '/managerArticles',
        component: ArticleManagementSystem,
      },
    ],
  },
  {
    layout: LoginRegisterLayout,
    data: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
    ],
  },
  // {
  //   layout: SimpleLayout,
  //   data: [
  //     {
  //       path: '/login',
  //       component: LoginPage,
  //     },
  //     {
  //       path: '/register',
  //       component: RegisterPage,
  //     },
  //   ],
  // },
  // {
  //   layout: AdminLayout,
  //   data: [
  //     {
  //       path: '/admin',
  //       component: Admin,
  //       role: ['admin'],
  //     },

  //   ],
  // },
]

export default routes
