import {
  Layout,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  notification,
} from 'antd'
import { Formik, Field, Form as FormikForm } from 'formik'
import * as Yup from 'yup'
import { useRegisterMutation } from '../../features/auth/authApi'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Content } = Layout
const { Option } = Select

export default function Register() {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  // Validation Schema with Yup
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

  // Default values
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    gender: true, // Default is Male (true)
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
    <Layout>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ width: 400 }}>
          <h2>Register an account</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <FormikForm>
                {/* Username */}
                <Form.Item
                  help={touched.username && errors.username}
                  validateStatus={
                    touched.username && errors.username ? 'error' : ''
                  }
                >
                  <Field as={Input} name='username' placeholder='Username' />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  help={touched.email && errors.email}
                  validateStatus={touched.email && errors.email ? 'error' : ''}
                >
                  <Field as={Input} name='email' placeholder='Email' />
                </Form.Item>

                {/* Phone number */}
                <Form.Item
                  help={touched.phone && errors.phone}
                  validateStatus={touched.phone && errors.phone ? 'error' : ''}
                >
                  <Field as={Input} name='phone' placeholder='Phone number' />
                </Form.Item>

                {/* Password */}
                <Form.Item
                  help={touched.password && errors.password}
                  validateStatus={
                    touched.password && errors.password ? 'error' : ''
                  }
                >
                  <Field
                    as={Input.Password}
                    name='password'
                    placeholder='Password'
                  />
                </Form.Item>

                {/* Confirm password */}
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
                    placeholder='Confirm password'
                  />
                </Form.Item>

                {/* Address */}
                <Form.Item
                  help={touched.address && errors.address}
                  validateStatus={
                    touched.address && errors.address ? 'error' : ''
                  }
                >
                  <Field as={Input} name='address' placeholder='Address' />
                </Form.Item>

                {/* Birth date */}
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
                    placeholder='Select birth date'
                    style={{ width: '100%' }}
                    value={
                      initialValues.birthday
                        ? dayjs(initialValues.birthday)
                        : undefined
                    }
                  />
                </Form.Item>

                {/* Gender */}
                <Form.Item
                  help={touched.gender && errors.gender}
                  validateStatus={
                    touched.gender && errors.gender ? 'error' : ''
                  }
                >
                  <Select
                    defaultValue={true}
                    onChange={(value) => setFieldValue('gender', value)}
                  >
                    <Option value={true}>Male</Option>
                    <Option value={false}>Female</Option>
                  </Select>
                </Form.Item>

                {/* Register button */}
                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={isLoading}
                    block
                  >
                    Register
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
