import {
  App as AntApp,
  Button,
  Card,
  Empty,
  InputNumber,
  List,
  Popconfirm,
  Space,
  Typography,
  Tag,
  Divider,
} from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Sach } from '../../types/sach'

const { Title, Text, Paragraph } = Typography

type CartItem = {
  sach: Sach
  soLuong: number
  thoiHan: 'tuan' | 'thang'
}

const GIA_THUE = {
  tuan: 10000,
  thang: 35000,
}

export function GioHangPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem('thue-sach-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[])
      } catch {
        setCart([])
      }
    }
  }, [])

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('thue-sach-cart', JSON.stringify(newCart))
  }

  const removeItem = (maSach: string) => {
    const newCart = cart.filter((item) => item.sach.maSach !== maSach)
    saveCart(newCart)
    message.success('Đã xóa khỏi giỏ hàng')
  }

  const updateQuantity = (maSach: string, soLuong: number) => {
    if (soLuong < 1) return
    const newCart = cart.map((item) =>
      item.sach.maSach === maSach ? { ...item, soLuong } : item,
    )
    saveCart(newCart)
  }

  const updateThoiHan = (maSach: string, thoiHan: 'tuan' | 'thang') => {
    const newCart = cart.map((item) =>
      item.sach.maSach === maSach ? { ...item, thoiHan } : item,
    )
    saveCart(newCart)
  }

  const clearCart = () => {
    saveCart([])
    message.success('Đã xóa toàn bộ giỏ hàng')
  }

  const tongTien = cart.reduce((sum, item) => {
    const gia = GIA_THUE[item.thoiHan]
    return sum + gia * item.soLuong
  }, 0)

  const giamGia = cart.length >= 2 ? tongTien * 0.2 : 0
  const thanhToan = tongTien - giamGia

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('Giỏ hàng trống')
      return
    }
    navigate('/thue-sach/muon-sach', { state: { cart } })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Card>
        <Title level={2}>
          <ShoppingCartOutlined /> Giỏ hàng ({cart.length})
        </Title>

        {cart.length === 0 ? (
          <Empty
            description="Giỏ hàng trống"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '48px 0' }}
          >
            <Button type="primary" onClick={() => navigate('/thue-sach/sach')}>
              Xem sách
            </Button>
          </Empty>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      key="delete"
                      title="Xóa khỏi giỏ hàng?"
                      onConfirm={() => removeItem(item.sach.maSach)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Xóa
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space direction="vertical" size="small">
                        <Text strong style={{ fontSize: 16 }}>
                          {item.sach.tieuDe}
                        </Text>
                        <Text type="secondary">Tác giả: {item.sach.tacGia}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="middle" style={{ marginTop: 8 }}>
                        <Space>
                          <Text>Số lượng:</Text>
                          <InputNumber
                            min={1}
                            max={3}
                            value={item.soLuong}
                            onChange={(val) => updateQuantity(item.sach.maSach, val ?? 1)}
                            style={{ width: 80 }}
                          />
                        </Space>
                        <Space>
                          <Text>Thời hạn:</Text>
                          <Button
                            type={item.thoiHan === 'tuan' ? 'primary' : 'default'}
                            size="small"
                            onClick={() => updateThoiHan(item.sach.maSach, 'tuan')}
                          >
                            1 tuần ({GIA_THUE.tuan.toLocaleString()}đ)
                          </Button>
                          <Button
                            type={item.thoiHan === 'thang' ? 'primary' : 'default'}
                            size="small"
                            onClick={() => updateThoiHan(item.sach.maSach, 'thang')}
                          >
                            1 tháng ({GIA_THUE.thang.toLocaleString()}đ)
                          </Button>
                        </Space>
                        <Text strong>
                          Thành tiền: {(GIA_THUE[item.thoiHan] * item.soLuong).toLocaleString()}đ
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />

            <Divider />

            <Card type="inner" title="Tổng kết đơn hàng">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tạm tính:</Text>
                  <Text strong>{tongTien.toLocaleString()}đ</Text>
                </div>
                {giamGia > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>
                      Giảm giá <Tag color="red">-20%</Tag>:
                    </Text>
                    <Text type="danger">-{giamGia.toLocaleString()}đ</Text>
                  </div>
                )}
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Title level={4} style={{ margin: 0 }}>
                    Tổng cộng:
                  </Title>
                  <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                    {thanhToan.toLocaleString()}đ
                  </Title>
                </div>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  * Giảm 20% khi thuê từ 2 sách trở lên
                  <br />* Đặt cọc: 50.000đ/sách (hoàn trả khi trả sách)
                </Paragraph>
              </Space>
            </Card>

            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
              <Popconfirm
                title="Xóa toàn bộ giỏ hàng?"
                onConfirm={clearCart}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button>Xóa tất cả</Button>
              </Popconfirm>
              <Button type="primary" size="large" onClick={handleCheckout}>
                Đặt mượn ngay
              </Button>
            </Space>
          </>
        )}
      </Card>
    </div>
  )
}
