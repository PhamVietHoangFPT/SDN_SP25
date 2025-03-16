import MainLayout from '../components/layout/MainLayout'
import ArticleManagementSystem from '../components/Manager/ArticleManagementSystem'
import Homepage from '../Pages/Home/Home'
import Login from '../Pages/Login/Login'
import { LayoutRoute } from '../types/routes'

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
        path: '/login',
        component: Login,
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
