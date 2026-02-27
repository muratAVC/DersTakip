import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const syncLabel = {
  bos:         null,
  yukleniyor:  '⏳ Senkronize...',
  tamam:       '☁️ Kaydedildi',
  hata:        '⚠️ Bağlantı hatası',
}
const syncStyle = {
  bos:        'bg-white/20',
  yukleniyor: 'bg-white/15',
  tamam:      'bg-success/30',
  hata:       'bg-accent/35',
}

export default function Layout({ children }) {
  const { notlar, syncDurum } = useApp()
  const location = useLocation()
  const onKonu = location.pathname === '/' || location.pathname === '/konu'

  const tabs = [
    { to: '/konu',    label: '📝 Konu Takip' },
    { to: '/ogrenci', label: '👨‍🎓 Öğrenciler' },
    { to: '/program', label: '🗓️ Program' },
  ]

  return (
    <div className="flex justify-center min-h-screen bg-appbg">
      <div className="w-full max-w-[430px] bg-white min-h-screen flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-primary to-primaryL px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-white font-black text-base leading-tight">📚 Ders Takip</div>
            <div className="text-white/60 text-[10px] font-bold tracking-wide">by Mergen</div>
          </div>
          <div className={`text-white text-[11px] font-extrabold px-3 py-1 rounded-full transition-all ${syncStyle[syncDurum]}`}>
            {syncDurum === 'bos'
              ? (onKonu ? `${notlar.length} kayıt` : '—')
              : syncLabel[syncDurum]}
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
                 ${isActive
                   ? 'text-primary border-primary'
                   : 'text-muted border-transparent hover:text-primary/60'}`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        {/* SAYFA İÇERİĞİ */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {children}
        </div>

      </div>
    </div>
  )
}
