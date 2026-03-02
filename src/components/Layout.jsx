import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { signOut } from '../services/supabase'
import { useProfil } from '../hooks/useProfil'
import ConfirmModal from './ConfirmModal'
import ProfilKurulum from './ProfilKurulum'
import config from '../config'

const syncStyle = {
  bos:        'bg-white/20',
  yukleniyor: 'bg-white/15',
  tamam:      'bg-success/30',
  hata:       'bg-accent/35',
}
const syncLabel = {
  yukleniyor: '⏳ Senkronize...',
  tamam:      '☁️ Kaydedildi',
  hata:       '⚠️ Bağlantı hatası',
}

export default function Layout({ children }) {
  const { user, notlar, syncDurum } = useApp()
  const { profil, profilHazir, profilKaydet } = useProfil()
  const location = useLocation()
  const onKonu   = location.pathname === '/' || location.pathname === '/konu'

  const [cikisModal,   setCikisModal]   = useState(false)
  const [profilModal,  setProfilModal]  = useState(false)

  const badgeText = syncDurum !== 'bos'
    ? syncLabel[syncDurum]
    : onKonu ? `${notlar.length} kayıt` : '—'

  const tabs = [
    { to: '/konu',    label: '📝 Konu Takip' },
    { to: '/ogrenci', label: '👨‍🎓 Öğrenciler' },
    { to: '/program', label: '🗓️ Program' },
  ]

  return (
    <div className="flex justify-center min-h-screen bg-appbg">
      <div className="w-full max-w-[430px] bg-white min-h-screen flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-primary to-primaryL px-4 pt-2.5 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            {/* Sol: uygulama adı */}
            <div>
              <div className="text-white font-black text-base leading-tight">
                📚 {config.appName}
              </div>
              <div className="text-white/60 text-[10px] font-bold tracking-wide">
                by {config.producer}
              </div>
            </div>

            {/* Sağ: sync badge + kullanıcı butonu */}
            <div className="flex items-center gap-2">
              <div className={`text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-all ${syncStyle[syncDurum]}`}>
                {badgeText}
              </div>
              <button
                onClick={() => setCikisModal(true)}
                title={user?.email}
                className="bg-white/20 hover:bg-white/30 transition-colors w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
              >
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </button>
            </div>
          </div>

          {/* Profil satırı */}
          {profilHazir && profil && (
            <button
              onClick={() => setProfilModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-1.5 w-full text-left"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
                {profil.ad[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-white text-[12px] font-extrabold truncate block leading-tight">{profil.ad}</span>
                <span className="text-white/65 text-[10px] font-semibold">{profil.brans}</span>
              </div>
              <span className="text-white/50 text-[10px] font-bold">Düzenle</span>
            </button>
          )}
        </div>

        {/* TAB BAR */}
        <div className="flex border-b-2 border-border bg-white flex-shrink-0">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex-1 py-2.5 text-center text-[11px] font-extrabold border-b-[3px] -mb-0.5 transition-colors cursor-pointer select-none
                 ${isActive ? 'text-primary border-primary' : 'text-muted border-transparent'}`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        {/* SAYFA */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>

      </div>

      {/* ÇIKIŞ MODAL */}
      <ConfirmModal
        visible={cikisModal}
        title="🚪 Çıkış Yap"
        message={`${user?.email} hesabından çıkmak istiyor musun?`}
        confirmLabel="Çıkış Yap"
        confirmClass="bg-primary"
        onConfirm={() => { signOut(); setCikisModal(false) }}
        onCancel={() => setCikisModal(false)}
      />

      {/* PROFİL DÜZENLE MODAL */}
      {profilModal && (
        <ProfilKurulum
          mevcutProfil={profil}
          onKaydet={(p) => { profilKaydet(p); setProfilModal(false) }}
          onKapat={() => setProfilModal(false)}
        />
      )}
    </div>
  )
}
