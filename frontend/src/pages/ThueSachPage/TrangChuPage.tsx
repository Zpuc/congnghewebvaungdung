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
        <Button type="primary" size="large" onClick={() => navigate('/thue-sach/muon-sach')}>
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
        <Button type="primary" size="large" onClick={() => navigate('/thue-sach/muon-sach')}>
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
        headStyle={{ textAlign: 'center' }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>📖</Typography.Title>
              <Title level={4}>Đa dạng sách</Title>
              <Paragraph>
                Hơn 10.000 đầu sách từ văn học, khoa học, kỹ năng đến thiếu nhi
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>🚚</Typography.Title>
              <Title level={4}>Giao hàng nhanh</Title>
              <Paragraph>Miễn phí giao sách tận nhà trong 24-48 giờ</Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>💰</Typography.Title>
              <Title level={4}>Giá cả hợp lý</Title>
              <Paragraph>Thuê theo tuần/tháng với mức giá ưu đãi</Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Typography.Title level={3} style={{ margin: 0 }}>🎧</Typography.Title>
              <Title level={4}>Hỗ trợ 24/7</Title>
              <Paragraph>Đội ngũ tư vấn luôn sẵn sàng phục vụ</Paragraph>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Sách nổi bật */}
      <Card
        title="📚 Sách nổi bật"
        style={{ marginBottom: 32 }}
        extra={<Button type="link" onClick={() => navigate('/thue-sach/muon-sach')}>Xem tất cả →</Button>}
        loading={loading}
      >
        <Row gutter={[16, 16]}>
          {sachNoiBat.map((sach) => (
            <Col xs={12} sm={8} md={6} lg={4} key={sach.maSach}>
              <Card
                hoverable
                cover={
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
                }
                bodyStyle={{ padding: 12 }}
                onClick={() => navigate('/thue-sach/muon-sach')}
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
          <Button type="primary" size="large" onClick={() => navigate('/thue-sach/muon-sach')}>
            Thuê sách ngay
          </Button>
          <Button size="large" onClick={() => navigate('/thue-sach/gioi-thieu')}>
            Tìm hiểu thêm
          </Button>
        </Space>
      </Card>
    </div>
  )
}
