import {
  Layout,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  notification,
  Row,
  Col,
} from 'antd'
import { Formik, Field, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { useRegisterMutation } from '../../features/auth/authApi'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import OIG4 from '../../assets/OIG4.jpg'

const { Content } = Layout
const { Option } = Select

export default function Register() {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const validationSchema = Yup.object({
    username: Yup.string().required('Please enter a username'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter a password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Please confirm your password'),
    email: Yup.string()
      .email('Invalid email')
      .required('Please enter an email'),
    phone: Yup.string()
      .matches(/^\d+$/, 'Invalid phone number')
      .required('Please enter a phone number'),
    address: Yup.string().required('Please enter an address'),
    birthday: Yup.string().required('Please select a birth date'),
    gender: Yup.boolean().required('Please select a gender'),
  })

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    gender: true,
  }

  const handleSubmit = async (values: any) => {
    try {
      const { username, password, email, phone, address, birthday, gender } =
        values
      const response = await register({
        username,
        password,
        email,
        phoneNumber: phone,
        address,
        dateOfBirth: birthday,
        gender,
      })

      if ('data' in response) {
        notification.success({
          message: 'Registration successful',
          description: 'You can log in now!',
        })
        navigate('/login')
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
            message: 'Registration failed',
            description: String(errorData.data.message),
          })
        }
      }
    } catch (error: any) {
      console.log(error)
      notification.error({
        message: 'System error',
        description: 'Please try again later!',
      })
    }
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Content>
        <Row style={{ height: '100%' }}>
          {/* Cột bên trái: Banner (30%) */}
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

          {/* Cột bên phải: Form đăng ký */}
          <Col
            xs={24}
            md={17}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <div style={{ width: 400 }}>
              <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
                Đăng ký tài khoản
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, setFieldValue }) => (
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
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.email && errors.email}
                      validateStatus={
                        touched.email && errors.email ? 'error' : ''
                      }
                    >
                      <Field
                        as={Input}
                        name='email'
                        placeholder='Email'
                        size='large'
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.phone && errors.phone}
                      validateStatus={
                        touched.phone && errors.phone ? 'error' : ''
                      }
                    >
                      <Field
                        as={Input}
                        name='phone'
                        placeholder='Số điện thoại'
                        size='large'
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
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.confirmPassword && errors.confirmPassword}
                      validateStatus={
                        touched.confirmPassword && errors.confirmPassword
                          ? 'error'
                          : ''
                      }
                    >
                      <Field
                        as={Input.Password}
                        name='confirmPassword'
                        placeholder='Xác nhận mật khẩu'
                        size='large'
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.address && errors.address}
                      validateStatus={
                        touched.address && errors.address ? 'error' : ''
                      }
                    >
                      <Field
                        as={Input}
                        name='address'
                        placeholder='Địa chỉ'
                        size='large'
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.birthday && errors.birthday}
                      validateStatus={
                        touched.birthday && errors.birthday ? 'error' : ''
                      }
                    >
                      <DatePicker
                        format='YYYY-MM-DD'
                        onChange={(dateString) =>
                          setFieldValue('birthday', dateString)
                        }
                        placeholder='Ngày sinh'
                        style={{ width: '100%' }}
                        value={
                          initialValues.birthday
                            ? dayjs(initialValues.birthday)
                            : undefined
                        }
                        size='large'
                      />
                    </Form.Item>

                    <Form.Item
                      help={touched.gender && errors.gender}
                      validateStatus={
                        touched.gender && errors.gender ? 'error' : ''
                      }
                    >
                      <Select
                        defaultValue={true}
                        onChange={(value) => setFieldValue('gender', value)}
                        size='large'
                      >
                        <Option value={true}>Nam</Option>
                        <Option value={false}>Nữ</Option>
                      </Select>
                    </Form.Item>
                    <h4
                      style={{
                        fontSize: '16px',
                        marginBottom: '20px',
                        fontWeight: '400',
                      }}
                    >
                      Bạn đã có tài khoản?{' '}
                      <Link
                        to='/login'
                        style={{
                          color: '#0062E6', // Màu xanh để nổi bật
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}
                      >
                        Đăng nhập ngay
                      </Link>
                    </h4>
                    <Form.Item>
                      <Button
                        type='primary'
                        htmlType='submit'
                        loading={isLoading}
                        block
                        size='large'
                      >
                        Đăng ký
                      </Button>
                    </Form.Item>
                  </FormikForm>
                )}
              </Formik>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
