import {
  App as AntApp,
  Button,
  Card,
  Form,
  Select,
  Space,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  DatePicker,
  Empty,
} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllSach } from '../../services/sach-api'
import { getAllBanDoc } from '../../services/ban-doc-api'
import { getAllBanSao } from '../../services/ban-sao-api'
import { createPhieuMuon } from '../../services/phieu-muon-api'
import type { Sach } from '../../types/sach'
import type { BanDoc } from '../../types/ban-doc'
import type { BanSao } from '../../types/ban-sao'
import dayjs from 'dayjs'

const { Title, Text } = Typography

type CartItem = {
  sach: Sach & { soLuong: number }
  soLuong: number
  thoiHan: 'tuan' | 'thang'
}

const GIA_THUE = {
  tuan: 10000,
  thang: 35000,
}

export function MuonSachPage() {
  const { message: antMessage } = AntApp.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm()

  const [sachList, setSachList] = useState<(Sach & { soLuong: number })[]>([])
  const [banDocList, setBanDocList] = useState<BanDoc[]>([])
  const [banSaoList, setBanSaoList] = useState<BanSao[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showCart, setShowCart] = useState(!!location.state?.cart)

  useEffect(() => {
    void (async () => {
      try {
        const [sRes, bdRes, bsRes] = await Promise.all([
          getAllSach(),
          getAllBanDoc(),
          getAllBanSao(),
        ])

        // Đếm số bản có sẵn cho mỗi sách
        const banSaoData = bsRes.data ?? []
        const soLuongMap = new Map<string, number>()
        for (const bs of banSaoData) {
          if (bs.trangThai === 'Có sẵn') {
            soLuongMap.set(bs.maSach, (soLuongMap.get(bs.maSach) ?? 0) + 1)
          }
        }

        const sachWithCount = (sRes.data ?? []).map((s) => ({
          ...s,
          soLuong: soLuongMap.get(s.maSach) ?? 0,
        }))

        setSachList(sachWithCount)
        setBanDocList(bdRes.data ?? [])
        setBanSaoList(banSaoData)
      } catch (e) {
        antMessage.error('Không tải được dữ liệu')
      }
    })()
  }, [antMessage])

  // Nhận giỏ hàng từ location.state nếu có
  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart)
    }
  }, [location.state])

  const addToCart = (sach: Sach & { soLuong: number }, soLuong: number, thoiHan: 'tuan' | 'thang') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.sach.maSach === sach.maSach)
      if (existing) {
        return prev.map((item) =>
          item.sach.maSach === sach.maSach
            ? { ...item, soLuong: item.soLuong + soLuong }
            : item,
        )
      }
      return [...prev, { sach, soLuong, thoiHan }]
    })
    antMessage.success('Đã thêm vào giỏ hàng')
  }

  const removeFromCart = (maSach: string) => {
    setCart((prev) => prev.filter((item) => item.sach.maSach !== maSach))
  }

  const updateCartQuantity = (maSach: string, soLuong: number) => {
    if (soLuong < 1) return
    setCart((prev) =>
      prev.map((item) =>
        item.sach.maSach === maSach ? { ...item, soLuong } : item,
      ),
    )
  }

  const tongTien = cart.reduce((sum, item) => {
    return sum + GIA_THUE[item.thoiHan] * item.soLuong
  }, 0)

  const giamGia = cart.length >= 2 ? tongTien * 0.2 : 0
  const thanhToan = tongTien - giamGia

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)

      if (cart.length === 0) {
        antMessage.warning('Giỏ hàng trống')
        setSubmitting(false)
        return
      }

      // Tạo phiếu mượn cho mỗi sách
      for (const item of cart) {
        const banSach = banSaoList.filter((bs) => bs.maSach === item.sach.maSach && bs.trangThai === 'Có sẵn')
        if (banSach.length < item.soLuong) {
          antMessage.error(`Sách "${item.sach.tieuDe}" không đủ số lượng có sẵn`)
          setSubmitting(false)
          return
        }

        const ngayMuon = values.ngayMuon ? values.ngayMuon.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
        const hanTra = dayjs(ngayMuon).add(item.thoiHan === 'tuan' ? 7 : 30, 'day').format('YYYY-MM-DD')

        for (let i = 0; i < item.soLuong; i++) {
          const banSao = banSach[i]
          await createPhieuMuon({
            maPhieuMuon: '',
            maBanDoc: values.maBanDoc,
            maBanSao: banSao.maBanSao,
            ngayMuon: ngayMuon,
            hanTra: hanTra,
            soLanGiaHan: 0,
            trangThai: 'Đang mượn',
          })
        }
      }

      antMessage.success('Đặt mượn thành công!')
      setCart([])
      localStorage.removeItem('thue-sach-cart')
      form.resetFields()
      navigate('/thue-sach')
    } catch (e) {
      if (e instanceof Error) {
        antMessage.error(e.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const banDocOptions = banDocList.map((bd) => ({
    label: `${bd.hoTen} (${bd.maBanDoc})`,
    value: bd.maBanDoc,
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Row gutter={[24, 24]}>
        {/* Form đặt mượn */}
        <Col xs={24} lg={showCart ? 14 : 24}>
          <Card title="📝 Đặt mượn sách">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ngayMuon: dayjs(),
              }}
            >
              <Form.Item
                name="maBanDoc"
                label="Mã bạn đọc"
                rules={[{ required: true, message: 'Chọn mã bạn đọc' }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn mã bạn đọc"
                  optionFilterProp="children"
                  options={banDocOptions}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item name="ngayMuon" label="Ngày mượn">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>

              <Divider />

              <Title level={5}>📚 Chọn sách để mượn</Title>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {sachList.slice(0, 20).map((sach) => {
                  const cartItem = cart.find((c) => c.sach.maSach === sach.maSach)
                  return (
                    <Card
                      key={sach.maSach}
                      size="small"
                      title={sach.tieuDe}
                      extra={
                        cartItem ? (
                          <Tag color="blue">Đã thêm ({cartItem.soLuong})</Tag>
                        ) : undefined
                      }
                    >
                      <Row gutter={[16, 16]} align="middle">
                        <Col>
                          <Text>Tác giả: {sach.tacGia}</Text>
                          <br />
                          <Text type="secondary">Còn {sach.soLuong} bản</Text>
                        </Col>
                        <Col>
                          <Space>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => addToCart(sach, 1, 'tuan')}
                              disabled={sach.soLuong < 1}
                            >
                              +1 Tuần (10k)
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => addToCart(sach, 1, 'thang')}
                              disabled={sach.soLuong < 1}
                            >
                              +1 Tháng (35k)
                            </Button>
                            {cartItem && (
                              <Space size="small">
                                <Button
                                  size="small"
                                  onClick={() =>
                                    updateCartQuantity(sach.maSach, cartItem.soLuong - 1)
                                  }
                                >
                                  -
                                </Button>
                                <Text>{cartItem.soLuong}</Text>
                                <Button
                                  size="small"
                                  onClick={() =>
                                    updateCartQuantity(sach.maSach, cartItem.soLuong + 1)
                                  }
                                  disabled={cartItem.soLuong >= 3}
                                >
                                  +
                                </Button>
                              </Space>
                            )}
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  )
                })}
              </Space>
            </Form>
          </Card>
        </Col>

        {/* Giỏ hàng */}
        {showCart && (
          <Col xs={24} lg={10}>
            <Card
              title="🛒 Giỏ hàng"
              extra={
                <Button type="link" onClick={() => setShowCart(false)}>
                  Ẩn
                </Button>
              }
              style={{ position: 'sticky', top: 24 }}
            >
              {cart.length === 0 ? (
                <Empty description="Chưa có sách nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {cart.map((item) => (
                    <Card key={item.sach.maSach} size="small">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <Text strong>{item.sach.tieuDe}</Text>
                          <br />
                          <Text type="secondary">
                            {item.thoiHan === 'tuan' ? '1 tuần' : '1 tháng'} x {item.soLuong}
                          </Text>
                        </div>
                        <Space>
                          <Text strong>{(GIA_THUE[item.thoiHan] * item.soLuong).toLocaleString()}đ</Text>
                          <Button
                            size="small"
                            danger
                            onClick={() => removeFromCart(item.sach.maSach)}
                          >
                            Xóa
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  ))}

                  <Divider />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tạm tính:</Text>
                    <Text>{tongTien.toLocaleString()}đ</Text>
                  </div>
                  {giamGia > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">Giảm giá:</Text>
                      <Text type="danger">-{giamGia.toLocaleString()}đ</Text>
                    </div>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                    <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                      {thanhToan.toLocaleString()}đ
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    block
                    size="large"
                    loading={submitting}
                    onClick={onSubmit}
                  >
                    Xác nhận đặt mượn
                  </Button>
                </Space>
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )
}
