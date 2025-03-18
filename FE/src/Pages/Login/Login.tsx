import { Layout, Form, Input, Button, notification } from 'antd'
import { Formik, Field, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { useLoginMutation } from '../../features/auth/authApi'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout

export default function Login() {
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const validationSchema = Yup.object({
    username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
    retypePassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Mật khẩu nhập lại không khớp')
      .required('Vui lòng nhập lại mật khẩu'),
  })
  const initialValues = {
    username: '',
    password: '',
    retypePassword: '',
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
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ width: 300 }}>
          <h2>Đăng nhập</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <FormikForm>
                {' '}
                {/* Sử dụng trực tiếp FormikForm */}
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
                  />
                </Form.Item>
                <Form.Item
                  help={touched.retypePassword && errors.retypePassword}
                  validateStatus={
                    touched.retypePassword && errors.retypePassword
                      ? 'error'
                      : ''
                  }
                >
                  <Field
                    as={Input.Password}
                    name='retypePassword'
                    placeholder='Nhập lại mật khẩu'
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={isLoading}
                    block
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </FormikForm>
            )}
          </Formik>
        </div>
      </Content>
    </Layout>
  )
}
