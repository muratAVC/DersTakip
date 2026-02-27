import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const SINIFLAR = ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf', 'Mezun']

export default function KonuTakip() {
  const { notlar, notEkle, notGuncelle, notSil } = useApp()
  const { toast, showToast } = useToast()

  const [sinif,   setSinif]   = useState('')
  const [ders,    setDers]    = useState('')
  const [konu,    setKonu]    = useState('')
  const [editId,  setEditId]  = useState(null)
  const [filtre,  setFiltre]  = useState('tumu')
  const [silId,   setSilId]   = useState(null)

  const tumSiniflar = [...new Set(notlar.map(n => n.sinif))].sort()

  const handleKaydet = () => {
    if (!sinif || !konu.trim()) { showToast('⚠️ Sınıf ve konu zorunlu!'); return }
    if (editId !== null) {
      notGuncelle(editId, { sinif, ders, konu })
      showToast('✅ Güncellendi')
      setEditId(null)
    } else {
      notEkle({ sinif, ders, konu })
      showToast('✅ Eklendi')
    }
    setSinif(''); setDers(''); setKonu('')
  }

  const handleDuzenle = (not) => {
    setSinif(not.sinif); setDers(not.ders || ''); setKonu(not.konu)
    setEditId(not.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleIptal = () => {
    setSinif(''); setDers(''); setKonu(''); setEditId(null)
  }

  const filtered = filtre === 'tumu' ? notlar : notlar.filter(n => n.sinif === filtre)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* FORM */}
      <div className="px-2.5 pt-2 pb-0 border-b border-border flex-shrink-0">
        <div className={`rounded-xl p-2 border-[1.5px] transition-colors
          ${editId ? 'border-success bg-[#f0fefc]' : 'border-border bg-appbg'}`}>
          {editId && <div className="text-[10px] font-extrabold text-success mb-1.5">✏️ DÜZENLEME MODU</div>}
          <div className="flex gap-1.5 mb-1.5">
            {/* Sınıf */}
            <div className="flex flex-col gap-0.5 flex-1">
              <label className="text-[9px] font-extrabold text-muted uppercase tracking-wide">Sınıf</label>
              <select
                value={sinif} onChange={e => setSinif(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="">Seç...</option>
                {SINIFLAR.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {/* Derslik */}
            <div className="flex flex-col gap-0.5" style={{flex:'1.5'}}>
              <label className="text-[9px] font-extrabold text-muted uppercase tracking-wide">Derslik</label>
              <input
                type="text" value={ders} onChange={e => setDers(e.target.value)}
                placeholder="A101" maxLength={20}
                className="px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors"
              />
            </div>
            {/* Konu */}
            <div className="flex flex-col gap-0.5" style={{flex:'2'}}>
              <label className="text-[9px] font-extrabold text-muted uppercase tracking-wide">Konu</label>
              <input
                type="text" value={konu} onChange={e => setKonu(e.target.value)}
                placeholder="Hücre Bölünmesi..."
                onKeyDown={e => e.key === 'Enter' && handleKaydet()}
                className="px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleKaydet}
              className={`flex-1 py-2 rounded-lg text-xs font-black text-white flex items-center justify-center gap-1
                ${editId ? 'bg-success' : 'bg-primary'}`}
            >
              {editId ? '💾 GÜNCELLE' : '➕ EKLE'}
            </button>
            {editId && (
              <button
                onClick={handleIptal}
                className="px-3 py-2 rounded-lg text-xs font-black text-muted bg-transparent border-[1.5px] border-border"
              >✕</button>
            )}
          </div>
        </div>
      </div>

      {/* FİLTRE */}
      <div className="flex gap-1.5 px-2.5 py-1.5 overflow-x-auto scrollbar-hide border-b border-border flex-shrink-0">
        {['tumu', ...tumSiniflar].map(s => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold border-[1.5px] transition-all
              ${filtre === s ? 'bg-primary border-primary text-white' : 'bg-appbg border-border text-muted'}`}
          >
            {s === 'tumu' ? 'Tümü' : s}
          </button>
        ))}
      </div>

      {/* LİSTE */}
      <div className="flex-1 overflow-y-auto px-2.5 py-2">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm font-semibold">
            <div className="text-3xl mb-2">📝</div>
            {notlar.length === 0 ? 'Henüz kayıt yok' : 'Bu sınıfa ait kayıt yok'}
          </div>
        ) : (
          filtered.map(not => (
            <div
              key={not.id}
              onClick={() => handleDuzenle(not)}
              className={`fade-in-up flex items-center gap-2 p-2.5 rounded-xl border-[1.5px] mb-1.5 cursor-pointer transition-colors active:opacity-75
                ${editId === not.id ? 'border-success bg-[#f0fefc]' : 'border-border bg-white'}`}
            >
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded text-center">{not.sinif}</span>
                {not.ders && <span className="bg-[#EEF2FF] text-primary text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#C7D2FE] text-center">{not.ders}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-textmain truncate">{not.konu}</div>
                {not.tarih && <div className="text-[10px] text-muted mt-0.5">{not.tarih}</div>}
              </div>
              <button
                onClick={e => { e.stopPropagation(); setSilId(not.id) }}
                className="bg-[#FFF0F0] text-accent border border-[#FFD5D5] px-2 py-1 rounded text-[11px] font-bold flex-shrink-0"
              >Sil</button>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        visible={!!silId}
        title="🗑️ Notu Sil"
        message="Bu notu silmek istediğine emin misin?"
        onConfirm={() => { notSil(silId); setSilId(null); showToast('🗑️ Silindi') }}
        onCancel={() => setSilId(null)}
      />
      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  )
}
