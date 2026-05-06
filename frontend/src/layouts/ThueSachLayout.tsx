import { Layout, Menu, Button, Space, Typography, Dropdown, Avatar } from 'antd'
import {
  HomeOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext'

const { Header, Content, Footer } = Layout
const { Text } = Typography

export function ThueSachLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout: authLogout } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('thue-sach-cart')
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart) as unknown[]
          setCartCount(cart.length)
        } catch {
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      clearInterval(interval)
    }
  }, [])

  const menuItems = [
    {
      key: '/thue-sach',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/thue-sach/gioi-thieu',
      icon: <InfoCircleOutlined />,
      label: 'Giới thiệu',
    },
    {
      key: '/thue-sach/chinh-sach',
      icon: <FileTextOutlined />,
      label: 'Chính sách',
    },
    {
      key: '/thue-sach/muon-sach',
      icon: <BookOutlined />,
      label: 'Mượn sách',
    },
    {
      key: '/thue-sach/lich-su-muon',
      icon: <BookOutlined />,
      label: 'Lịch sử mượn',
    },
    {
      key: '/thue-sach/gio-hang',
      icon: <ShoppingCartOutlined />,
      label: `Giỏ hàng ${cartCount > 0 ? `(${cartCount})` : ''}`,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text
            strong
            style={{
              color: 'white',
              fontSize: 20,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/thue-sach')}
          >
            📚 Thư viện số
          </Text>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0, border: 'none' }}
          />
        </div>
        <Space>
          {user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: user.tenDangNhap || 'Người dùng',
                  },
                  ...(user.vaiTro === 'Quản trị'
                    ? [
                        {
                          key: 'admin',
                          icon: <CrownOutlined />,
                          label: 'Trang quản trị',
                          onClick: () => navigate('/admin'),
                        },
                      ]
                    : []),
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                    onClick: () => {
                      authLogout()
                      navigate('/login')
                    },
                  },
                ],
              }}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text style={{ color: 'white' }}>{user.tenDangNhap}</Text>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 0', background: '#f0f2f5' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>
        <Space direction="vertical" size="small">
          <Text style={{ color: 'white' }}>
            Thư viện số ©{new Date().getFullYear()} - Nơi tri thức lan tỏa
          </Text>
          <Space split="|">
            <Text style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              Liên hệ: 0123-456-789
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              Email: contact@thuvienso.vn
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
            </Text>
          </Space>
        </Space>
      </Footer>
    </Layout>
  )
}
