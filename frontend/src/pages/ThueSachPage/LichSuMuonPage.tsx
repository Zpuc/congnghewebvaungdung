import {
  App as AntApp,
  Card,
  Table,
  Tag,
  Typography,
  Modal,
  DatePicker,
  Descriptions,
  Alert,
  Space,
} from 'antd'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { getAllPhieuMuon } from '../../services/phieu-muon-api'
import { traSachVaTinhPhat } from '../../services/phieu-muon-api'
import type { PhieuMuon } from '../../types/phieu-muon'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export function LichSuMuonPage() {
  const { message: antMessage } = AntApp.useApp()
  const { user } = useAuth()
  const [phieuMuonList, setPhieuMuonList] = useState<PhieuMuon[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPhieu, setSelectedPhieu] = useState<PhieuMuon | null>(null)
  const [traModalOpen, setTraModalOpen] = useState(false)
  const [traNgay, setTraNgay] = useState(dayjs())

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllPhieuMuon()
      let data = res.data ?? []

      // Filter: Readers only see their own borrowing records
      if (user?.vaiTro === 'Bạn đọc' && user?.maBanDoc) {
        data = data.filter((pm) => pm.maBanDoc === user.maBanDoc)
      }

      setPhieuMuonList(data)
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách phiếu mượn'
      antMessage.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleTraSach = async () => {
    if (!selectedPhieu) return

    try {
      const result = await traSachVaTinhPhat({
        maPhieuMuon: selectedPhieu.maPhieuMuon,
        ngayTraThucTe: traNgay.format('YYYY-MM-DD'),
      })

      if (result.data) {
        antMessage.success(
          result.data.tienPhat > 0
            ? `Đã trả sách. Phạt: ${result.data.tienPhat.toLocaleString()}đ`
            : 'Đã trả sách, không phạt'
        )
        setTraModalOpen(false)
        setSelectedPhieu(null)
        await fetchData()
      }
    } catch (e) {
      if (e instanceof Error) {
        antMessage.error(e.message)
      }
    }
  }

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: 'Mã phiếu mượn',
      dataIndex: 'maPhieuMuon',
      key: 'maPhieuMuon',
      width: 140,
    },
    {
      title: 'Mã bạn đọc',
      dataIndex: 'maBanDoc',
      key: 'maBanDoc',
      width: 120,
    },
    {
      title: 'Mã bản sao',
      dataIndex: 'maBanSao',
      key: 'maBanSao',
      width: 120,
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'ngayMuon',
      key: 'ngayMuon',
      width: 120,
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Hạn trả',
      dataIndex: 'hanTra',
      key: 'hanTra',
      width: 120,
      render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày trả thực tế',
      dataIndex: 'ngayTraThucTe',
      key: 'ngayTraThucTe',
      width: 140,
      render: (v: string | null) => (v ? dayjs(v).format('DD/MM/YYYY') : 'Chưa trả'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (value: string) => {
        const color =
          value === 'Đang mượn'
            ? 'blue'
            : value === 'Đã trả'
            ? 'green'
            : value === 'Quá hạn'
            ? 'red'
            : 'default'
        return <Tag color={color}>{value}</Tag>
      },
    },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <Card>
        <Title level={2}>📋 Lịch sử mượn sách</Title>
        <Text type="secondary">Xem và trả sách</Text>

        <Table
          rowKey={(record) => record.maPhieuMuon}
          loading={loading}
          columns={columns}
          dataSource={phieuMuonList}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="Trả sách"
        open={traModalOpen}
        onOk={handleTraSach}
        onCancel={() => {
          setTraModalOpen(false)
          setSelectedPhieu(null)
        }}
        confirmLoading={false}
      >
        {selectedPhieu && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions title="Thông tin phiếu mượn" bordered size="small">
              <Descriptions.Item label="Mã phiếu">{selectedPhieu.maPhieuMuon}</Descriptions.Item>
              <Descriptions.Item label="Mã bạn đọc">{selectedPhieu.maBanDoc}</Descriptions.Item>
              <Descriptions.Item label="Mã bản sao">{selectedPhieu.maBanSao}</Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">
                {dayjs(selectedPhieu.ngayMuon).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn trả">
                {dayjs(selectedPhieu.hanTra).format('DD/MM/YYYY')}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong>Ngày trả thực tế: </Text>
              <DatePicker
                value={traNgay}
                onChange={(date) => setTraNgay(date ?? dayjs())}
                format="YYYY-MM-DD"
              />
            </div>

            {dayjs(traNgay).isAfter(dayjs(selectedPhieu.hanTra)) && (
              <Alert
                message="Cảnh báo"
                description={
                  <Space>
                    <Text>
                      Trả sách trễ hạn! Bạn sẽ bị phạt{' '}
                      {Math.ceil(dayjs(traNgay).diff(dayjs(selectedPhieu.hanTra), 'day')) * 2000}{' '}
                      đồng.
                    </Text>
                  </Space>
                }
                type="warning"
                showIcon
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  )
}
