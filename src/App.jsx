import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout         from './components/Layout'
import Login          from './pages/Login'
import KonuTakip      from './pages/KonuTakip'
import OgrenciListesi from './pages/OgrenciListesi'
import OgrenciDetay   from './pages/OgrenciDetay'
import DersProgrami   from './pages/DersProgrami'

// ── Auth Guard ──────────────────────────────────────────
// user === undefined → henüz kontrol ediliyor (loading)
// user === null      → giriş yapılmamış → Login'e yönlendir
// user === {...}     → giriş yapılmış → sayfayı göster
function AuthGuard({ children }) {
  const { user } = useApp()

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
      {/* Giriş sayfası — sadece çıkış yapmış kullanıcılar */}
      <Route path="/login" element={
        <GuestGuard><Login /></GuestGuard>
      } />

      {/* Korumalı sayfalar — giriş zorunlu */}
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
