import { Layout, Form, Input, Button, notification, Row, Col } from 'antd'
import { Formik, Field, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { useLoginMutation } from '../../features/auth/authApi'
import { Link, useNavigate } from 'react-router-dom'
import OIG4 from '../../assets/OIG4.jpg'

const { Content } = Layout

export default function Login() {
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const validationSchema = Yup.object({
    username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  })

  const initialValues = {
    username: '',
    password: '',
  }

  const handleSubmit = async (values: any) => {
    const { username, password } = values
    const response = await login({ username, password })

    if ('data' in response) {
      navigate('/')
    } else if ('error' in response && response.error) {
      const errorData = response.error
      if (
        typeof errorData === 'object' &&
        'data' in errorData &&
        typeof errorData.data === 'object' &&
        errorData.data !== null &&
        'message' in errorData.data
      ) {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: String(errorData.data.message),
        })
      }
    }
  }

  return (
    <Layout>
      <Content style={{ height: '100vh', display: 'flex' }}>
        <Row style={{ width: '100%', height: '100vh' }}>
          {/* Cột bên trái: Form đăng nhập (70%) */}
          <Col
            xs={24}
            md={17}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>
              Chào mừng bạn quay lại!
            </h2>
            <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>
              Đăng nhập
            </h3>
            <div style={{ width: 400 }}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <FormikForm>
                    <Form.Item
                      help={touched.username && errors.username}
                      validateStatus={
                        touched.username && errors.username ? 'error' : ''
                      }
                    >
                      <Field
                        as={Input}
                        name='username'
                        placeholder='Tên đăng nhập'
                        size='large'
                        style={{ fontSize: '16px', padding: '12px' }}
                      />
                    </Form.Item>
                    <Form.Item
                      help={touched.password && errors.password}
                      validateStatus={
                        touched.password && errors.password ? 'error' : ''
                      }
                    >
                      <Field
                        as={Input.Password}
                        name='password'
                        placeholder='Mật khẩu'
                        size='large'
                        style={{ fontSize: '16px', padding: '12px' }}
                      />
                    </Form.Item>
                    <h4
                      style={{
                        fontSize: '16px',
                        marginBottom: '20px',
                        fontWeight: '400',
                      }}
                    >
                      Bạn chưa có tài khoản?{' '}
                      <Link
                        to='/register'
                        style={{
                          color: '#34c759', // Màu xanh để nổi bật
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}
                      >
                        Đăng ký ngay
                      </Link>
                    </h4>

                    <Form.Item>
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={isLoading}
                        size='large'
                        block
                        style={{
                          fontSize: '18px',
                          height: '50px',
                          background: '#34c759',
                        }}
                      >
                        Đăng nhập
                      </Button>
                    </Form.Item>
                  </FormikForm>
                )}
              </Formik>
            </div>
          </Col>

          <Col
            xs={0}
            md={7}
            style={{
              backgroundImage: 'url(..)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <img src={OIG4} alt='OIG4' />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
