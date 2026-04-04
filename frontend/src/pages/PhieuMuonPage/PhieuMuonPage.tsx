import {
  App as AntApp,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link, useLocation } from 'react-router-dom'
import type { BanDoc } from '../../types/ban-doc'
import type { PhieuMuon } from '../../types/phieu-muon'
import { getAllBanDoc } from '../../services/ban-doc-api'
import {
  createPhieuMuon,
  deletePhieuMuon,
  getAllPhieuMuon,
  traSachVaTinhPhat,
  updatePhieuMuon,
} from '../../services/phieu-muon-api'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

const TRANG_THAI_OPTIONS = [
  { label: 'Đang mở', value: 'Đang mở' },
  { label: 'Đã đóng', value: 'Đã đóng' },
] as const

type FormValues = {
  maBanSao: string
  maBanDoc: string
  ngayMuon: dayjs.Dayjs
  hanTra: dayjs.Dayjs
  ngayTraThucTe?: dayjs.Dayjs | null
  soLanGiaHan: number
  trangThai: (typeof TRANG_THAI_OPTIONS)[number]['value']
}

const trangThaiColor: Record<string, string> = {
  'Đang mở': 'processing',
  'Đã đóng': 'success',
}

function roleBasePath(pathname: string) {
  return pathname.startsWith('/admin') ? '/admin' : '/thu-thu'
}

function toDatePayload(d: dayjs.Dayjs) {
  return d.format('YYYY-MM-DD')
}

function isAntdFormValidateError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'errorFields' in err &&
    Array.isArray((err as { errorFields: unknown }).errorFields)
  )
}

function normalizeTrangThai(v: string): FormValues['trangThai'] {
  const t = v.trim()
  if (t === 'Đã đóng') return 'Đã đóng'
  return 'Đang mở'
}

