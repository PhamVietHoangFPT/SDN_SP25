import LoginRegisterLayout from '../components/layout/LoginRegisterLayout'
import ArticlePage from '../components/Home/ArticlePage'
import MainLayout from '../components/layout/MainLayout'
import ArticleManagementSystem from '../components/Manager/ArticleManagementSystem'
import Homepage from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import Register from '../Pages/Register/Register'
import ShowAllProductsManager from '../Pages/Products/ShowAllProductsCustomer'
import { LayoutRoute } from '../types/routes'
import ProductsDetailCustomer from '../Pages/Products/ProductsDetailCustomer'
import CartDetails from '../Pages/Cart/CartDetails'
import ManagerLayout from '../components/layout/StaffLayout'
import ManageCategory from '../Pages/Manager/Manager.category'
import ProductManagement from '../components/Manager/ProductManager/ProductManager'
import ManageAccount from '../Pages/Manager/Account/ManageAccount'
import UserProfile from '../Pages/Profile/userProfile'

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
      {
        path: '/article',
        component: ArticlePage,
      },
      {
        path: '/cart',
        component: CartDetails,
      },
      {
        path: '/profile',
        component: UserProfile,
      },
    ],
  },
  {
    layout: ManagerLayout,
    data: [
      {
        path: '/manager/',
        component: ManageAccount,
        exact: true,
        role: ['Manager'],
      },
      {
        path: '/manager/category',
        component: ManageCategory,
        role: ['Manager'],
      },
      {
        path: '/managerArticles',
        component: ArticleManagementSystem,
      },

      {
        path: '/managerProduct',
        component: ProductManagement,
      },
      {
        path: '/manager/account',
        component: ManageAccount,
        role: ['Manager'],
      },
    ],
  },
  // ManagerManager

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
