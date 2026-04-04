import { App as AntApp, ConfigProvider } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { AdminPage } from './pages/AdminPage/AdminPage'
import { LibrarianPage } from './pages/LibrarianPage/LibrarianPage'
import { ReaderPage } from './pages/ReaderPage/ReaderPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleLayout } from './layouts/RoleLayout'
import { AdminAccountsPage } from './pages/AdminAccountsPage/AdminAccountsPage'
import { BooksPage } from './pages/BooksPage/BooksPage'
import { ReadersPage } from './pages/ReadersPage/ReadersPage'
import { BanSaoPage } from './pages/BanSaoPage/BanSaoPage'
import { KeSachPage } from './pages/KeSachPage/KeSachPage'
import { CategoriesPage } from './pages/CategoriesPage/CategoriesPage'
import { PhatPage } from './pages/PhatPage/PhatPage'
import { PhieuMuonPage } from './pages/PhieuMuonPage/PhieuMuonPage'
import { ThanhToanPage } from './pages/ThanhToanPage/ThanhToanPage'
import './App.css'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 10,
        },
      }}
    >
      <AntApp>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowRoles={['Quản trị']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPage />} />
          <Route path="the-loai" element={<CategoriesPage />} />
            <Route path="sach" element={<BooksPage />} />
            <Route path="ke-sach" element={<KeSachPage />} />
          <Route path="ban-doc" element={<ReadersPage />} />
            <Route path="ban-sao" element={<BanSaoPage />} />
            <Route path="phieu-muon" element={<PhieuMuonPage />} />
            <Route path="phat" element={<PhatPage />} />
            <Route path="thanh-toan" element={<ThanhToanPage />} />
            <Route path="tai-khoan" element={<AdminAccountsPage />} />
          </Route>
          <Route
            path="/thu-thu"
            element={
              <ProtectedRoute allowRoles={['Thủ thư']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LibrarianPage />} />
          <Route path="the-loai" element={<CategoriesPage />} />
            <Route path="sach" element={<BooksPage />} />
            <Route path="ke-sach" element={<KeSachPage />} />
          <Route path="ban-doc" element={<ReadersPage />} />
            <Route path="ban-sao" element={<BanSaoPage />} />
            <Route path="phieu-muon" element={<PhieuMuonPage />} />
            <Route path="phat" element={<PhatPage />} />
            <Route path="thanh-toan" element={<ThanhToanPage />} />
          </Route>
          <Route
            path="/ban-doc"
            element={
              <ProtectedRoute allowRoles={['Bạn đọc']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ReaderPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AntApp>
    </ConfigProvider>
  )
}
