import { Alert, Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './register.module.css'

import userIconUrl from '../../assets/icons/user.svg?url'
import mailIconUrl from '../../assets/icons/mail.svg?url'
import phoneIconUrl from '../../assets/icons/phone.svg?url'
import lockIconUrl from '../../assets/icons/lock.svg?url'
import { registerReaderApi } from '../../services/auth-api'

type RegisterValues = {
  hoTen: string
  email: string
  dienThoai: string
  matKhau: string
  confirmMatKhau: string
}

export function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form] = Form.useForm<RegisterValues>()
  const navigate = useNavigate()

  const onFinish = async (values: RegisterValues) => {
    try {
      setError(null)
      setLoading(true)

      await registerReaderApi({
        hoTen: values.hoTen,
        email: values.email,
        dienThoai: values.dienThoai,
        matKhau: values.matKhau,
      })

      // Đăng ký thành công, chuyển sang trang đăng nhập
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Không thể đăng ký'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Typography.Title level={2} className={styles.title}>
              Đăng ký tài khoản
            </Typography.Title>
            <Typography.Text type="secondary" className={styles.subtitle}>
              Tạo tài khoản để mượn sách trực tuyến.
            </Typography.Text>
          </div>

          <Form<RegisterValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
          >
            {error && (
              <Form.Item>
                <Alert type="error" title={error} showIcon />
              </Form.Item>
            )}

            <Form.Item
              label="Họ tên"
              name="hoTen"
              rules={[{ required: true, message: 'Nhập họ tên' }]}
            >
              <Input
                placeholder="Nhập họ tên"
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
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input
                placeholder="Nhập email"
                size="large"
                prefix={
                  <img
                    className={styles.prefixIcon}
                    src={mailIconUrl}
                    alt=""
                    aria-hidden="true"
                  />
                }
              />
            </Form.Item>

            <Form.Item
              label="Điện thoại"
              name="dienThoai"
              rules={[{ required: true, message: 'Nhập số điện thoại' }]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                size="large"
                prefix={
                  <img
                    className={styles.prefixIcon}
                    src={phoneIconUrl}
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
                placeholder="Nhập mật khẩu"
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

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmMatKhau"
              dependencies={['matKhau']}
              rules={[
                { required: true, message: 'Nhập lại mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('matKhau') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp'))
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu"
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

            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng ký
            </Button>
          </Form>

          <div className={styles.footer}>
            <Typography.Text type="secondary">
              Đã có tài khoản?{' '}
              <a className={styles.link} href="/login">
                Đăng nhập
              </a>
            </Typography.Text>
          </div>
        </div>
      </div>
    </div>
  )
}
