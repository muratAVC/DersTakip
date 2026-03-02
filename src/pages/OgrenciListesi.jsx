import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import config from '../config'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

const SINIFLAR = config.siniflar

export default function OgrenciListesi() {
  const { ogrenciler, ogEkle } = useApp()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  const [ad,    setAd]    = useState('')
  const [sinif, setSinif] = useState('')

  const handleEkle = () => {
    if (!ad.trim() || !sinif) { showToast('⚠️ Ad soyad ve sınıf zorunlu!'); return }
    ogEkle({ ad: ad.trim(), sinif })
    setAd(''); setSinif('')
    showToast('✅ Öğrenci eklendi')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* FORM */}
      <div className="px-2.5 pt-2 pb-2 border-b border-border flex-shrink-0">
        <div className="bg-appbg rounded-xl p-2 border-[1.5px] border-border">
          <div className="flex gap-1.5 mb-1.5">
            <div className="flex flex-col gap-0.5" style={{flex:'2'}}>
              <label className="text-[9px] font-extrabold text-muted uppercase tracking-wide">Ad Soyad</label>
              <input
                type="text" value={ad} onChange={e => setAd(e.target.value)}
                placeholder="Ayşe Kaya" maxLength={50}
                onKeyDown={e => e.key === 'Enter' && handleEkle()}
                className="px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <label className="text-[9px] font-extrabold text-muted uppercase tracking-wide">Sınıf</label>
              <select
                value={sinif} onChange={e => setSinif(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Seç</option>
                {SINIFLAR.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleEkle}
            className="w-full py-2 rounded-lg text-xs font-black text-white bg-primary"
          >➕ ÖĞRENCİ EKLE</button>
        </div>
      </div>

      {/* LİSTE */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2">
        {ogrenciler.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm font-semibold">
            <div className="text-3xl mb-2">👨‍🎓</div>
            Henüz öğrenci yok
          </div>
        ) : (
          ogrenciler.map(og => {
            const sonDers = og.dersler?.length
              ? og.dersler[og.dersler.length - 1].tarih
              : 'Ders yok'
            const bekleyen = (og.dersler || [])
              .filter(d => !d.odendi)
              .reduce((t, d) => t + (d.ucret || 0), 0)
            return (
              <div
                key={og.id}
                onClick={() => navigate(`/ogrenci/${og.id}`)}
                className="fade-in-up flex items-center gap-2.5 p-2.5 rounded-xl border-[1.5px] border-border bg-white mb-2 cursor-pointer active:opacity-75 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primaryL flex items-center justify-center text-white text-base font-black flex-shrink-0">
                  {og.ad[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold text-textmain">{og.ad}</div>
                  <div className="text-[11px] text-muted mt-0.5">
                    {og.sinif} · Son ders: {sonDers}
                    {bekleyen > 0 && <span className="text-yellow-600"> · ₺{bekleyen.toLocaleString('tr-TR')} bekliyor</span>}
                  </div>
                </div>
                <div className="text-muted text-lg">›</div>
              </div>
            )
          })
        )}
      </div>

      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  )
}
