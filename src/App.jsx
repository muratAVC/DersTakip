import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { useProfil } from './hooks/useProfil'
import Layout           from './components/Layout'
import ProfilKurulum    from './components/ProfilKurulum'
import Login            from './pages/Login'
import KonuTakip        from './pages/KonuTakip'
import OgrenciListesi   from './pages/OgrenciListesi'
import OgrenciDetay     from './pages/OgrenciDetay'
import DersProgrami     from './pages/DersProgrami'

// ── Auth Guard ──────────────────────────────────────────
function AuthGuard({ children }) {
  const { user } = useApp()
  const { profil, profilHazir, profilKaydet } = useProfil()

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-appbg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">📚</div>
          <div className="text-sm font-bold text-muted">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (user === null) return <Navigate to="/login" replace />

  // Giriş yapılmış ama profil henüz kurulmamış → kurulum ekranı
  if (profilHazir && !profil) {
    return (
      <ProfilKurulum
        mevcutProfil={null}
        onKaydet={profilKaydet}
        onKapat={() => {}} // ilk kurulumda kapatma yok
      />
    )
  }

  return children
}

function GuestGuard({ children }) {
  const { user } = useApp()
  if (user === undefined) return null
  if (user) return <Navigate to="/" replace />
  return children
}

// ── Router ──────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <GuestGuard><Login /></GuestGuard>
      } />

      <Route path="/" element={
        <AuthGuard><Layout><KonuTakip /></Layout></AuthGuard>
      } />
      <Route path="/konu" element={
        <AuthGuard><Layout><KonuTakip /></Layout></AuthGuard>
      } />
      <Route path="/ogrenci" element={
        <AuthGuard><Layout><OgrenciListesi /></Layout></AuthGuard>
      } />
      <Route path="/ogrenci/:id" element={
        <AuthGuard><OgrenciDetay /></AuthGuard>
      } />
      <Route path="/program" element={
        <AuthGuard><Layout><DersProgrami /></Layout></AuthGuard>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