export function PhieuMuonPage() {
  const { message, notification } = AntApp.useApp()
  const location = useLocation()
  const base = roleBasePath(location.pathname)

  const [rows, setRows] = useState<PhieuMuon[]>([])
  const [banDocList, setBanDocList] = useState<BanDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<PhieuMuon | null>(null)
  const [form] = Form.useForm<FormValues>()

  const [returnOpen, setReturnOpen] = useState(false)
  const [returning, setReturning] = useState<PhieuMuon | null>(null)
  const [returnForm] = Form.useForm<{ ngayTraThucTe: dayjs.Dayjs }>()
  const [returnSubmitting, setReturnSubmitting] = useState(false)

  const mode = editing ? 'edit' : 'create'

  const banDocSelectOptions = useMemo(() => {
    const opts = banDocList.map((b) => ({
      value: b.maBanDoc,
      label: `${b.maBanDoc} — ${b.hoTen}`,
    }))
    if (open && editing && !opts.some((o) => o.value === editing.maBanDoc)) {
      opts.unshift({
        value: editing.maBanDoc,
        label: `${editing.maBanDoc}`,
      })
    }
    return opts
  }, [banDocList, open, editing])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllPhieuMuon()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách phiếu mượn'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    void fetchData()
    void (async () => {
      try {
        const bd = await getAllBanDoc()
        setBanDocList(bd.data ?? [])
      } catch {
        // Cho phép nhập tay mã nếu API lỗi
      }
    })()
  }, [fetchData])

  const columns = useMemo(
    () => [
      { title: 'Mã phiếu', dataIndex: 'maPhieuMuon', key: 'maPhieuMuon', width: 120 },
      { title: 'Bản sao', dataIndex: 'maBanSao', key: 'maBanSao', width: 110 },
      { title: 'Bạn đọc', dataIndex: 'maBanDoc', key: 'maBanDoc', width: 100 },
      {
        title: 'Ngày mượn',
        dataIndex: 'ngayMuon',
        key: 'ngayMuon',
        width: 120,
        render: (v: string) => (dayjs(v).isValid() ? dayjs(v).format('DD/MM/YYYY') : v),
      },
      {
        title: 'Hạn trả',
        dataIndex: 'hanTra',
        key: 'hanTra',
        width: 120,
        render: (v: string) => (dayjs(v).isValid() ? dayjs(v).format('DD/MM/YYYY') : v),
      },
      {
        title: 'Ngày trả',
        dataIndex: 'ngayTraThucTe',
        key: 'ngayTraThucTe',
        width: 120,
        render: (v: string | null) =>
          v && dayjs(v).isValid() ? dayjs(v).format('DD/MM/YYYY') : '—',
      },
      { title: 'Gia hạn', dataIndex: 'soLanGiaHan', key: 'soLanGiaHan', width: 90 },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 110,
        render: (v: string) => <Tag color={trangThaiColor[v] ?? 'default'}>{v}</Tag>,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 280,
        fixed: 'right' as const,
        render: (_: unknown, record: PhieuMuon) => (
          <Space wrap>
            <Button
              size="small"
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  maBanSao: record.maBanSao,
                  maBanDoc: record.maBanDoc,
                  ngayMuon: dayjs(record.ngayMuon),
                  hanTra: dayjs(record.hanTra),
                  ngayTraThucTe: record.ngayTraThucTe ? dayjs(record.ngayTraThucTe) : null,
                  soLanGiaHan: record.soLanGiaHan,
                  trangThai: normalizeTrangThai(record.trangThai),
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            {normalizeTrangThai(record.trangThai) === 'Đang mở' && (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setReturning(record)
                  returnForm.setFieldsValue({
                    ngayTraThucTe: dayjs(),
                  })
                  setReturnOpen(true)
                }}
              >
                Trả sách
              </Button>
            )}
            <Popconfirm
              title="Xóa phiếu mượn"
              description={`Xóa phiếu ${record.maPhieuMuon}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deletePhieuMuon(record.maPhieuMuon)
                  message.success('Đã xóa')
                  void fetchData()
                } catch (err) {
                  message.error(err instanceof Error ? err.message : 'Không xóa được')
                }
              }}
            >
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [fetchData, form, message],
  )

  const submitForm = async () => {
    try {
      const v = await form.validateFields()
      setSaving(true)
      if (mode === 'create') {
        await createPhieuMuon({
          maPhieuMuon: '',
          maBanSao: (v.maBanSao ?? '').trim(),
          maBanDoc: v.maBanDoc,
          ngayMuon: toDatePayload(v.ngayMuon),
          hanTra: toDatePayload(v.hanTra),
          ngayTraThucTe: v.ngayTraThucTe ? toDatePayload(v.ngayTraThucTe) : null,
          soLanGiaHan: 0,
          trangThai: 'Đang mở',
        })
        message.success('Tạo phiếu mượn thành công')
      } else if (editing) {
        await updatePhieuMuon(editing.maPhieuMuon, {
          maBanSao: (v.maBanSao ?? '').trim(),
          maBanDoc: v.maBanDoc,
          ngayMuon: toDatePayload(v.ngayMuon),
          hanTra: toDatePayload(v.hanTra),
          ngayTraThucTe: v.ngayTraThucTe ? toDatePayload(v.ngayTraThucTe) : null,
          soLanGiaHan: v.soLanGiaHan,
          trangThai: v.trangThai,
        })
        message.success('Cập nhật thành công')
      }
      setOpen(false)
      setEditing(null)
      form.resetFields()
      void fetchData()
    } catch (err) {
      if (isAntdFormValidateError(err)) {
        throw err
      }
      const text = err instanceof Error ? err.message : 'Không lưu được phiếu mượn'
      message.error(text)
      throw err instanceof Error ? err : new Error(text)
    } finally {
      setSaving(false)
    }
  }

  const submitReturn = async () => {
    if (!returning) {
      message.error('Không có phiếu để trả')
      throw new Error('Không có phiếu để trả')
    }
    try {
      const v = await returnForm.validateFields()
      setReturnSubmitting(true)
      const res = await traSachVaTinhPhat({
        maPhieuMuon: returning.maPhieuMuon,
        ngayTraThucTe: v.ngayTraThucTe.toISOString(),
      })
      const r = res.data
      setReturnOpen(false)
      setReturning(null)
      returnForm.resetFields()
      void fetchData()

      if (r.maPhat) {
        notification.warning({
          message: 'Đã phát sinh phạt trễ hạn',
          description: (
            <Space orientation="vertical" size={4}>
              <Typography.Text>
                Số ngày trễ: <strong>{r.soNgayTre}</strong> — Số tiền:{' '}
                <strong>{money.format(r.tienPhat)}</strong>
              </Typography.Text>
              <Typography.Text>
                Mã phạt: <Typography.Text code>{r.maPhat}</Typography.Text>. Trạng thái thanh toán ban đầu:{' '}
                <strong>Chưa thanh toán</strong> — xem và xử lý tại{' '}
                <Link to={`${base}/phat`}>Quản lý phạt</Link>.
              </Typography.Text>
            </Space>
          ),
          duration: 10,
          placement: 'topRight',
        })
      } else {
        message.success('Trả sách thành công. Không phát sinh phạt.')
      }

      Modal.info({
        title: 'Đã xử lý trả sách',
        content: (
          <Space orientation="vertical" style={{ width: '100%' }}>
            <Typography.Text>
              Số ngày trễ: <strong>{r.soNgayTre}</strong>
            </Typography.Text>
            <Typography.Text>
              Tiền phạt: <strong>{money.format(r.tienPhat)}</strong>
            </Typography.Text>
            {r.maPhat ? (
              <Typography.Text>
                Mã phạt: <Typography.Text code>{r.maPhat}</Typography.Text> — đã có thông báo góc màn hình; chi tiết tại{' '}
                <Link to={`${base}/phat`}>Quản lý phạt</Link> (cột trạng thái thanh toán).
              </Typography.Text>
            ) : (
              <Typography.Text type="success">Không phát sinh phạt (trả đúng hoặc sớm hạn).</Typography.Text>
            )}
          </Space>
        ),
      })
    } catch (err) {
      if (isAntdFormValidateError(err)) {
        throw err
      }
      const text = err instanceof Error ? err.message : 'Trả sách thất bại'
      message.error(text)
      throw err instanceof Error ? err : new Error(text)
    } finally {
      setReturnSubmitting(false)
    }
  }

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          Quản lý phiếu mượn
        </Typography.Title>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => {
              setEditing(null)
              form.resetFields()
              form.setFieldsValue({
                ngayMuon: dayjs(),
                hanTra: dayjs().add(14, 'day'),
                soLanGiaHan: 0,
                trangThai: 'Đang mở',
              })
              setOpen(true)
            }}
          >
            Thêm phiếu mượn
          </Button>
        </Space>
        <Table<PhieuMuon>
          rowKey="maPhieuMuon"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1100 }}
        />
      </Card>

      <Modal
        title={mode === 'create' ? 'Thêm phiếu mượn' : 'Sửa phiếu mượn'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={() => submitForm()}
        confirmLoading={saving}
        destroyOnHidden={false}
        width={560}
      >
        <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }}>
          {mode === 'create'
            ? 'Mã phiếu do hệ thống tự sinh. Ưu tiên bản sao đang Có sẵn.'
            : 'Cập nhật thông tin phiếu (trạng thái Đã đóng thường do nghiệp vụ trả sách).'}
        </Typography.Paragraph>
        <Form form={form} layout="vertical">
          <Form.Item
            name="maBanSao"
            label="Mã bản sao"
            rules={[{ required: true, message: 'Nhập mã bản sao' }]}
            extra={
              mode === 'create'
                ? 'Ưu tiên bản sao đang Có sẵn (xem Quản lý bản sao).'
                : undefined
            }
          >
            <Input placeholder="Ví dụ: BS001" allowClear autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="maBanDoc"
            label="Mã bạn đọc"
            rules={[{ required: true, message: 'Chọn bạn đọc' }]}
          >
            <Select
              showSearch
              placeholder="Chọn bạn đọc"
              optionFilterProp="label"
              options={banDocSelectOptions}
            />
          </Form.Item>
          <Form.Item
            name="ngayMuon"
            label="Ngày mượn"
            rules={[{ required: true, message: 'Chọn ngày mượn' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="hanTra"
            label="Hạn trả"
            rules={[{ required: true, message: 'Chọn hạn trả' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          {mode === 'edit' && (
            <>
              <Form.Item name="ngayTraThucTe" label="Ngày trả thực tế">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" allowClear />
              </Form.Item>
              <Form.Item
                name="soLanGiaHan"
                label="Số lần gia hạn"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={[...TRANG_THAI_OPTIONS]} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title={returning ? `Trả sách — ${returning.maPhieuMuon}` : 'Trả sách'}
        open={returnOpen}
        onCancel={() => {
          setReturnOpen(false)
          setReturning(null)
          returnForm.resetFields()
        }}
        onOk={() => submitReturn()}
        confirmLoading={returnSubmitting}
        destroyOnHidden={false}
      >
        <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
          Đóng phiếu, cập nhật bản sao và tính phạt nếu ngày trả sau hạn trả.
        </Typography.Paragraph>
        <Form form={returnForm} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            name="ngayTraThucTe"
            label="Ngày trả thực tế"
            rules={[{ required: true, message: 'Chọn ngày trả' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
