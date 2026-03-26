import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { CreateSachPayload, Sach, UpdateSachPayload } from '../../types/sach'
import { createSach, deleteSach, getAllSach, updateSach } from '../../services/sach-api'
import { getAllTheLoai } from '../../services/the-loai-api'

type FormValues = {
  tieuDe: string
  tacGia: string
  namXuatBan?: number
  maTheLoai?: string
  ngonNgu?: string
  tomTat?: string
}

type TheLoaiOption = {
  maTheLoai: string
  tenTheLoai: string
}

export function BooksPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<Sach[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Sach | null>(null)
  const [theLoaiOptions, setTheLoaiOptions] = useState<TheLoaiOption[]>([])
  const [form] = Form.useForm<FormValues>()

  const mode = editing ? 'edit' : 'create'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllSach()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách sách'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
    void (async () => {
      try {
        const res = await getAllTheLoai()
        setTheLoaiOptions(res.data ?? [])
      } catch {
        // Ignore: user can still type maTheLoai manually.
      }
    })()
  }, [])

  const columns = useMemo(
    () => [
      { title: 'Mã sách', dataIndex: 'maSach', key: 'maSach', width: 120 },
      { title: 'Tiêu đề', dataIndex: 'tieuDe', key: 'tieuDe' },
      { title: 'Tác giả', dataIndex: 'tacGia', key: 'tacGia', width: 180 },
      {
        title: 'Năm XB',
        dataIndex: 'namXuatBan',
        key: 'namXuatBan',
        width: 100,
        render: (value: number | null | undefined) => value ?? '-',
      },
      {
        title: 'Mã thể loại',
        dataIndex: 'maTheLoai',
        key: 'maTheLoai',
        width: 130,
        render: (value: string | null | undefined) =>
          value ? <Tag color="geekblue">{value}</Tag> : '-',
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 210,
        render: (_: unknown, record: Sach) => (
          <Space>
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  tieuDe: record.tieuDe,
                  tacGia: record.tacGia,
                  namXuatBan: record.namXuatBan ?? undefined,
                  maTheLoai: record.maTheLoai ?? undefined,
                  ngonNgu: record.ngonNgu ?? undefined,
                  tomTat: record.tomTat ?? undefined,
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa sách"
              description={`Bạn chắc chắn muốn xóa "${record.tieuDe}"?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteSach(record.maSach)
                  message.success('Đã xóa sách')
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
    [form],
  )

  const onCreateClick = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      if (mode === 'create') {
        const payload: CreateSachPayload = {
          tieuDe: values.tieuDe,
          tacGia: values.tacGia,
          namXuatBan: values.namXuatBan ?? null,
          maTheLoai: values.maTheLoai?.trim() || null,
          ngonNgu: values.ngonNgu?.trim() || null,
          tomTat: values.tomTat?.trim() || null,
        }
        await createSach(payload)
        message.success('Thêm sách thành công')
      } else if (editing) {
        const payload: UpdateSachPayload = {
          tieuDe: values.tieuDe,
          tacGia: values.tacGia,
          namXuatBan: values.namXuatBan ?? null,
          maTheLoai: values.maTheLoai?.trim() || null,
          ngonNgu: values.ngonNgu?.trim() || null,
          tomTat: values.tomTat?.trim() || null,
        }
        await updateSach(editing.maSach, payload)
        message.success('Cập nhật sách thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
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
            Quản lý Sách
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý danh mục sách: thêm, sửa, xóa và tìm kiếm theo bảng.
          </Typography.Text>
        </div>
        <Button type="primary" onClick={onCreateClick}>
          Thêm sách
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maSach}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={open}
        title={mode === 'create' ? 'Thêm sách' : 'Cập nhật sách'}
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
            label="Tiêu đề"
            name="tieuDe"
            rules={[{ required: true, message: 'Nhập tiêu đề sách' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tác giả"
            name="tacGia"
            rules={[{ required: true, message: 'Nhập tác giả' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Năm xuất bản" name="namXuatBan">
            <InputNumber style={{ width: '100%' }} min={0} max={3000} />
          </Form.Item>
          <Form.Item label="Mã thể loại" name="maTheLoai">
            <Input
              list="the-loai-options"
              placeholder="Chọn hoặc nhập mã thể loại (VD: TL001)"
            />
          </Form.Item>
          <datalist id="the-loai-options">
            {theLoaiOptions.map((item) => (
              <option key={item.maTheLoai} value={item.maTheLoai}>
                {item.tenTheLoai}
              </option>
            ))}
          </datalist>
          <Form.Item label="Ngôn ngữ" name="ngonNgu">
            <Input placeholder="VD: vi" />
          </Form.Item>
          <Form.Item label="Tóm tắt" name="tomTat">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

