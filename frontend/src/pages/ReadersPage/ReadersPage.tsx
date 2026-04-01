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
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import type { BanDoc, CreateBanDocPayload, UpdateBanDocPayload } from '../../types/ban-doc'
import {
  createBanDoc,
  deleteBanDoc,
  getAllBanDoc,
  updateBanDoc,
} from '../../services/ban-doc-api'

type FormValues = {
  hoTen: string
  soThe: string
  email: string
  dienThoai: string
  hanThe: dayjs.Dayjs
  trangThaiThe: 'Hoạt động' | 'Bị khoá' | 'Hết hạn'
  duNo: number
}

const statusColor: Record<FormValues['trangThaiThe'], string> = {
  'Hoạt động': 'green',
  'Bị khoá': 'volcano',
  'Hết hạn': 'gold',
}

export function ReadersPage() {
  const { message } = AntApp.useApp()
  const [rows, setRows] = useState<BanDoc[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<BanDoc | null>(null)
  const [form] = Form.useForm<FormValues>()

  const mode = editing ? 'edit' : 'create'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getAllBanDoc()
      setRows(res.data ?? [])
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Không tải được danh sách bạn đọc'
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
      { title: 'Mã', dataIndex: 'maBanDoc', key: 'maBanDoc', width: 100 },
      { title: 'Số thẻ', dataIndex: 'soThe', key: 'soThe', width: 120 },
      { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen', width: 200 },
      { title: 'Email', dataIndex: 'email', key: 'email', width: 220 },
      { title: 'Điện thoại', dataIndex: 'dienThoai', key: 'dienThoai', width: 130 },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThaiThe',
        key: 'trangThaiThe',
        width: 120,
        render: (value: FormValues['trangThaiThe']) => (
          <Tag color={statusColor[value]}>{value}</Tag>
        ),
      },
      {
        title: 'Dư nợ',
        dataIndex: 'duNo',
        key: 'duNo',
        width: 100,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 210,
        render: (_: unknown, record: BanDoc) => (
          <Space>
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue({
                  hoTen: record.hoTen,
                  soThe: record.soThe,
                  email: record.email,
                  dienThoai: record.dienThoai,
                  hanThe: dayjs(record.hanThe),
                  trangThaiThe: record.trangThaiThe as FormValues['trangThaiThe'],
                  duNo: record.duNo ?? 0,
                })
                setOpen(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa bạn đọc"
              description={`Bạn chắc chắn muốn xóa "${record.hoTen}"?`}
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={async () => {
                try {
                  await deleteBanDoc(record.maBanDoc)
                  message.success('Đã xóa bạn đọc')
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
    form.setFieldsValue({
      trangThaiThe: 'Hoạt động',
      duNo: 0,
      hanThe: dayjs().add(1, 'year'),
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)

      const payloadCommon = {
        hoTen: values.hoTen.trim(),
        soThe: values.soThe.trim(),
        email: values.email.trim(),
        dienThoai: values.dienThoai.trim(),
        hanThe: values.hanThe.format('YYYY-MM-DD'),
        trangThaiThe: values.trangThaiThe,
        duNo: values.duNo ?? 0,
      }

      if (mode === 'create') {
        const payload: CreateBanDocPayload = payloadCommon
        await createBanDoc(payload)
        message.success('Thêm bạn đọc thành công')
      } else if (editing) {
        const payload: UpdateBanDocPayload = payloadCommon
        await updateBanDoc(editing.maBanDoc, payload)
        message.success('Cập nhật bạn đọc thành công')
      }

      setOpen(false)
      form.resetFields()
      setEditing(null)
      await fetchData()
    } catch (e) {
      if (e instanceof Error) {
        message.error(e.message)
        if (e.message.includes('Không tìm thấy bạn đọc')) {
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
            Quản lý Bạn Đọc
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý thông tin bạn đọc: tạo mới, cập nhật và xóa.
          </Typography.Text>
        </div>
        <Button type="primary" onClick={openCreate}>
          Thêm bạn đọc
        </Button>
      </Space>

      <Table
        rowKey={(record) => record.maBanDoc}
        loading={loading}
        columns={columns}
        dataSource={rows}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bạn đọc`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        open={open}
        title={mode === 'create' ? 'Thêm bạn đọc' : 'Cập nhật bạn đọc'}
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
          <Form.Item label="Họ tên" name="hoTen" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Số thẻ"
            name="soThe"
            rules={[
              { required: true, message: 'Nhập số thẻ' },
              { len: 10, message: 'Số thẻ phải đúng 10 ký tự' },
            ]}
          >
            <Input maxLength={10} />
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
              { required: true, message: 'Nhập số điện thoại' },
              { pattern: /^\d{10}$/, message: 'Điện thoại phải đúng 10 chữ số' },
            ]}
          >
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item label="Hạn thẻ" name="hanThe" rules={[{ required: true, message: 'Chọn hạn thẻ' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Trạng thái thẻ"
            name="trangThaiThe"
            rules={[{ required: true, message: 'Chọn trạng thái thẻ' }]}
          >
            <Select
              options={[
                { label: 'Hoạt động', value: 'Hoạt động' },
                { label: 'Bị khoá', value: 'Bị khoá' },
                { label: 'Hết hạn', value: 'Hết hạn' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Dư nợ" name="duNo" rules={[{ required: true, message: 'Nhập dư nợ' }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

