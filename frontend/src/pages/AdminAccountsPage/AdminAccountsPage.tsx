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
import type {
  CreateTaiKhoanPayload,
  TaiKhoan,
  UpdateTaiKhoanPayload,
} from '../../types/tai-khoan'
import {
  createTaiKhoan,
  deleteTaiKhoan,
  getAllTaiKhoan,
  registerReaderTaiKhoan,
  updateTaiKhoan,
} from '../../services/tai-khoan-api'

type FormValues = {
  tenDangNhap: string
  matKhau: string
  vaiTro: 'Quản trị' | 'Thủ thư' | 'Bạn đọc'
  hoTen?: string
  email?: string
  dienThoai?: string
}

const roleColor: Record<FormValues['vaiTro'], string> = {
  'Quản trị': 'red',
  'Thủ thư': 'blue',
  'Bạn đọc': 'green',
}

export function AdminAccountsPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<TaiKhoan[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<TaiKhoan | null>(null)
  const [form] = Form.useForm<FormValues>()
  const selectedRole = Form.useWatch('vaiTro', form)

  const mode = editing ? 'edit' : 'create'
  const modalTitle = mode === 'create' ? 'Thêm tài khoản' : 'Cập nhật tài khoản'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllTaiKhoan()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách tài khoản'
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
      {
        title: 'Mã tài khoản',
        dataIndex: 'maTaiKhoan',
        key: 'maTaiKhoan',
        width: 160,
      },
      {
        title: 'Tên đăng nhập',
        dataIndex: 'tenDangNhap',
        key: 'tenDangNhap',
      },
      {
        title: 'Vai trò',
        dataIndex: 'vaiTro',
        key: 'vaiTro',
        width: 130,
        render: (value: FormValues['vaiTro']) => <Tag color={roleColor[value]}>{value}</Tag>,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 210,
        render: (_: unknown, record: TaiKhoan) => (
          <Space>
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  tenDangNhap: record.tenDangNhap,
                  matKhau: '',
                  vaiTro: (record.vaiTro as FormValues['vaiTro']) ?? 'Thủ thư',
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa tài khoản"
              description={`Bạn chắc chắn muốn xóa ${record.tenDangNhap}?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteTaiKhoan(record.maTaiKhoan)
                  message.success('Đã xóa tài khoản')
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
    form.setFieldsValue({ vaiTro: 'Thủ thư' })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      if (mode === 'create') {
        if (values.vaiTro === 'Bạn đọc') {
          if (!values.hoTen?.trim() || !values.email?.trim() || !values.dienThoai?.trim()) {
            message.error('Vui lòng nhập Họ tên, Email, Điện thoại cho tài khoản bạn đọc')
            setSaving(false)
            return
          }

          await registerReaderTaiKhoan({
            hoTen: values.hoTen.trim(),
            email: values.email.trim(),
            dienThoai: values.dienThoai.trim(),
            matKhau: values.matKhau,
          })
          message.success('Tạo tài khoản bạn đọc thành công')
        } else {
          const payload: CreateTaiKhoanPayload = {
            tenDangNhap: values.tenDangNhap,
            matKhau: values.matKhau,
            vaiTro: values.vaiTro,
          }
          await createTaiKhoan(payload)
          message.success('Tạo tài khoản thành công')
        }
      } else if (editing) {
        const payload: UpdateTaiKhoanPayload = {
          tenDangNhap: values.tenDangNhap,
          matKhau: values.matKhau,
          vaiTro: values.vaiTro,
        }
        await updateTaiKhoan(editing.maTaiKhoan, payload)
        message.success('Cập nhật tài khoản thành công')
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
            Quản lý tài khoản
          </Typography.Title>
          <Typography.Text type="secondary">
            Tạo, cập nhật và phân quyền tài khoản hệ thống.
          </Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Thêm tài khoản
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maTaiKhoan}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={open}
        title={modalTitle}
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
        <Form layout="vertical" form={form} requiredMark={false}>
          <Form.Item
            label="Tên đăng nhập"
            name="tenDangNhap"
            rules={[{ required: true, message: 'Nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={mode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới'}
            name="matKhau"
            rules={[
              { required: true, message: 'Nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="vaiTro"
            rules={[{ required: true, message: 'Chọn vai trò' }]}
          >
            <Select
              options={[
                { label: 'Quản trị', value: 'Quản trị' },
                { label: 'Thủ thư', value: 'Thủ thư' },
                { label: 'Bạn đọc', value: 'Bạn đọc' },
              ]}
            />
          </Form.Item>

          {mode === 'create' && selectedRole === 'Bạn đọc' && (
            <>
              <Form.Item
                label="Họ tên"
                name="hoTen"
                rules={[{ required: true, message: 'Nhập họ tên' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Điện thoại"
                name="dienThoai"
                rules={[
                  { required: true, message: 'Nhập điện thoại' },
                  { pattern: /^\d{10,11}$/, message: 'Điện thoại phải 10-11 chữ số' },
                ]}
              >
                <Input maxLength={11} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  )
}

