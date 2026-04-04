import { Button, Layout, Menu, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { UserRole } from '../types/auth'

const { Header, Content, Sider } = Layout

type MenuItem = { key: string; label: string; path: string }

function getMenuByRole(role: UserRole): MenuItem[] {
  if (role === 'Quản trị') {
    return [
      { key: '/admin', label: 'Tổng quan', path: '/admin' },
      { key: '/admin/the-loai', label: 'Quản lý thể loại', path: '/admin/the-loai' },
      { key: '/admin/sach', label: 'Quản lý sách', path: '/admin/sach' },
      { key: '/admin/ke-sach', label: 'Quản lý kệ sách', path: '/admin/ke-sach' },
      { key: '/admin/ban-sao', label: 'Quản lý bản sao', path: '/admin/ban-sao' },
      { key: '/admin/ban-doc', label: 'Quản lý Bạn Đọc', path: '/admin/ban-doc' },
      { key: '/admin/phieu-muon', label: 'Quản lý phiếu mượn', path: '/admin/phieu-muon' },
      { key: '/admin/phat', label: 'Quản lý phạt', path: '/admin/phat' },
      { key: '/admin/thanh-toan', label: 'Quản lý thanh toán', path: '/admin/thanh-toan' },
      { key: '/admin/tai-khoan', label: 'Quản lý tài khoản', path: '/admin/tai-khoan' },
    ]
  }
  if (role === 'Thủ thư') {
    return [
      { key: '/thu-thu', label: 'Tổng quan', path: '/thu-thu' },
      { key: '/thu-thu/the-loai', label: 'Quản lý thể loại', path: '/thu-thu/the-loai' },
      { key: '/thu-thu/sach', label: 'Quản lý sách', path: '/thu-thu/sach' },
      { key: '/thu-thu/ke-sach', label: 'Quản lý kệ sách', path: '/thu-thu/ke-sach' },
      { key: '/thu-thu/ban-sao', label: 'Quản lý bản sao', path: '/thu-thu/ban-sao' },
      { key: '/thu-thu/ban-doc', label: 'Quản lý Bạn Đọc', path: '/thu-thu/ban-doc' },
      { key: '/thu-thu/phieu-muon', label: 'Quản lý phiếu mượn', path: '/thu-thu/phieu-muon' },
      { key: '/thu-thu/phat', label: 'Quản lý phạt', path: '/thu-thu/phat' },
      { key: '/thu-thu/thanh-toan', label: 'Quản lý thanh toán', path: '/thu-thu/thanh-toan' },
    ]
  }
  return [{ key: '/ban-doc', label: 'Trang của tôi', path: '/ban-doc' }]
}

function getActiveMenuKey(pathname: string, items: MenuItem[]) {
  const matched = items
    .filter((item) => pathname.startsWith(item.path))
    .sort((a, b) => b.path.length - a.path.length)[0]
  return matched?.key ?? items[0]?.key
}

export function RoleLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const items = useMemo(() => getMenuByRole(user?.vaiTro ?? 'Bạn đọc'), [user?.vaiTro])
  const activeKey = getActiveMenuKey(location.pathname, items)

  const menuItems = items.map((item) => ({
    key: item.key,
    label: item.label,
  }))

  return (
    <Layout style={{ minHeight: '100svh' }}>
      <Sider
        width={240}
        collapsedWidth={76}
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        style={{ borderRight: '1px solid #e7ecf3' }}
      >
        <div style={{ padding: '18px 16px 8px' }}>
          {!collapsed && (
            <>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Quản trị thư viện
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Vai trò: {user?.vaiTro}
              </Typography.Text>
            </>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={activeKey ? [activeKey] : []}
          items={menuItems}
          onClick={(e) => {
            const target = items.find((x) => x.key === e.key)
            if (target) navigate(target.path)
          }}
        />
      </Sider>

      <Layout style={{ background: '#f4f7fb' }}>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #e7ecf3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button onClick={() => setCollapsed((v) => !v)}>
              {collapsed ? 'Mở menu' : 'Thu gọn menu'}
            </Button>
            <Typography.Text>
              Xin chào, <strong>{user?.tenDangNhap}</strong>
            </Typography.Text>
          </div>
          <Button
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content style={{ padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

