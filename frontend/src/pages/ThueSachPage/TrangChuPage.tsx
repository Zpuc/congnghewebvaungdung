import {
  App as AntApp,
  Button,
  Card,
  Col,
  Row,
  Typography,
  Carousel,
  Tag,
  Space,
  Image,
} from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllSach } from '../../services/sach-api'
import { getAllBanSao } from '../../services/ban-sao-api'
import type { Sach } from '../../types/sach'

const { Title, Paragraph } = Typography

export function TrangChuPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [sachNoiBat, setSachNoiBat] = useState<(Sach & { soLuong: number })[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const [sRes, bsRes] = await Promise.all([getAllSach(), getAllBanSao()])
        const sachList = sRes.data ?? []
        const banSaoList = bsRes.data ?? []

        // Đếm số bản có sẵn cho mỗi sách
        const soLuongMap = new Map<string, number>()
        for (const bs of banSaoList) {
          if (bs.trangThai === 'Có sẵn') {
            soLuongMap.set(bs.maSach, (soLuongMap.get(bs.maSach) ?? 0) + 1)
          }
        }

        // Kết hợp sách với số lượng
        const sachWithCount = sachList
          .slice(0, 8)
          .map((s) => ({ ...s, soLuong: soLuongMap.get(s.maSach) ?? 0 }))

        setSachNoiBat(sachWithCount)
      } catch (e) {
        const text = e instanceof Error ? e.message : 'Không tải được sách'
        message.error(text)
      } finally {
        setLoading(false)
      }
    })()
  }, [message])

  const carouselContent = [
    (
      <div
        key="1"
        style={{
          height: 400,
          color: 'white',
          lineHeight: '400px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          📚 Thư viện số - Nơi tri thức lan tỏa
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
          Khám phá hàng ngàn đầu sách với dịch vụ thuê mượn tiện lợi
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/thue-sach')}>
          Xem ngay
        </Button>
      </div>
    ),
    (
      <div
        key="2"
        style={{
          height: 400,
          color: 'white',
          lineHeight: '400px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        }}
      >
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          🏠 Thuê sách tại nhà - Giao tận tay
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
          Đặt mượn sách dễ dàng, nhận tận nơi, trả lại linh hoạt
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/thue-sach')}>
          Đặt mượn ngay
        </Button>
      </div>
    ),
    (
      <div
        key="3"
        style={{
          height: 400,
          color: 'white',
          lineHeight: '400px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        }}
      >
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          ⭐ Dịch vụ chuyên nghiệp
        </Title>
        <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
          Hỗ trợ 24/7 - Phạt hạn trễ hợp lý - Đổi trả dễ dàng
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/thue-sach/chinh-sach')}>
          Tìm hiểu thêm
        </Button>
      </div>
    ),
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
      {/* Carousel banner */}
      <Carousel autoplay style={{ marginBottom: 48 }}>{carouselContent}</Carousel>

      {/* Giới thiệu nhanh */}
      <Card
        title="Tại sao chọn chúng tôi?"
        style={{ marginBottom: 32, textAlign: 'center' }}
        styles={{ header: { textAlign: 'center' } }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>📖</Typography.Title>
              <Title level={4}>Đa dạng sách</Title>
              <Paragraph>
                Hơn 10.000 đầu sách từ văn học, khoa học, kỹ năng đến thiếu nhi
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>🚚</Typography.Title>
              <Title level={4}>Giao hàng nhanh</Title>
              <Paragraph>Miễn phí giao sách tận nhà trong 24-48 giờ</Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>💰</Typography.Title>
              <Title level={4}>Giá cả hợp lý</Title>
              <Paragraph>Thuê theo tuần/tháng với mức giá ưu đãi</Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>🎧</Typography.Title>
              <Title level={4}>Hỗ trợ 24/7</Title>
              <Paragraph>Đội ngũ tư vấn luôn sẵn sàng phục vụ</Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Sách nổi bật */}
      <Card
        title=" Sách nổi bật"
        style={{ marginBottom: 32 }}
        loading={loading}
      >
        <Row gutter={[16, 16]}>
          {sachNoiBat.map((sach) => (
            <Col xs={12} sm={8} md={6} lg={4} key={sach.maSach}>
              <Card
                hoverable
                cover={
                  sach.anhBiaUrl ? (
                    <Image
                      src={sach.anhBiaUrl.startsWith('http') ? sach.anhBiaUrl : `http://localhost:5001${sach.anhBiaUrl}`}
                      alt={sach.tieuDe}
                      style={{ height: 200, objectFit: 'cover' }}
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6C3YG3R5cIjOOQmmIhkhJSUZ3VqLOtpCJ+wg7PT9J3XX6cAYHkEbXY4wuHF0QBx7TkVgC9APIFqR1nIIugbqGxYERQ1EMBEAg0xAUFkS1Cp6ZmHkzEAhjFFfLB2RZ1sH0I7jGqgR0GziTdNvod1Fg2GzBxWkF0PiJMgiiLhM3tSICn6tOLf6Vp2dNndD4G7MxdGghcRYDkGkA5XnDfRfvguyDRvLpDBKkZvg3gBqZF4nsj2G+0R4Uq7aRSjGR9zJ4F/mMc3kM8YcYwlE3K4HpGjY4VlH6a4I7z1WkZ9WkH8NkD6BRg6sD6Lq5p7HxQY7pR1l4Ea7J3xWg6aXqKxVpBVVwG8LzGj1v7G/39P/58R4GehM0GkXR8T6V0LqLcXxV2vCwAAAABJRU5ErkJggg=="
                      onError={(e) => {
                        ; (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 48,
                      }}
                    >
                      📕
                    </div>
                  )
                }
                styles={{ body: { padding: 12 } }}
                onClick={() => navigate(`/thue-sach/chi-tiet/${sach.maSach}`)}
              >
                <Typography.Text strong ellipsis style={{ display: 'block', fontSize: 14 }}>
                  {sach.tieuDe}
                </Typography.Text>
                <Typography.Text type="secondary" ellipsis style={{ display: 'block', fontSize: 12 }}>
                  {sach.tacGia}
                </Typography.Text>
                <Space style={{ marginTop: 8 }}>
                  <Tag color="blue">{sach.theLoai || 'Chưa phân loại'}</Tag>
                  <Tag color="green">{sach.soLuong} còn</Tag>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Call to action */}
      <Card
        style={{
          marginBottom: 32,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
        }}
      >
        <Title level={3}>Bạn đã sẵn sàng để bắt đầu?</Title>
        <Paragraph style={{ fontSize: 16 }}>
          Đăng ký tài khoản để thuê sách ngay hôm nay
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" onClick={() => navigate('/thue-sach')}>
            Thuê sách ngay
          </Button>
          <Button size="large" onClick={() => navigate('/thue-sach/chinh-sach')}>
            Tìm hiểu thêm
          </Button>
        </Space>
      </Card>
    </div>
  )
}
