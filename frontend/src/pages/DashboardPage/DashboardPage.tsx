import { Button, Card, Col, Layout, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const { Header, Content } = Layout

type DashboardPageProps = {
  title: string
  description: string
}

export function DashboardPage({ title, description }: DashboardPageProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Layout style={{ minHeight: '100svh', background: '#f4f7fb' }}>
      <Header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e7ecf3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Trang quản trị
        </Typography.Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Typography.Text type="secondary">{user?.tenDangNhap}</Typography.Text>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </Header>

      <Content style={{ padding: 20 }}>
        <Card style={{ marginBottom: 16 }}>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            {description}
          </Typography.Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <Card title="Tổng quan" bordered={false}>
              <Typography.Text type="secondary">
                Khu vực này sẽ hiển thị số liệu nhanh và thông báo.
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card title="Công việc" bordered={false}>
              <Typography.Text type="secondary">
                Tại đây bạn có thể thêm menu nghiệp vụ theo vai trò.
              </Typography.Text>
            </Card>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Card title="Nhật ký" bordered={false}>
              <Typography.Text type="secondary">
                Lịch sử thao tác và hoạt động hệ thống.
              </Typography.Text>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

