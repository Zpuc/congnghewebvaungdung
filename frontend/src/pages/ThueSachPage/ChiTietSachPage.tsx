import {
  App as AntApp,
  Button,
  Card,
  Descriptions,
  Image,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Spin,
  Modal,
} from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuth } from '../../auth/AuthContext'
import { getSachById } from '../../services/sach-api'
import { getAllBanSao } from '../../services/ban-sao-api'
import { createPhieuMuon } from '../../services/phieu-muon-api'
import type { Sach } from '../../types/sach'
import type { BanSao } from '../../types/ban-sao'

const { Title, Paragraph, Text } = Typography

export function ChiTietSachPage() {
  const { message: antMessage } = AntApp.useApp()
  const { maSach } = useParams<{ maSach: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [sach, setSach] = useState<Sach | null>(null)
  const [soLuongConLai, setSoLuongConLai] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [availableBanSao, setAvailableBanSao] = useState<BanSao[]>([])

  useEffect(() => {
    void (async () => {
      if (!maSach) return

      setLoading(true)
      try {
        // Lấy thông tin sách
        const sachRes = await getSachById(maSach)
        if (sachRes.data) {
          setSach(sachRes.data)

          // Lấy số lượng bản có sẵn
          const bsRes = await getAllBanSao()
          const banSaoList = bsRes.data ?? []
          const available = banSaoList.filter(
            (bs) => bs.maSach === maSach && bs.trangThai === 'Có sẵn'
          )
          setAvailableBanSao(available)
          setSoLuongConLai(available.length)
        }
      } catch (e) {
        const text = e instanceof Error ? e.message : 'Không tải được thông tin sách'
        antMessage.error(text)
      } finally {
        setLoading(false)
      }
    })()
  }, [maSach, antMessage])

  const handleMuonSach = async () => {
    if (!sach) return

    // Check if user is authenticated
    if (!isAuthenticated) {
      antMessage.warning('Vui lòng đăng nhập để mượn sách')
      navigate('/login', { state: { from: `/thue-sach/chi-tiet/${maSach}` } })
      return
    }

    // Check if user has a reader account (maBanDoc)
    if (!user?.maBanDoc) {
      Modal.warning({
        title: 'Chưa có thẻ bạn đọc',
        content: (
          <div>
            <p>Bạn chưa có thẻ bạn đọc. Vui lòng liên hệ thủ thư để được cấp thẻ.</p>
          </div>
        ),
      })
      return
    }

    // Check if there's an available copy
    if (availableBanSao.length === 0) {
      antMessage.error('Không còn bản có sẵn để mượn')
      return
    }

    // Show confirmation modal
    Modal.confirm({
      title: 'Xác nhận mượn sách',
      content: (
        <div>
          <p><strong>Sách:</strong> {sach.tieuDe}</p>
          <p><strong>Tác giả:</strong> {sach.tacGia}</p>
          <p><strong>Hạn trả:</strong> {dayjs().add(7, 'day').format('DD/MM/YYYY')} (7 ngày)</p>
        </div>
      ),
      okText: 'Xác nhận mượn',
      cancelText: 'Hủy',
      okButtonProps: { loading: borrowing },
      onOk: async () => {
        await createBorrowRecord()
      },
    })
  }

  const createBorrowRecord = async () => {
    if (!sach || !user?.maBanDoc || availableBanSao.length === 0) {
      return
    }

    setBorrowing(true)
    try {
      const maBanDoc = user.maBanDoc
      const banSao = availableBanSao[0] // Take the first available copy
      const ngayMuon = dayjs().format('YYYY-MM-DD')
      const hanTra = dayjs().add(7, 'day').format('YYYY-MM-DD')

      // Create borrowing record
      const result = await createPhieuMuon({
        maPhieuMuon: '',
        maBanSao: banSao.maBanSao,
        maBanDoc: maBanDoc,
        ngayMuon: ngayMuon,
        hanTra: hanTra,
        soLanGiaHan: 0,
        trangThai: 'Đang mượn',
      })

      if (result.success) {
        antMessage.success('Mượn sách thành công!')
        // Refresh the available copies count
        const bsRes = await getAllBanSao()
        const banSaoList = bsRes.data ?? []
        const available = banSaoList.filter(
          (bs) => bs.maSach === sach.maSach && bs.trangThai === 'Có sẵn'
        )
        setAvailableBanSao(available)
        setSoLuongConLai(available.length)
      } else {
        antMessage.error(result.message || 'Mượn sách thất bại')
      }
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Mượn sách thất bại'
      antMessage.error(text)
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!sach) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Title level={4}>Không tìm thấy sách</Title>
          <Button type="primary" onClick={() => navigate('/thue-sach')}>
            Quay lại
          </Button>
        </div>
      </Card>
    )
  }

  const imageUrl = sach.anhBiaUrl?.startsWith('http')
    ? sach.anhBiaUrl
    : sach.anhBiaUrl
      ? `http://localhost:5001${sach.anhBiaUrl}`
      : null

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Button
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </Button>

      <Card>
        <Row gutter={[32, 32]}>
          {/* Cột ảnh bìa */}
          <Col xs={24} md={10} lg={8}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={sach.tieuDe}
                style={{
                  width: '100%',
                  maxHeight: 500,
                  objectFit: 'contain',
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6C3YG3R5cIjOOQmmIhkhJSUZ3VqLOtpCJ+wg7PT9J3XX6cAYHkEbXY4wuHF0QBx7TkVgC9APIFqR1nIIugbqGxYERQ1EMBEAg0xAUFkS1Cp6ZmHkzEAhjFFfLB2RZ1sH0I7jGqgR0GziTdNvod1Fg2GzBxWkF0PiJMgiiLhM3tSICn6tOLf6Vp2dNndD4G7MxdGghcRYDkGkA5XnDfRfvguyDRvLpDBKkZvg3gBqZF4nsj2G+0R4Uq7aRSjGR9zJ4F/mMc3kM8YcYwlE3K4HpGjY4VlH6a4I7z1WkZ9WkH8NkD6BRg6sD6Lq5p7HxQY7pR1l4Ea7J3xWg6aXqKxVpBVVwG8LzGj1v7G/39P/58R4GehM0GkXR8T6V0LqLcXxV2vCwAAAABJRU5ErkJggg=="
                onError={(e) => {
                  ; (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  maxWidth: 300,
                  height: 400,
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 100,
                  margin: '0 auto',
                  borderRadius: 8,
                }}
              >
                📕
              </div>
            )}
          </Col>

          {/* Cột thông tin */}
          <Col xs={24} md={14} lg={16}>
            <Title level={2} style={{ marginBottom: 16 }}>
              {sach.tieuDe}
            </Title>

            <Space size="large" style={{ marginBottom: 24 }}>
              <Space>
                <Text strong>Tác giả:</Text>
                <Text>{sach.tacGia}</Text>
              </Space>
              {sach.namXuatBan && (
                <Space>
                  <Text strong>Năm XB:</Text>
                  <Text>{sach.namXuatBan}</Text>
                </Space>
              )}
              {sach.ngonNgu && (
                <Space>
                  <Text strong>Ngôn ngữ:</Text>
                  <Text>{sach.ngonNgu}</Text>
                </Space>
              )}
            </Space>

            <Space style={{ marginBottom: 24 }}>
              <Tag color="blue" style={{ fontSize: 14 }}>
                {sach.theLoai || 'Chưa phân loại'}
              </Tag>
              <Tag color={soLuongConLai > 0 ? 'green' : 'red'} style={{ fontSize: 14 }}>
                {soLuongConLai > 0 ? `${soLuongConLai} bản có sẵn` : 'Hết bản'}
              </Tag>
            </Space>

            {sach.tomTat && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Tóm tắt</Title>
                <Paragraph style={{ fontSize: 14, lineHeight: 1.8 }}>
                  {sach.tomTat}
                </Paragraph>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
              <Button
                type="primary"
                size="large"
                onClick={handleMuonSach}
                disabled={soLuongConLai === 0}
                loading={borrowing}
                style={{ minWidth: 200 }}
              >
                {soLuongConLai > 0 ? 'Thuê sách' : 'Hết bản'}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Thông tin chi tiết */}
      <Card title="Thông tin chi tiết" style={{ marginTop: 24 }}>
        <Descriptions bordered column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Mã sách">
            {sach.maSach}
          </Descriptions.Item>
          <Descriptions.Item label="Thể loại">
            {sach.theLoai || 'Chưa phân loại'}
          </Descriptions.Item>
          <Descriptions.Item label="Tác giả">
            {sach.tacGia}
          </Descriptions.Item>
          <Descriptions.Item label="Năm xuất bản">
            {sach.namXuatBan || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngôn ngữ">
            {sach.ngonNgu || 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng có sẵn">
            <Text type={soLuongConLai > 0 ? 'success' : 'danger'}>
              {soLuongConLai} bản
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
