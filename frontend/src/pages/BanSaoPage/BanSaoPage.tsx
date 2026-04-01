import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { BanSao, CreateBanSaoPayload, UpdateBanSaoPayload } from '../../types/ban-sao'
import {
  createBanSao,
  deleteBanSao,
  getAllBanSao,
  updateBanSao,
} from '../../services/ban-sao-api'
import { getAllKeSach } from '../../services/ke-sach-api'
import { getAllSach } from '../../services/sach-api'
import type { Sach } from '../../types/sach'
import type { KeSach } from '../../types/ke-sach'

const TRANG_THAI_OPTIONS = [
  { label: 'Có sẵn', value: 'Có sẵn' },
  { label: 'Đang mượn', value: 'Đang mượn' },
  { label: 'Hư hỏng', value: 'Hư hỏng' },
] as const

type FormValues = {
  maVach: string
  maSach: string
  maKe: string
  trangThai: (typeof TRANG_THAI_OPTIONS)[number]['value']
}

const statusColor: Record<string, string> = {
  'Có sẵn': 'green',
  'Đang mượn': 'geekblue',
  'Hư hỏng': 'volcano',
}

export function BanSaoPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<BanSao[]>([])
  const [sachList, setSachList] = useState<Sach[]>([])
  const [keList, setKeList] = useState<KeSach[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<BanSao | null>(null)
  const [form] = Form.useForm<FormValues>()

  const mode = editing ? 'edit' : 'create'

  const sachByMa = useMemo(() => {
    const m = new Map<string, Sach>()
    for (const s of sachList) m.set(s.maSach, s)
    return m
  }, [sachList])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllBanSao()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách bản sao'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
    void (async () => {
      try {
        const [sRes, kRes] = await Promise.all([getAllSach(), getAllKeSach()])
        setSachList(sRes.data ?? [])
        setKeList(kRes.data ?? [])
      } catch {
        // Vẫn cho phép nhập tay mã nếu API kệ/sách lỗi
      }
    })()
  }, [])

  const columns = useMemo(
    () => [
      { title: 'Mã bản sao', dataIndex: 'maBanSao', key: 'maBanSao', width: 120 },
      { title: 'Mã vạch', dataIndex: 'maVach', key: 'maVach', width: 140 },
      { title: 'Mã sách', dataIndex: 'maSach', key: 'maSach', width: 110 },
      {
        title: 'Tiêu đề',
        key: 'tieuDe',
        width: 200,
        ellipsis: true,
        render: (_: unknown, record: BanSao) => sachByMa.get(record.maSach)?.tieuDe ?? '—',
      },
      {
        title: 'Kệ',
        dataIndex: 'maKe',
        key: 'maKe',
        width: 110,
        render: (v: string | null | undefined) => v ?? '—',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 120,
        render: (value: string | null | undefined) =>
          value ? <Tag color={statusColor[value] ?? 'default'}>{value}</Tag> : '—',
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 210,
        fixed: 'right' as const,
        render: (_: unknown, record: BanSao) => (
          <Space>
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  maVach: record.maVach,
                  maSach: record.maSach,
                  maKe: record.maKe ?? '',
                  trangThai:
                    TRANG_THAI_OPTIONS.some((o) => o.value === record.trangThai) && record.trangThai
                      ? (record.trangThai as FormValues['trangThai'])
                      : 'Có sẵn',
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa bản sao"
              description={`Bạn chắc chắn muốn xóa bản sao "${record.maBanSao}"?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteBanSao(record.maBanSao)
                  message.success('Đã xóa bản sao')
                  await fetchData()
                } catch (e) {
                  const text = e instanceof Error ? e.message : 'Xóa thất bại'
                  message.error(text)
                }
              }}
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [form, sachByMa],
  )

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      trangThai: 'Có sẵn',
    })
    setOpen(true)
  }

  const buildPayload = (values: FormValues): CreateBanSaoPayload | UpdateBanSaoPayload => ({
    maVach: values.maVach.trim(),
    maSach: values.maSach.trim(),
    maKe: values.maKe.trim() || null,
    soLuong: 0,
    trangThai: values.trangThai,
  })

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      const payload = buildPayload(values)

      if (mode === 'create') {
        await createBanSao(payload as CreateBanSaoPayload)
        message.success('Thêm bản sao thành công')
      } else if (editing) {
        await updateBanSao(editing.maBanSao, payload as UpdateBanSaoPayload)
        message.success('Cập nhật bản sao thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
        if (e.message.includes('Không tìm thấy bản sao')) {
          setOpen(false)
          setEditing(null)
          form.resetFields()
          await fetchData()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 14,
          display: 'flex',
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý Bản sao
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý từng cuốn bản sao (mã vạch, sách, kệ, trạng thái).
          </Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Thêm bản sao
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maBanSao}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản sao`,
        }}
        scroll={{ x: 1100 }}
      />

      <Modal
        open={open}
        title={mode === 'create' ? 'Thêm bản sao' : 'Cập nhật bản sao'}
        okText={mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Hủy"
        onCancel={() => {
          setOpen(false)
          setEditing(null)
          form.resetFields()
        }}
        onOk={onSubmit}
        confirmLoading={saving}
        destroyOnHidden
        forceRender
      >
        <Form layout="vertical" requiredMark={false} form={form}>
          <Form.Item
            label="Mã vạch"
            name="maVach"
            rules={[{ required: true, message: 'Nhập mã vạch' }]}
          >
            <Input placeholder="Mã vạch duy nhất cho bản sao" />
          </Form.Item>
          <Form.Item
            label="Mã sách"
            name="maSach"
            rules={[{ required: true, message: 'Chọn hoặc nhập mã sách' }]}
          >
            <Input list="ban-sao-sach-options" placeholder="VD: S001" />
          </Form.Item>
          <datalist id="ban-sao-sach-options">
            {sachList.map((s) => (
              <option key={s.maSach} value={s.maSach}>
                {s.tieuDe}
              </option>
            ))}
          </datalist>
          <Form.Item
            label="Mã kệ"
            name="maKe"
            rules={[{ required: true, message: 'Chọn hoặc nhập mã kệ' }]}
          >
            <Input list="ban-sao-ke-options" placeholder="VD: K001" />
          </Form.Item>
          <datalist id="ban-sao-ke-options">
            {keList.map((k) => (
              <option key={k.maKe} value={k.maKe}>
                {k.viTri}
              </option>
            ))}
          </datalist>
          <Form.Item
            label="Trạng thái"
            name="trangThai"
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select options={[...TRANG_THAI_OPTIONS]} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
