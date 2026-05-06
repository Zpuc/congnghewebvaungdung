import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd'
import {
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

export function AdminPage() {
  const navigate = useNavigate()

  const stats = [
    {
      title: 'Sách',
      value: 1250,
      icon: <BookOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
      color: '#e6f7ff',
    },
    {
      title: 'Bạn đọc',
      value: 856,
      icon: <UserOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      color: '#f6ffed',
    },
    {
      title: 'Phiếu mượn',
      value: 234,
      icon: <FileTextOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      color: '#fffbe6',
    },
    {
      title: 'Bản sao',
      value: 3420,
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      color: '#f9f0ff',
    },
  ]

  const quickActions = [
    {
      label: 'Quản lý sách',
      desc: 'Thêm, sửa, xóa sách',
      path: '/admin/sach',
      icon: '📚',
    },
    {
      label: 'Quản lý bạn đọc',
      desc: 'Quản lý tài khoản người dùng',
      path: '/admin/ban-doc',
      icon: '👥',
    },
    {
      label: 'Phiếu mượn',
      desc: 'Xét duyệt và quản lý',
      path: '/admin/phieu-muon',
      icon: '📋',
    },
    {
      label: 'Quản lý phạt',
      desc: 'Xử lý vi phạm và thanh toán',
      path: '/admin/phat',
      icon: '💰',
    },
    {
      label: 'Thanh toán',
      desc: 'Xem lịch sử giao dịch',
      path: '/admin/thanh-toan',
      icon: '💳',
    },
    {
      label: 'Kệ sách',
      desc: 'Quản lý vị trí kệ',
      path: '/admin/ke-sach',
      icon: '🗄️',
    },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header với logo */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="large" align="center">
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  letterSpacing: 2,
                }}
              >
                ZpucBook
              </div>
              <div>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  Quản trị hệ thống
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  Dashboard quản lý thư viện số
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="default"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => window.open('/thue-sach', '_blank')}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Xem trang chủ
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Thống kê nhanh */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {stats.map((stat, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card hoverable style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: '#1677ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick actions */}
      <Card title="⚡ Thao tác nhanh" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, idx) => (
            <Col xs={12} sm={8} md={6} lg={4} key={idx}>
              <Card
                hoverable
                size="small"
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                onClick={() => navigate(action.path)}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{action.icon}</div>
                <Text strong style={{ fontSize: 14, display: 'block' }}>
                  {action.label}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {action.desc}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Thông tin hệ thống */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="📊 Thông tin hệ thống" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Phiên bản:</Text>
                <Text strong>v1.0.0</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Trạng thái:</Text>
                <Text strong style={{ color: '#52c41a' }}>Đang hoạt động</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Ngày khởi động:</Text>
                <Text strong>{new Date().toLocaleDateString('vi-VN')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Thời gian uptime:</Text>
                <Text strong>24h 12m</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="🔔 Thông báo gần đây" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Hệ thống đã sao lưu thành công</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  06/05/2026 02:00 AM
                </Text>
              </div>
              <div>
                <Text strong>Có 5 sách mới được thêm vào hệ thống</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  05/05/2026 08:30 PM
                </Text>
              </div>
              <div>
                <Text strong>Bản cập nhật bảo mật đã được áp dụng</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  04/05/2026 10:00 AM
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
