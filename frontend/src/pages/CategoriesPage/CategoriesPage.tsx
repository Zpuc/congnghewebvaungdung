import {
  App as AntApp,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  type TableColumnsType,
} from 'antd'
import { useEffect, useMemo, useState } from 'react'
import {
  createTheLoai,
  deleteTheLoai,
  getAllTheLoaiCrud,
  updateTheLoai,
} from '../../services/the-loai-crud-api'
import type { TheLoaiItem } from '../../types/the-loai-crud'

type FormValues = {
  maTheLoai?: string
  tenTheLoai: string
}

export function CategoriesPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<TheLoaiItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<TheLoaiItem | null>(null)
  const [form] = Form.useForm<FormValues>()

  const mode = editing ? 'edit' : 'create'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllTheLoaiCrud()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách thể loại'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const columns = useMemo<TableColumnsType<TheLoaiItem>>(
    () => [
      { title: 'Mã thể loại', dataIndex: 'maTheLoai', key: 'maTheLoai', width: 180 },
      { title: 'Tên thể loại', dataIndex: 'tenTheLoai', key: 'tenTheLoai' },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 220,
        render: (_: unknown, record) => (
          <Space>
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  maTheLoai: record.maTheLoai,
                  tenTheLoai: record.tenTheLoai,
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa thể loại"
              description={`Bạn chắc chắn muốn xóa "${record.tenTheLoai}"?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteTheLoai(record.maTheLoai)
                  message.success('Đã xóa thể loại')
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

  const onCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      if (mode === 'create') {
        await createTheLoai({
          maTheLoai: values.maTheLoai?.trim() || undefined,
          tenTheLoai: values.tenTheLoai.trim(),
        })
        message.success('Thêm thể loại thành công')
      } else if (editing) {
        await updateTheLoai(editing.maTheLoai, { tenTheLoai: values.tenTheLoai.trim() })
        message.success('Cập nhật thể loại thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) message.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <Space
        style={{ width: '100%', justifyContent: 'space-between', marginBottom: 14, display: 'flex' }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý Thể Loại
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý danh mục thể loại sách.
          </Typography.Text>
        </div>
        <Button type="primary" onClick={onCreate}>
          Thêm thể loại
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maTheLoai}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={open}
        title={mode === 'create' ? 'Thêm thể loại' : 'Cập nhật thể loại'}
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
          <Form.Item label="Mã thể loại (tùy chọn)" name="maTheLoai">
            <Input placeholder="VD: TL001 (bỏ trống để hệ thống tự sinh)" disabled={mode === 'edit'} />
          </Form.Item>
          <Form.Item
            label="Tên thể loại"
            name="tenTheLoai"
            rules={[{ required: true, message: 'Nhập tên thể loại' }]}
          >
            <Input placeholder="VD: Công nghệ thông tin" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

