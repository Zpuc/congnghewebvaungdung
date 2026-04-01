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
import type { KeSach } from '../../types/ke-sach'
import {
  createKeSach,
  deleteKeSach,
  getAllKeSach,
  updateKeSach,
} from '../../services/ke-sach-api'

type FormValues = {
  maKe?: string
  viTri: string
}

export function KeSachPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<KeSach[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<KeSach | null>(null)
  const [form] = Form.useForm<FormValues>()

  const mode = editing ? 'edit' : 'create'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllKeSach()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách kệ sách'
      message.error(text)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const columns = useMemo<TableColumnsType<KeSach>>(
    () => [
      { title: 'Mã kệ', dataIndex: 'maKe', key: 'maKe', width: 160 },
      { title: 'Vị trí', dataIndex: 'viTri', key: 'viTri', ellipsis: true },
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
                  maKe: record.maKe,
                  viTri: record.viTri,
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa kệ sách"
              description={`Bạn chắc chắn muốn xóa kệ "${record.maKe}"?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteKeSach(record.maKe)
                  message.success('Đã xóa kệ sách')
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

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      if (mode === 'create') {
        await createKeSach({
          maKe: values.maKe?.trim() || undefined,
          viTri: values.viTri.trim(),
        })
        message.success('Thêm kệ sách thành công')
      } else if (editing) {
        await updateKeSach(editing.maKe, { viTri: values.viTri.trim() })
        message.success('Cập nhật kệ sách thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
        if (e.message.includes('Không tìm thấy kệ sách')) {
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
            Quản lý kệ sách
          </Typography.Title>
          <Typography.Text type="secondary">
            Thêm, sửa vị trí và xóa kệ (mã kệ có thể để trống khi tạo mới để hệ thống tự sinh).
          </Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Thêm kệ
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maKe}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} kệ`,
        }}
      />

      <Modal
        open={open}
        title={mode === 'create' ? 'Thêm kệ sách' : 'Cập nhật kệ sách'}
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
            label="Mã kệ (tùy chọn)"
            name="maKe"
            extra="Bỏ trống để hệ thống tự sinh mã khi thêm mới."
          >
            <Input placeholder="VD: K001" disabled={mode === 'edit'} />
          </Form.Item>
          <Form.Item
            label="Vị trí"
            name="viTri"
            rules={[{ required: true, message: 'Nhập vị trí kệ' }]}
          >
            <Input placeholder="VD: Tầng 2 - Khu A" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
