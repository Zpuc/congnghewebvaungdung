import {
  App as AntApp,
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Tag,
  Typography,
  Tabs,
  Modal,
  Form,
  Select,
  Alert,
  Input,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { getPhatCuaToi } from '../../services/phat-api'
import {
  listYeuCauCuaToi,
  taoYeuCauThanhToan,
} from '../../services/yeu-cau-thanh-toan-api'
import { getAllPhieuMuon } from '../../services/phieu-muon-api'
import { traSachVaTinhPhat } from '../../services/phieu-muon-api'
import type { Phat } from '../../types/phat'
import type { PhieuMuon } from '../../types/phieu-muon'
import type { YeuCauThanhToanPhat } from '../../types/yeu-cau-thanh-toan'
import { HINH_THUC_THANH_TOAN_OPTIONS } from '../../types/yeu-cau-thanh-toan'

const { Title, Text } = Typography
const { TabPane } = Tabs

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
  const { message: antMessage } = AntApp.useApp()
  const { user } = useAuth()
  const [phat, setPhat] = useState<Phat[]>([])
  const [yeuCau, setYeuCau] = useState<YeuCauThanhToanPhat[]>([])
  const [phieuMuonList, setPhieuMuonList] = useState<PhieuMuon[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPhat, setSelectedPhat] = useState<Phat | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [traModalOpen, setTraModalOpen] = useState(false)
  const [selectedPhieuMuon, setSelectedPhieuMuon] = useState<PhieuMuon | null>(null)
  const [traNgay, setTraNgay] = useState(dayjs())
  const [form] = Form.useForm<{ hinhThuc: string; ghiChu?: string }>()

  const load = async () => {
    setLoading(true)
    try {
      const [p, y, pm] = await Promise.all([
        getPhatCuaToi(),
        listYeuCauCuaToi(),
        getAllPhieuMuon(),
      ])
      setPhat(p.data ?? [])
      setYeuCau(y.data ?? [])
      // Lọc chỉ hiển thị phiếu mượn của bạn đọc hiện tại
      if (user?.maBanDoc) {
        const allPhieuMuon = pm.data ?? []
        const phieuOfReader = allPhieuMuon.filter(
          (pm) => pm.maBanDoc === user.maBanDoc
        )
        setPhieuMuonList(phieuOfReader)
      }
    } catch (e) {
      antMessage.error(e instanceof Error ? e.message : 'Không tải được dữ liệu')
    } finally {
      setLoading(false)
    }
  }

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
      antMessage.success('Đã gửi yêu cầu thanh toán. Vui lòng chờ thủ thư/quản trị duyệt.')
      closeModal()
      await load()
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
      const msg = e instanceof Error ? e.message : 'Gửi yêu cầu thất bại'
      antMessage.error(msg)
      throw e instanceof Error ? e : new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const openTraSach = (row: PhieuMuon) => {
    setSelectedPhieuMuon(row)
    setTraNgay(dayjs())
    setTraModalOpen(true)
  }

  const handleTraSach = async () => {
    if (!selectedPhieuMuon) return

    try {
      const result = await traSachVaTinhPhat({
        maPhieuMuon: selectedPhieuMuon.maPhieuMuon,
        ngayTraThucTe: traNgay.format('YYYY-MM-DD'),
      })

      if (result.data) {
        antMessage.success(
          result.data.tienPhat > 0
            ? `Đã trả sách. Phạt: ${result.data.tienPhat.toLocaleString()}đ`
            : 'Đã trả sách, không phạt'
        )
        setTraModalOpen(false)
        setSelectedPhieuMuon(null)
        await load()
      }
    } catch (e) {
      if (e instanceof Error) {
        antMessage.error(e.message)
      }
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

  const colsPhieuMuon = useMemo(
    () => [
      {
        title: 'STT',
        key: 'stt',
        width: 70,
        align: 'center' as const,
        render: (_: unknown, __: unknown, index: number) => index + 1,
      },
      {
        title: 'Mã phiếu mượn',
        dataIndex: 'maPhieuMuon',
        key: 'maPhieuMuon',
        width: 140,
      },
      {
        title: 'Mã bản sao',
        dataIndex: 'maBanSao',
        key: 'maBanSao',
        width: 120,
      },
      {
        title: 'Ngày mượn',
        dataIndex: 'ngayMuon',
        key: 'ngayMuon',
        width: 120,
        render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
      },
      {
        title: 'Hạn trả',
        dataIndex: 'hanTra',
        key: 'hanTra',
        width: 120,
        render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
      },
      {
        title: 'Ngày trả thực tế',
        dataIndex: 'ngayTraThucTe',
        key: 'ngayTraThucTe',
        width: 140,
        render: (v: string | null) => (v ? dayjs(v).format('DD/MM/YYYY') : 'Chưa trả'),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'trangThai',
        key: 'trangThai',
        width: 120,
        render: (value: string) => {
          const color =
            value === 'Đang mượn'
              ? 'blue'
              : value === 'Đã trả'
              ? 'green'
              : value === 'Quá hạn'
              ? 'red'
              : 'default'
          return <Tag color={color}>{value}</Tag>
        },
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 120,
        render: (_: unknown, record: PhieuMuon) => (
          <Button
            size="small"
            onClick={() => openTraSach(record)}
            disabled={record.trangThai === 'Đã trả' || record.trangThai === 'Đang xử lý'}
          >
            Trả sách
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 16px' }}>
      <Title level={3} style={{ marginTop: 0 }}>
        Không gian bạn đọc
      </Title>

      <Tabs defaultActiveKey="profile">
        <TabPane tab="Thông tin cá nhân" key="profile">
          {user && (
            <Card>
              <Descriptions bordered title="Thông tin tài khoản" column={2}>
                <Descriptions.Item label="Mã tài khoản">{user.maTaiKhoan}</Descriptions.Item>
                <Descriptions.Item label="Tên đăng nhập">{user.tenDangNhap}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">{user.vaiTro}</Descriptions.Item>
                {user.maBanDoc && <Descriptions.Item label="Mã bạn đọc">{user.maBanDoc}</Descriptions.Item>}
              </Descriptions>
            </Card>
          )}
        </TabPane>

        <TabPane tab="Lịch sử mượn sách" key="muon-sach">
          <Card title="Danh sách phiếu mượn">
            <Table<PhieuMuon>
              rowKey="maPhieuMuon"
              loading={loading}
              dataSource={phieuMuonList}
              columns={colsPhieuMuon}
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: 'Bạn chưa có phiếu mượn nào.' }}
              scroll={{ x: 1100 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Phạt của tôi" key="phat">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="Danh sách khoản phạt">
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
        </TabPane>
      </Tabs>

      {/* Modal gửi yêu cầu thanh toán phạt */}
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
              Yêu cầu sẽ ở trạng thái "Chờ duyệt" cho đến khi thủ thư/quản trị xác nhận.
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

      {/* Modal trả sách */}
      <Modal
        title="Trả sách"
        open={traModalOpen}
        onOk={handleTraSach}
        onCancel={() => {
          setTraModalOpen(false)
          setSelectedPhieuMuon(null)
        }}
        confirmLoading={false}
      >
        {selectedPhieuMuon && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions bordered title="Thông tin phiếu mượn" size="small">
              <Descriptions.Item label="Mã phiếu">{selectedPhieuMuon.maPhieuMuon}</Descriptions.Item>
              <Descriptions.Item label="Mã bản sao">{selectedPhieuMuon.maBanSao}</Descriptions.Item>
              <Descriptions.Item label="Ngày mượn">
                {dayjs(selectedPhieuMuon.ngayMuon).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn trả">
                {dayjs(selectedPhieuMuon.hanTra).format('DD/MM/YYYY')}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong>Ngày trả thực tế: </Text>
              <input
                type="date"
                value={traNgay.format('YYYY-MM-DD')}
                onChange={(e) => setTraNgay(dayjs(e.target.value))}
              />
            </div>

            {dayjs(traNgay).isAfter(dayjs(selectedPhieuMuon.hanTra)) && (
              <Alert
                message="Cảnh báo trễ hạn"
                description={
                  <Space>
                    <Text>
                      Trả sách trễ hạn! Bạn sẽ bị phạt{' '}
                      {Math.ceil(dayjs(traNgay).diff(dayjs(selectedPhieuMuon.hanTra), 'day')) * 2000}{' '}
                      đồng.
                    </Text>
                  </Space>
                }
                type="warning"
                showIcon
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  )
}
