import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPhatCuaToi } from '../../services/phat-api'
import {
  listYeuCauCuaToi,
  taoYeuCauThanhToan,
} from '../../services/yeu-cau-thanh-toan-api'
import type { Phat } from '../../types/phat'
import { HINH_THUC_THANH_TOAN_OPTIONS, type YeuCauThanhToanPhat } from '../../types/yeu-cau-thanh-toan'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

function trangThaiPhatColor(trangThai: string) {
  if (trangThai === 'Chưa trả') return 'orange'
  if (trangThai === 'Đã trả') return 'green'
  if (trangThai === 'Miễn') return 'blue'
  return 'default'
}

function trangThaiYeuCauColor(t: string) {
  if (t === 'Chờ duyệt') return 'processing'
  if (t === 'Đã duyệt') return 'success'
  if (t === 'Từ chối') return 'error'
  return 'default'
}

export function ReaderPage() {
  const { message } = AntApp.useApp()
  const [phat, setPhat] = useState<Phat[]>([])
  const [yeuCau, setYeuCau] = useState<YeuCauThanhToanPhat[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPhat, setSelectedPhat] = useState<Phat | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm<{ hinhThuc: string; ghiChu?: string }>()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, y] = await Promise.all([getPhatCuaToi(), listYeuCauCuaToi()])
      setPhat(p)
      setYeuCau(y)
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    void load()
  }, [load])

  const choDuyetTheoMaPhat = useMemo(() => {
    const s = new Set<string>()
    for (const y of yeuCau) {
      if (y.trangThai === 'Chờ duyệt') s.add(y.maPhat)
    }
    return s
  }, [yeuCau])

  const openGuiYeuCau = (row: Phat) => {
    setSelectedPhat(row)
    form.setFieldsValue({ hinhThuc: HINH_THUC_THANH_TOAN_OPTIONS[0], ghiChu: '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedPhat(null)
    form.resetFields()
  }

  const submitYeuCau = async () => {
    if (!selectedPhat) return
    try {
      const v = await form.validateFields()
      setSubmitting(true)
      await taoYeuCauThanhToan({
        maPhat: selectedPhat.maPhat,
        hinhThuc: v.hinhThuc,
        ghiChu: v.ghiChu?.trim() || undefined,
      })
      message.success('Đã gửi yêu cầu thanh toán. Vui lòng chờ thủ thư/quản trị duyệt.')
      closeModal()
      await load()
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
      const msg = e instanceof Error ? e.message : 'Gửi yêu cầu thất bại'
      message.error(msg)
      throw e instanceof Error ? e : new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const colsPhat = useMemo(
    () => [
      { title: 'Mã phạt', dataIndex: 'maPhat', key: 'maPhat', width: 130 },
      { title: 'Mã phiếu mượn', dataIndex: 'maPhieuMuon', key: 'maPhieuMuon', width: 130 },
      {
        title: 'Số tiền',
        dataIndex: 'soTien',
        key: 'soTien',
        width: 130,
        render: (v: number) => money.format(v),
      },
      { title: 'Lý do', dataIndex: 'lyDo', key: 'lyDo', ellipsis: true },
      {
        title: 'Ngày tính',
        dataIndex: 'ngayTinh',
        key: 'ngayTinh',
        width: 160,
        render: (v: string) => {
          const d = dayjs(v)
          return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : v
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 120,
        render: (t: string) => <Tag color={trangThaiPhatColor(t)}>{t}</Tag>,
      },
      {
        title: '',
        key: 'act',
        width: 200,
        render: (_: unknown, row: Phat) => {
          const canSend = row.trangThai === 'Chưa trả' && !choDuyetTheoMaPhat.has(row.maPhat)
          return (
            <Button type="primary" size="small" disabled={!canSend} onClick={() => openGuiYeuCau(row)}>
              Xác nhận thanh toán
            </Button>
          )
        },
      },
    ],
    [choDuyetTheoMaPhat],
  )

  const colsYeuCau = useMemo(
    () => [
      { title: 'Mã yêu cầu', dataIndex: 'maYeuCau', key: 'maYeuCau', width: 200 },
      { title: 'Mã phạt', dataIndex: 'maPhat', key: 'maPhat', width: 120 },
      {
        title: 'Số tiền',
        dataIndex: 'soTien',
        key: 'soTien',
        width: 130,
        render: (v: number) => money.format(v),
      },
      { title: 'Hình thức', dataIndex: 'hinhThuc', key: 'hinhThuc', width: 110 },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 120,
        render: (t: string) => <Tag color={trangThaiYeuCauColor(t)}>{t}</Tag>,
      },
      {
        title: 'Mã thanh toán',
        dataIndex: 'maThanhToan',
        key: 'maThanhToan',
        width: 200,
        render: (v: string | null, r: YeuCauThanhToanPhat) =>
          r.trangThai === 'Đã duyệt' && v ? (
            <Typography.Text copyable strong>
              {v}
            </Typography.Text>
          ) : (
            '—'
          ),
      },
      {
        title: 'Ngày gửi',
        dataIndex: 'ngayTao',
        key: 'ngayTao',
        width: 160,
        render: (v: string) => {
          const d = dayjs(v)
          return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : v
        },
      },
    ],
    [],
  )

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Không gian bạn đọc
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Xem khoản phạt của bạn, gửi yêu cầu thanh toán. Sau khi thủ thư/quản trị duyệt, bạn sẽ nhận{' '}
        <strong>mã thanh toán</strong> và khoản phạt sẽ được xóa khỏi hệ thống.
      </Typography.Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Phạt của tôi" extra={<Button onClick={() => void load()}>Tải lại</Button>}>
          <Table<Phat>
            rowKey="maPhat"
            loading={loading}
            dataSource={phat}
            columns={colsPhat}
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: 'Bạn không có khoản phạt nào.' }}
            scroll={{ x: 960 }}
          />
        </Card>

        <Card title="Yêu cầu thanh toán của tôi">
          <Table<YeuCauThanhToanPhat>
            rowKey="maYeuCau"
            loading={loading}
            dataSource={yeuCau}
            columns={colsYeuCau}
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: 'Chưa có yêu cầu thanh toán.' }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </Space>

      <Modal
        title="Xác nhận gửi yêu cầu thanh toán"
        open={modalOpen}
        onCancel={closeModal}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
        confirmLoading={submitting}
        destroyOnHidden={false}
        onOk={() => submitYeuCau()}
      >
        {selectedPhat ? (
          <>
            <Typography.Paragraph>
              Mã phạt: <strong>{selectedPhat.maPhat}</strong> — Số tiền:{' '}
              <strong>{money.format(selectedPhat.soTien)}</strong>
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ fontSize: 13 }}>
              Yêu cầu sẽ ở trạng thái &quot;Chờ duyệt&quot; cho đến khi thủ thư/quản trị xác nhận.
            </Typography.Paragraph>
            <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
              <Form.Item
                name="hinhThuc"
                label="Hình thức thanh toán"
                rules={[{ required: true, message: 'Chọn hình thức' }]}
              >
                <Select
                  options={HINH_THUC_THANH_TOAN_OPTIONS.map((x) => ({ value: x, label: x }))}
                />
              </Form.Item>
              <Form.Item name="ghiChu" label="Ghi chú (tuỳ chọn)">
                <Input.TextArea rows={3} maxLength={255} showCount placeholder="Ví dụ: đã chuyển khoản..." />
              </Form.Item>
            </Form>
          </>
        ) : null}
      </Modal>
    </div>
  )
}
