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
  Image,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { CreateSachPayload, Sach, UpdateSachPayload } from '../../types/sach'
import {
  createSach,
  deleteSach,
  getAllSach,
  updateSach,
} from '../../services/sach-api'
import { getAllTheLoai } from '../../services/the-loai-api'

type FormValues = {
  tieuDe: string
  tacGia: string
  namXuatBan?: number
  maTheLoai?: string
  ngonNgu?: string
  tomTat?: string
  anhBiaUrl?: string
}

type TheLoaiOption = {
  maTheLoai: string
  tenTheLoai: string
}

export function BooksPage() {
  const { message: antMessage } = AntApp.useApp()
  const [rows, setRows] = useState<Sach[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Sach | null>(null)
  const [theLoaiOptions, setTheLoaiOptions] = useState<TheLoaiOption[]>([])
  const [form] = Form.useForm<FormValues>()
  const anhBiaUrl = Form.useWatch('anhBiaUrl', form)

  const mode = editing ? 'edit' : 'create'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllSach()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách sách'
      antMessage.error(text)
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
      {
        title: 'STT',
        key: 'stt',
        width: 70,
        align: 'center' as const,
        render: (_: unknown, __: unknown, index: number) => index + 1,
      },
      {
        title: 'Ảnh bìa',
        key: 'anhBia',
        width: 120,
        render: (_: unknown, record: Sach) => {
          const imageUrl = record.anhBiaUrl
          if (imageUrl) {
            return (
              <Image
                src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5001${imageUrl}`}
                alt={record.tieuDe}
                width={80}
                height={110}
                style={{ objectFit: 'cover', background: '#f5f5f5' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6C3YG3R5cIjOOQmmIhkhJSUZ3VqLOtpCJ+wg7PT9J3XX6cAYHkEbXY4wuHF0QBx7TkVgC9APIFqR1nIIugbqGxYERQ1EMBEAg0xAUFkS1Cp6ZmHkzEAhjFFfLB2RZ1sH0I7jGqgR0GziTdNvod1Fg2GzBxWkF0PiJMgiiLhM3tSICn6tOLf6Vp2dNndD4G7MxdGghcRYDkGkA5XnDfRfvguyDRvLpDBKkZvg3gBqZF4nsj2G+0R4Uq7aRSjGR9zJ4F/mMc3kM8YcYwlE3K4HpGjY4VlH6a4I7z1WkZ9WkH8NkD6BRg6sD6Lq5p7HxQY7pR1l4Ea7J3xWg6aXqKxVpBVVwG8LzGj1v7G/39P/58R4GehM0GkXR8T6V0LqLcXxV2vCwAAAABJRU5ErkJggg=="
              />
            )
          }
          return <span style={{ color: '#999' }}>—</span>
        },
      },
      {
        title: 'Mã sách',
        dataIndex: 'maSach',
        key: 'maSach',
        width: 120,
      },
      {
        title: 'Tiêu đề',
        dataIndex: 'tieuDe',
        key: 'tieuDe',
      },
      {
        title: 'Tác giả',
        dataIndex: 'tacGia',
        key: 'tacGia',
        width: 180,
      },
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
                  anhBiaUrl: record.anhBiaUrl ?? undefined,
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
                  antMessage.success('Đã xóa sách')
                  await fetchData()
                } catch (e) {
                  const text = e instanceof Error ? e.message : 'Xóa thất bại'
                  antMessage.error(text)
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
          anhBiaUrl: values.anhBiaUrl?.trim() || null,
        }
        await createSach(payload)
        antMessage.success('Thêm sách thành công')
      } else if (editing) {
        const payload: UpdateSachPayload = {
          tieuDe: values.tieuDe,
          tacGia: values.tacGia,
          namXuatBan: values.namXuatBan ?? null,
          maTheLoai: values.maTheLoai?.trim() || null,
          ngonNgu: values.ngonNgu?.trim() || null,
          tomTat: values.tomTat?.trim() || null,
          anhBiaUrl: values.anhBiaUrl?.trim() || null,
        }
        await updateSach(editing.maSach, payload)
        antMessage.success('Cập nhật sách thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) {
        antMessage.error(e.message)
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
          <Form.Item label="URL ảnh bìa" name="anhBiaUrl">
            <Input placeholder="Dán link ảnh từ Google, VD: https://..." />
          </Form.Item>
          {anhBiaUrl && (
            <div style={{ marginTop: 8 }}>
              <img
                src={anhBiaUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </Form>
      </Modal>
    </Card>
  )
}

