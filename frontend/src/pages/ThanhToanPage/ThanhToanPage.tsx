import { App as AntApp, Button, Card, Space, Table, Tabs, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllThanhToan } from '../../services/thanh-toan-api'
import { duyetYeuCauThanhToan, listYeuCauChoDuyet } from '../../services/yeu-cau-thanh-toan-api'
import type { ThanhToan } from '../../types/thanh-toan'
import type { YeuCauThanhToanPhat } from '../../types/yeu-cau-thanh-toan'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

export function ThanhToanPage() {
  const { message, modal } = AntApp.useApp()
  const [choDuyet, setChoDuyet] = useState<YeuCauThanhToanPhat[]>([])
  const [lichSu, setLichSu] = useState<ThanhToan[]>([])
  const [loadingCho, setLoadingCho] = useState(false)
  const [loadingLs, setLoadingLs] = useState(false)
  const [duyetKey, setDuyetKey] = useState<string | null>(null)

  const loadChoDuyet = useCallback(async () => {
    setLoadingCho(true)
    try {
      setChoDuyet(await listYeuCauChoDuyet())
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Không tải được danh sách chờ duyệt')
    } finally {
      setLoadingCho(false)
    }
  }, [message])

  const loadLichSu = useCallback(async () => {
    setLoadingLs(true)
    try {
      setLichSu(await getAllThanhToan())
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Không tải được lịch sử thanh toán')
    } finally {
      setLoadingLs(false)
    }
  }, [message])

  useEffect(() => {
    void loadChoDuyet()
    void loadLichSu()
  }, [loadChoDuyet, loadLichSu])

  const onDuyet = useCallback(
    (row: YeuCauThanhToanPhat) => {
      modal.confirm({
      title: 'Duyệt thanh toán phạt?',
      content: (
        <div>
          <Typography.Paragraph style={{ marginBottom: 8 }}>
            Mã yêu cầu: <strong>{row.maYeuCau}</strong>
            <br />
            Mã phạt: <strong>{row.maPhat}</strong> — Bạn đọc: <strong>{row.maBanDoc}</strong>
            <br />
            Số tiền: <strong>{money.format(row.soTien)}</strong> — Hình thức:{' '}
            <strong>{row.hinhThuc}</strong>
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            Sau khi duyệt: ghi bản ghi thanh toán, cấp mã thanh toán cho bạn đọc và xóa khoản phạt
            tương ứng.
          </Typography.Text>
        </div>
      ),
      okText: 'Duyệt thanh toán',
      cancelText: 'Hủy',
      onOk: async () => {
        setDuyetKey(row.maYeuCau)
        try {
          const res = await duyetYeuCauThanhToan(row.maYeuCau)
          message.success(`Đã duyệt. Mã thanh toán: ${res.maThanhToan}`)
          await loadChoDuyet()
          await loadLichSu()
        } catch (e) {
          message.error(e instanceof Error ? e.message : 'Duyệt thất bại')
          throw e
        } finally {
          setDuyetKey(null)
        }
      },
    })
    },
    [loadChoDuyet, loadLichSu, message, modal],
  )

  const colsCho = useMemo(
    () => [
      { title: 'Mã yêu cầu', dataIndex: 'maYeuCau', key: 'maYeuCau', width: 200 },
      { title: 'Mã phạt', dataIndex: 'maPhat', key: 'maPhat', width: 120 },
      { title: 'Mã bạn đọc', dataIndex: 'maBanDoc', key: 'maBanDoc', width: 120 },
      {
        title: 'Số tiền',
        dataIndex: 'soTien',
        key: 'soTien',
        width: 140,
        render: (v: number) => money.format(v),
      },
      { title: 'Hình thức', dataIndex: 'hinhThuc', key: 'hinhThuc', width: 120 },
      {
        title: 'Ghi chú',
        dataIndex: 'ghiChu',
        key: 'ghiChu',
        ellipsis: true,
        render: (v: string | null) => v || '—',
      },
      {
        title: 'Ngày gửi',
        dataIndex: 'ngayTao',
        key: 'ngayTao',
        width: 170,
        render: (v: string) => {
          const d = dayjs(v)
          return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : v
        },
      },
      {
        title: '',
        key: 'act',
        width: 140,
        render: (_: unknown, r: YeuCauThanhToanPhat) => (
          <Button
            type="primary"
            size="small"
            loading={duyetKey === r.maYeuCau}
            onClick={() => onDuyet(r)}
          >
            Duyệt thanh toán
          </Button>
        ),
      },
    ],
    [duyetKey, onDuyet],
  )

  const colsLs = useMemo(
    () => [
      { title: 'Mã thanh toán', dataIndex: 'maThanhToan', key: 'maThanhToan', width: 200 },
      { title: 'Mã bạn đọc', dataIndex: 'maBanDoc', key: 'maBanDoc', width: 120 },
      {
        title: 'Ngày thanh toán',
        dataIndex: 'ngayThanhToan',
        key: 'ngayThanhToan',
        width: 170,
        render: (v: string) => {
          const d = dayjs(v)
          return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : v
        },
      },
      {
        title: 'Số tiền',
        dataIndex: 'soTien',
        key: 'soTien',
        width: 140,
        render: (v: number) => money.format(v),
      },
      { title: 'Hình thức', dataIndex: 'hinhThuc', key: 'hinhThuc', width: 120 },
      {
        title: 'Ghi chú',
        dataIndex: 'ghiChu',
        key: 'ghiChu',
        ellipsis: true,
        render: (v: string | null) => v || '—',
      },
    ],
    [],
  )

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Quản lý thanh toán
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Duyệt yêu cầu thanh toán phạt do bạn đọc gửi; hệ thống sẽ tạo mã thanh toán và xóa phạt. Xem
        thêm lịch sử giao dịch trong tab Lịch sử.
      </Typography.Paragraph>

      <Card>
        <Tabs
          items={[
            {
              key: 'cho',
              label: (
                <Space>
                  Chờ duyệt
                  {choDuyet.length > 0 ? <Tag color="orange">{choDuyet.length}</Tag> : null}
                </Space>
              ),
              children: (
                <Table<YeuCauThanhToanPhat>
                  rowKey="maYeuCau"
                  loading={loadingCho}
                  dataSource={choDuyet}
                  columns={colsCho}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1100 }}
                />
              ),
            },
            {
              key: 'lichsu',
              label: 'Lịch sử thanh toán',
              children: (
                <Table<ThanhToan>
                  rowKey={(r) => r.maThanhToan ?? `${r.maBanDoc}-${r.ngayThanhToan}`}
                  loading={loadingLs}
                  dataSource={lichSu}
                  columns={colsLs}
                  pagination={{ pageSize: 15 }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
