import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { signOut } from '../services/supabase'
import ConfirmModal from './ConfirmModal'

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
  const location   = useLocation()
  const onKonu     = location.pathname === '/' || location.pathname === '/konu'
  const [cikisModal, setCikisModal] = useState(false)

  const tabs = [
    { to: '/konu',    label: '📝 Konu Takip' },
    { to: '/ogrenci', label: '👨‍🎓 Öğrenciler' },
    { to: '/program', label: '🗓️ Program' },
  ]

  const badgeText = syncDurum !== 'bos'
    ? syncLabel[syncDurum]
    : onKonu ? `${notlar.length} kayıt` : '—'

  return (
    <div className="flex justify-center min-h-screen bg-appbg">
      <div className="w-full max-w-[430px] bg-white min-h-screen flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-primary to-primaryL px-4 py-2 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-white font-black text-base leading-tight">📚 Ders Takip</div>
            <div className="text-white/60 text-[10px] font-bold tracking-wide">by Mergen</div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync badge */}
            <div className={`text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full transition-all ${syncStyle[syncDurum]}`}>
              {badgeText}
            </div>

            {/* Kullanıcı + Çıkış */}
            <button
              onClick={() => setCikisModal(true)}
              title={user?.email}
              className="bg-white/20 hover:bg-white/30 transition-colors w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
            >
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </button>
          </div>
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
    </div>
  )
}
