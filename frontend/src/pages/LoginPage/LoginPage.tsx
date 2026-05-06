import { Alert, Button, Checkbox, Form, Input, Typography } from 'antd'
import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import styles from './login.module.css'

import userIconUrl from '../../assets/icons/user.svg?url'
import lockIconUrl from '../../assets/icons/lock.svg?url'
import { loginApi } from '../../services/auth-api'
import { useAuth } from '../../auth/AuthContext'
import { getRoleHomePath } from '../../auth/role-utils'

type LoginValues = {
  tenDangNhap: string
  matKhau: string
  remember?: boolean
}

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [form] = Form.useForm<LoginValues>()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, user } = useAuth()

  // Hiển thị message từ register
  useEffect(() => {
    const state = location.state as any
    if (state?.message) {
      setSuccessMessage(state.message)
    }
  }, [location.state])

  const onFinish = async (values: LoginValues) => {
    try {
      setError(null)
      setLoading(true)
      const result = await loginApi({
        tenDangNhap: values.tenDangNhap,
        matKhau: values.matKhau,
      })
      login(result.token, result.user, Boolean(values.remember))
      // Redirect to the page user was trying to access, or to role-based home
      const redirectTo = (location.state as any)?.from || getRoleHomePath(result.user.vaiTro)
      navigate(redirectTo, { replace: true })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Không thể đăng nhập'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated && user) {
    return <Navigate to={getRoleHomePath(user.vaiTro)} replace />
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.badge}>MyWebAPI</div>
            <Typography.Title level={2} className={styles.title}>
              Đăng nhập
            </Typography.Title>
            <Typography.Text type="secondary" className={styles.subtitle}>
              Vui lòng nhập tài khoản để tiếp tục.
            </Typography.Text>
          </div>

          <Form<LoginValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            {successMessage && (
              <Form.Item>
                <Alert type="success" message={successMessage} showIcon />
              </Form.Item>
            )}
            {error && (
              <Form.Item>
                <Alert type="error" message={error} showIcon />
              </Form.Item>
            )}

            <Form.Item
              label="Tên đăng nhập"
              name="tenDangNhap"
              rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}
            >
              <Input
                autoComplete="username"
                placeholder="Tên đăng nhập"
                size="large"
                prefix={
                  <img
                    className={styles.prefixIcon}
                    src={userIconUrl}
                    alt=""
                    aria-hidden="true"
                  />
                }
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="matKhau"
              rules={[{ required: true, message: 'Nhập mật khẩu' }]}
            >
              <Input.Password
                autoComplete="current-password"
                placeholder="••••••••"
                size="large"
                prefix={
                  <img
                    className={styles.prefixIcon}
                    src={lockIconUrl}
                    alt=""
                    aria-hidden="true"
                  />
                }
              />
            </Form.Item>

            <div className={styles.row}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <a className={styles.link} href="#">
                Quên mật khẩu?
              </a>
            </div>

            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng nhập
            </Button>
          </Form>

          <div className={styles.footer}>
            <Typography.Text type="secondary">
              Chưa có tài khoản?{' '}
              <a className={styles.link} href="/register">
                Đăng ký
              </a>
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  )
}

