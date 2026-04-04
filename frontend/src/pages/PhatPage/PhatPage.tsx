import { App as AntApp, Card, Space, Table, Tag, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { Phat } from '../../types/phat'
import { getAllPhat } from '../../services/phat-api'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

/** Giá trị lưu trong DB (Phat.TrangThai) — nghiệp vụ thanh toán phạt */
const trangThaiColor: Record<string, string> = {
  'Chưa trả': 'orange',
  'Đã trả': 'green',
  Miễn: 'blue',
}

function trangThaiThanhToanLabel(trangThai: string): string {
  switch (trangThai) {
    case 'Chưa trả':
      return 'Chưa thanh toán'
    case 'Đã trả':
      return 'Đã thanh toán'
    case 'Miễn':
      return 'Miễn phạt'
    default:
      return trangThai || '—'
  }
}

export function PhatPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<Phat[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllPhat()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách phạt'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const columns = useMemo(
    () => [
      { title: 'Mã phạt', dataIndex: 'maPhat', key: 'maPhat', width: 160 },
      { title: 'Mã phiếu mượn', dataIndex: 'maPhieuMuon', key: 'maPhieuMuon', width: 140 },
      {
        title: 'Số tiền',
        dataIndex: 'soTien',
        key: 'soTien',
        width: 140,
        render: (v: number) => money.format(v),
      },
      { title: 'Lý do', dataIndex: 'lyDo', key: 'lyDo', width: 120 },
      {
        title: 'Ngày tính',
        dataIndex: 'ngayTinh',
        key: 'ngayTinh',
        width: 180,
        render: (v: string) => {
          const d = dayjs(v)
          return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : v
        },
      },
      {
        title: 'Trạng thái thanh toán',
        dataIndex: 'trangThai',
        key: 'trangThaiThanhToan',
        width: 160,
        render: (v: string) => (
          <Tag color={trangThaiColor[v] ?? 'default'}>{trangThaiThanhToanLabel(v)}</Tag>
        ),
      },
    ],
    [],
  )

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Quản lý phạt
        </Typography.Title>
      </div>

      <Card>
        <Table<Phat>
          rowKey="maPhat"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </Space>
  )
}
