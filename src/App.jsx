import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import KonuTakip      from './pages/KonuTakip'
import OgrenciListesi from './pages/OgrenciListesi'
import OgrenciDetay   from './pages/OgrenciDetay'
import DersProgrami   from './pages/DersProgrami'

// Veri yükleyici wrapper — uygulama açılınca JSONBin'den çeker
function AppLoader({ children }) {
  const { yukle } = useApp()
  useEffect(() => { yukle() }, [yukle])
  return children
}

export default function App() {
  return (
    <AppProvider>
      <AppLoader>
        <Routes>
          {/* Ana layout içindeki sayfalar */}
          <Route path="/" element={<Layout><KonuTakip /></Layout>} />
          <Route path="/konu" element={<Layout><KonuTakip /></Layout>} />
          <Route path="/ogrenci" element={<Layout><OgrenciListesi /></Layout>} />
          <Route path="/program" element={<Layout><DersProgrami /></Layout>} />

          {/* Öğrenci detay — kendi header'ı var, Layout kullanmıyor */}
          <Route path="/ogrenci/:id" element={<OgrenciDetay />} />

          {/* Bilinmeyen rotaları ana sayfaya yönlendir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLoader>
    </AppProvider>
  )
}
