import { Card, Col, Row, Typography, Timeline, Statistic } from 'antd'
import {
  BookOutlined,
  UserOutlined,
  HomeOutlined,
  TrophyOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

export function GioiThieuPage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Về chúng tôi
        </Title>

        {/* Giới thiệu chung */}
        <Card type="inner" title="📖 Câu chuyện của chúng tôi" style={{ marginBottom: 24 }}>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
            Thư viện số của chúng tôi được thành lập với sứ mệnh mang tri thức đến gần hơn với mọi
            người. Chúng tôi tin rằng việc đọc sách không chỉ là một thói quen mà còn là cách để
            phát triển bản thân, mở rộng tầm nhìn và kết nối với thế giới xung quanh.
          </Paragraph>
          <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
            Với hơn 10 năm kinh nghiệm trong lĩnh vực thư viện và xuất bản, chúng tôi tự hào là
            đơn vị tiên phong trong việc số hóa dịch vụ cho thuê sách, giúp bạn đọc có thể tiếp
            cận hàng ngàn đầu sách chỉ với vài thao tác đơn giản.
          </Paragraph>
        </Card>

        {/* Thống kê */}
        <Card type="inner" title="📊 Con số ấn tượng" style={{ marginBottom: 24 }}>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Đầu sách"
                value={10000}
                prefix={<BookOutlined />}
                suffix="+"
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Thành viên"
                value={50000}
                prefix={<UserOutlined />}
                suffix="+"
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Chi nhánh"
                value={15}
                prefix={<HomeOutlined />}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Giải thưởng"
                value={25}
                prefix={<TrophyOutlined />}
                suffix="+"
              />
            </Col>
          </Row>
        </Card>

        {/* Lịch sử phát triển */}
        <Card type="inner" title="🕰️ Hành trình phát triển" style={{ marginBottom: 24 }}>
          <Timeline
            mode="left"
            items={[
              {
                label: '2014',
                children: (
                  <>
                    <Title level={5}>Khởi đầu</Title>
                    <Paragraph>
                      Thành lập thư viện đầu tiên tại Hà Nội với 1.000 đầu sách
                    </Paragraph>
                  </>
                ),
              },
              {
                label: '2016',
                children: (
                  <>
                    <Title level={5}>Mở rộng</Title>
                    <Paragraph>
                      Khai trương 5 chi nhánh mới tại TP.HCM, Đà Nẵng, Cần Thơ
                    </Paragraph>
                  </>
                ),
              },
              {
                label: '2019',
                children: (
                  <>
                    <Title level={5}>Số hóa</Title>
                    <Paragraph>
                      Ra mắt nền tảng thuê sách trực tuyến, giao hàng tận nhà
                    </Paragraph>
                  </>
                ),
              },
              {
                label: '2022',
                children: (
                  <>
                    <Title level={5}>Đổi mới</Title>
                    <Paragraph>
                      Ứng dụng AI gợi ý sách, hệ thống quản lý thông minh
                    </Paragraph>
                  </>
                ),
              },
              {
                label: '2024',
                children: (
                  <>
                    <Title level={5}>Hiện tại</Title>
                    <Paragraph>
                      Phục vụ hơn 50.000 thành viên với 10.000+ đầu sách đa dạng
                    </Paragraph>
                  </>
                ),
              },
            ]}
          />
        </Card>

        {/* Giá trị cốt lõi */}
        <Card type="inner" title="💎 Giá trị cốt lõi">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Title level={4}>🎯 Sứ mệnh</Title>
              <Paragraph style={{ fontSize: 16 }}>
                Lan tỏa văn hóa đọc, giúp mọi người dễ dàng tiếp cận tri thức với chi phí hợp lý
                nhất.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>👁️ Tầm nhìn</Title>
              <Paragraph style={{ fontSize: 16 }}>
                Trở thành nền tảng cho thuê sách hàng đầu Việt Nam, phục vụ 1 triệu độc giả vào
                năm 2030.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>🤝 Cam kết</Title>
              <Paragraph style={{ fontSize: 16 }}>
                Chất lượng sách tốt, dịch vụ chuyên nghiệp, giá cả minh bạch, hỗ trợ tận tâm.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>🌱 Trách nhiệm</Title>
              <Paragraph style={{ fontSize: 16 }}>
                Bảo vệ môi trường bằng cách tái sử dụng sách, giảm thiểu lãng phí tài nguyên.
              </Paragraph>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  )
}
