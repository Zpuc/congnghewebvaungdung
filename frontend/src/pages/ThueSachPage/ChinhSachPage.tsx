import { Card, Collapse, Typography, Space, Alert } from 'antd'

const { Title, Paragraph } = Typography

export function ChinhSachPage() {
  const items = [
    {
      key: '1',
      label: '📖 Chính sách thuê sách',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Điều kiện thuê:</strong>
          </Paragraph>
          <ul>
            <li>Khách hàng phải từ 16 tuổi trở lên</li>
            <li>Có giấy tờ tùy thân hợp lệ (CMND/CCCD/Hộ chiếu)</li>
            <li>Đặt cọc tiền đảm bảo (hoàn trả khi trả sách)</li>
            <li>Đăng ký tài khoản thành viên</li>
          </ul>
          <Paragraph>
            <strong>2. Thời hạn thuê:</strong>
          </Paragraph>
          <ul>
            <li>Thuê theo tuần: 7 ngày</li>
            <li>Thuê theo tháng: 30 ngày</li>
            <li>Có thể gia hạn thêm 1 lần (7 ngày) nếu sách chưa có người đặt trước</li>
          </ul>
          <Paragraph>
            <strong>3. Giá thuê:</strong>
          </Paragraph>
          <ul>
            <li>Sách thường: 5.000đ - 20.000đ/tuần</li>
            <li>Sách mới/hot: 15.000đ - 50.000đ/tuần</li>
            <li>Giảm 10% cho sinh viên, giảm 20% khi thuê từ 2 sách trở lên</li>
          </ul>
        </Space>
      ),
    },
    {
      key: '2',
      label: '⏰ Chính sách trả sách',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Thời gian trả sách:</strong>
          </Paragraph>
          <ul>
            <li>Trả sách đúng hạn: hoàn tiền đặt cọc</li>
            <li>Trả sách trễ hạn: phạt 2.000đ/ngày/sách</li>
            <li>Không trả sách sau 15 ngày: mất quyền lợi thành viên, bị liệt kê danh sách đen</li>
          </ul>
          <Paragraph>
            <strong>2. Trạng thái sách khi trả:</strong>
          </Paragraph>
          <ul>
            <li>Sách còn nguyên vẹn: không phát sinh chi phí</li>
            <li>Sách hư nhẹ (rách trang, bẩn): phạt 20.000đ - 50.000đ</li>
            <li>Sách hư nặng/ mất: bồi thường 200% giá bìa sách</li>
          </ul>
          <Paragraph>
            <strong>3. Quy trình trả sách:</strong>
          </Paragraph>
          <ul>
            <li>Đối với giao nhận tận nhà: nhân viên sẽ kiểm tra sách tại chỗ</li>
            <li>Đối với trả tại quầy: nhân viên kiểm tra và ký nhận</li>
            <li>Hệ thống tự động cập nhật trạng thái và hoàn tiền đặt cọc</li>
          </ul>
        </Space>
      ),
    },
    {
      key: '3',
      label: '💰 Chính sách thanh toán & hoàn tiền',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Phương thức thanh toán:</strong>
          </Paragraph>
          <ul>
            <li>Tiền mặt tại quầy</li>
            <li>Chuyển khoản ngân hàng</li>
            <li>Ví điện tử (Momo, ZaloPay, VNPay)</li>
            <li>Thẻ tín dụng/ghi nợ</li>
          </ul>
          <Paragraph>
            <strong>2. Hoàn tiền:</strong>
          </Paragraph>
          <ul>
            <li>Hoàn tiền đặt cọc: trong vòng 3-5 ngày làm việc sau khi trả sách</li>
            <li>Hoàn tiền đơn hàng hủy: trong vòng 7 ngày</li>
            <li>Không hoàn tiền cho các trường hợp phạt, phí phát sinh</li>
          </ul>
          <Paragraph>
            <strong>3. Ưu đãi - Khuyến mãi:</strong>
          </Paragraph>
          <ul>
            <li>Giảm 10% cho sinh viên, giáo viên</li>
            <li>Giảm 20% khi thuê từ 2 sách trở lên</li>
            <li>Tích điểm: 1.000đ mỗi 10.000đ chi tiêu</li>
            <li>Giảm 50% tuần đầu tiên cho thành viên mới</li>
          </ul>
        </Space>
      ),
    },
    {
      key: '4',
      label: '📋 Điều khoản sử dụng',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Quy định chung:</strong>
          </Paragraph>
          <ul>
            <li>Mỗi thành viên tối đa được thuê 3 sách cùng lúc</li>
            <li>Không được sao chép, xé, tẩy xóa sách</li>
            <li>Không được chuyển nhượng sách cho người khác</li>
            <li>Phải thông báo ngay nếu phát hiện sách bị hư hỏng</li>
          </ul>
          <Paragraph>
            <strong>2. Cấm các hành vi:</strong>
          </Paragraph>
          <ul>
            <li>Bán, cho thuê lại sách thuê từ thư viện</li>
            <li>Làm hư hỏng cố ý sách</li>
            <li>Đánh cắp sách</li>
            <li>Cung cấp thông tin giả mạo</li>
          </ul>
          <Paragraph>
            <strong>3. Xử phạt:</strong>
          </Paragraph>
          <ul>
            <li>Phạt tiền từ 100.000đ - 1.000.000đ tùy mức độ vi phạm</li>
            <li>Cấm sử dụng dịch vụ vĩnh viễn với các vi phạm nghiêm trọng</li>
            <li>Không hoàn tiền đặt cọc đối với vi phạm</li>
          </ul>
        </Space>
      ),
    },
    {
      key: '5',
      label: '🔒 Chính sách bảo mật',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Thu thập thông tin:</strong>
          </Paragraph>
          <ul>
            <li>Họ tên, ngày sinh, địa chỉ, số điện thoại, email</li>
            <li>Thông tin giao dịch và lịch sử thuê sách</li>
            <li>Chúng tôi chỉ thu thập thông tin cần thiết cho dịch vụ</li>
          </ul>
          <Paragraph>
            <strong>2. Sử dụng thông tin:</strong>
          </Paragraph>
          <ul>
            <li>Quản lý tài khoản và dịch vụ thuê sách</li>
            <li>Gửi thông báo về hạn trả, ưu đãi (có thể hủy đăng ký)</li>
            <li>Hỗ trợ khách hàng và xử lý khiếu nại</li>
            <li>Không bán, cho thuê thông tin cá nhân</li>
          </ul>
          <Paragraph>
            <strong>3. Bảo vệ thông tin:</strong>
          </Paragraph>
          <ul>
            <li>Mã hóa dữ liệu nhạy cảm</li>
            <li>Kiểm soát truy cập nghiêm ngặt</li>
            <li>Bảo trì hệ thống an ninh mạng định kỳ</li>
            <li>Tuân thủ Luật Bảo vệ dữ liệu cá nhân</li>
          </ul>
        </Space>
      ),
    },
    {
      key: '6',
      label: '📞 Hỗ trợ & khiếu nại',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <strong>1. Kênh hỗ trợ:</strong>
          </Paragraph>
          <ul>
            <li>Hotline: 1900.1234 (8:00 - 21:00)</li>
            <li>Email: support@thuvien.so</li>
            <li>Chat trực tuyến trên website/app</li>
            <li>Fanpage: Thư viện số - hỗ trợ 24/7</li>
          </ul>
          <Paragraph>
            <strong>2. Thời gian xử lý khiếu nại:</strong>
          </Paragraph>
          <ul>
            <li>Khiếu nại thường: 3-5 ngày làm việc</li>
            <li>Khiếu nại khẩn cấp: 24 giờ</li>
            <li>Phản hồi qua email/SMS khi có kết quả</li>
          </ul>
          <Paragraph>
            <strong>3. Trường hợp được ưu tiên xử lý:</strong>
          </Paragraph>
          <ul>
            <li>Lỗi hệ thống, không lỗi người dùng</li>
            <li>Giao nhận sai, thất lạc hàng hóa</li>
            <li>Sai sót về tính phí, phạt</li>
          </ul>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Alert
        message="Lưu ý quan trọng"
        description="Vui lòng đọc kỹ các chính sách trước khi sử dụng dịch vụ. Bằng cách sử dụng dịch vụ, bạn đồng ý với tất cả các điều khoản trên."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          Chính sách thuê sách
        </Title>
        <Collapse
          items={items}
          defaultActiveKey={['1']}
          expandIconPosition="start"
          style={{ marginTop: 16 }}
        />
      </Card>

      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Paragraph>
          Có câu hỏi hoặc cần hỗ trợ? Liên hệ với chúng tôi ngay!
        </Paragraph>
        <Space>
          <a href="tel:19001234">📞 Gọi hotline</a>
          <a href="mailto:support@thuvien.so">📧 Gửi email</a>
          <a href="/thue-sach/gioi-thieu">ℹ️ Về chúng tôi</a>
        </Space>
      </Card>
    </div>
  )
}
