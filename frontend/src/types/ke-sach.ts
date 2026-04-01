export type KeSach = {
  maKe: string
  viTri: string
}

export type CreateKeSachPayload = {
  /** Bỏ trống để backend tự sinh mã kệ */
  maKe?: string
  viTri: string
}

export type UpdateKeSachPayload = {
  viTri: string
}
