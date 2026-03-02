import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import config from '../config'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const SINIFLAR = config.siniflar
const SURELER  = config.sureler

export default function OgrenciDetay() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { ogrenciler, yukleniyor, ogGuncelle, ogSil, dersEkle, dersSil, odemeToggle } = useApp()
  const { toast, showToast } = useToast()

  const og = ogrenciler.find(o => String(o.id) === String(id))

  // Bilgi düzenleme state
  const [bilgiEdit, setBilgiEdit] = useState(false)
  const [bfAd,    setBfAd]    = useState('')
  const [bfSinif, setBfSinif] = useState('')
  const [bfAdres, setBfAdres] = useState('')
  const [bfUcret, setBfUcret] = useState('')

  // Ders ekle state
  const [dkTarih, setDkTarih] = useState('')
  const [dkSaat,  setDkSaat]  = useState('')
  const [dkSure,  setDkSure]  = useState('1')

  // Modal state
  const [modalConfig, setModalConfig] = useState(null) // { title, message, onConfirm }

  if (yukleniyor && !og) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">👨‍🎓</div>
          <div className="text-sm font-bold text-muted">Yükleniyor...</div>
        </div>
      </div>
    )
  }

  if (!og) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-muted">
        <div className="text-4xl mb-2">😕</div>
        <div className="text-sm font-semibold">Öğrenci bulunamadı</div>
        <button onClick={() => navigate('/ogrenci')} className="mt-4 text-primary font-bold text-sm">← Geri Dön</button>
      </div>
    )
  }

  const dersler   = og.dersler || []
  const tahsil    = dersler.filter(d =>  d.odendi).reduce((t, d) => t + (d.ucret || 0), 0)
  const bekleyen  = dersler.filter(d => !d.odendi).reduce((t, d) => t + (d.ucret || 0), 0)
  const toplam    = tahsil + bekleyen
  const toplamSaat = dersler.reduce((t, d) => t + (parseFloat(d.sure) || 0), 0)

  const handleBilgiDuzenle = () => {
    setBfAd(og.ad); setBfSinif(og.sinif); setBfAdres(og.adres || ''); setBfUcret(String(og.ucret || ''))
    setBilgiEdit(true)
  }

  const handleBilgiKaydet = () => {
    ogGuncelle(og.id, {
      ad:    bfAd.trim()    || og.ad,
      sinif: bfSinif        || og.sinif,
      adres: bfAdres.trim(),
      ucret: parseFloat(bfUcret) || 0,
    })
    setBilgiEdit(false)
    showToast('✅ Bilgiler güncellendi')
  }

  const handleDersEkle = () => {
    const tarih = dkTarih.trim() || new Date().toLocaleDateString('tr-TR')
    const sure  = parseFloat(dkSure) || 1
    const ucret = (og.ucret || 0) * sure
    dersEkle(og.id, { tarih, saat: dkSaat.trim(), sure, ucret })
    setDkTarih(''); setDkSaat('')
    showToast(`✅ Ders eklendi — ₺${ucret.toLocaleString('tr-TR')}`)
  }

  const inp = "px-2.5 py-1.5 rounded-lg border-[1.5px] border-border text-[13px] font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors w-full"

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* DETAY HEADER */}
      <div className="bg-gradient-to-br from-primary to-primaryL px-3 py-2.5 flex items-center gap-2.5 flex-shrink-0">
        <button
          onClick={() => navigate('/ogrenci')}
          className="bg-white/20 text-white text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap"
        >← Geri</button>
        <div className="flex-1 text-white text-sm font-black text-center truncate">{og.ad}</div>
        <button
          onClick={() => setModalConfig({
            title: '👨‍🎓 Öğrenciyi Sil',
            message: 'Bu öğrenci ve tüm ders kayıtları silinecek. Emin misin?',
            onConfirm: () => { ogSil(og.id); navigate('/ogrenci') }
          })}
          className="bg-accent/25 text-white text-base px-2.5 py-1 rounded-lg"
        >🗑️</button>
      </div>

      {/* İÇERİK */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">

        {/* FİNANSAL ÖZET */}
        <div className="bg-gradient-to-br from-primary to-primaryL rounded-xl p-4 text-white">
          <div className="text-[10px] font-black opacity-75 uppercase tracking-widest mb-3">💰 Finansal Özet</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-85">Toplam Ders</span>
              <span className="text-sm font-black">{dersler.length} ders / {toplamSaat} saat</span>
            </div>
            <hr className="border-white/20" />
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-85">Tahsil Edildi</span>
              <span className="text-sm font-black text-emerald-300">₺{tahsil.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs opacity-85">Bekleyen</span>
              <span className="text-sm font-black text-yellow-300">₺{bekleyen.toLocaleString('tr-TR')}</span>
            </div>
            <hr className="border-white/20" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold">Toplam Tutar</span>
              <span className="text-lg font-black">₺{toplam.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* ÖĞRENCİ BİLGİLERİ */}
        <div className="bg-appbg rounded-xl p-3 border-[1.5px] border-border">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Öğrenci Bilgileri</span>
            {!bilgiEdit
              ? <button onClick={handleBilgiDuzenle} className="text-[11px] font-bold text-primary underline">Düzenle</button>
              : <button onClick={() => setBilgiEdit(false)} className="text-[11px] font-bold text-muted underline">İptal</button>
            }
          </div>

          {!bilgiEdit ? (
            <div className="space-y-1.5">
              {[['Ad Soyad', og.ad], ['Sınıf', og.sinif], ['Adres', og.adres || '—'], ['Saatlik Ücret', og.ucret ? `₺${og.ucret}` : '—']].map(([etiket, deger]) => (
                <div key={etiket} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted font-semibold">{etiket}</span>
                  <span className="text-[13px] font-bold text-textmain">{deger}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <div className="flex-[2] flex flex-col gap-0.5">
                  <label className="text-[9px] font-extrabold text-muted uppercase">Ad Soyad</label>
                  <input type="text" value={bfAd} onChange={e => setBfAd(e.target.value)} className={inp} />
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <label className="text-[9px] font-extrabold text-muted uppercase">Sınıf</label>
                  <select value={bfSinif} onChange={e => setBfSinif(e.target.value)} className={inp + ' appearance-none'}>
                    {SINIFLAR.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="flex-[2] flex flex-col gap-0.5">
                  <label className="text-[9px] font-extrabold text-muted uppercase">Adres</label>
                  <input type="text" value={bfAdres} onChange={e => setBfAdres(e.target.value)} placeholder="Mahalle, İlçe..." className={inp} />
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <label className="text-[9px] font-extrabold text-muted uppercase">Ücret ₺</label>
                  <input type="number" value={bfUcret} onChange={e => setBfUcret(e.target.value)} placeholder="500" min="0" className={inp} />
                </div>
              </div>
              <div className="flex gap-1.5 mt-1">
                <button onClick={handleBilgiKaydet} className="flex-1 py-2 rounded-lg bg-success text-white text-xs font-black">💾 Kaydet</button>
                <button onClick={() => setBilgiEdit(false)} className="px-3 py-2 rounded-lg bg-transparent border-[1.5px] border-border text-xs font-black text-muted">✕</button>
              </div>
            </div>
          )}
        </div>

        {/* DERS EKLE */}
        <div className="bg-appbg rounded-xl p-3 border-[1.5px] border-border">
          <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">📅 Ders Kaydı Ekle</div>
          <div className="flex gap-1.5 mb-1.5">
            <div className="flex-[1.5] flex flex-col gap-0.5">
              <label className="text-[9px] font-extrabold text-muted uppercase">Tarih</label>
              <input type="text" value={dkTarih} onChange={e => setDkTarih(e.target.value)} placeholder={new Date().toLocaleDateString('tr-TR')} className={inp} />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <label className="text-[9px] font-extrabold text-muted uppercase">Saat</label>
              <input type="text" value={dkSaat} onChange={e => setDkSaat(e.target.value)} placeholder="14:00" className={inp} />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <label className="text-[9px] font-extrabold text-muted uppercase">Süre</label>
              <select value={dkSure} onChange={e => setDkSure(e.target.value)} className={inp + ' appearance-none'}>
                {SURELER.map(s => <option key={s} value={s}>{s} saat</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleDersEkle} className="w-full py-2 rounded-lg bg-primary text-white text-xs font-black">➕ DERS EKLE</button>
          {og.ucret
            ? <div className="text-[11px] text-muted mt-1.5 font-semibold">Saatlik ücret: ₺{og.ucret} — süreye göre otomatik hesaplanır</div>
            : <div className="text-[11px] text-accent mt-1.5 font-semibold">⚠️ Önce bilgilerden saatlik ücret girin</div>
          }
        </div>

        {/* DERS GEÇMİŞİ */}
        <div>
          <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
            Ders Geçmişi ({dersler.length})
          </div>
          {dersler.length === 0 ? (
            <div className="text-center py-5 text-muted text-sm font-semibold">
              <div className="text-2xl mb-1">📅</div>Henüz ders kaydı yok
            </div>
          ) : (
            [...dersler].reverse().map((d) => (
              <div key={d.id} className="fade-in-up bg-white border-[1.5px] border-border rounded-xl p-2.5 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-extrabold text-textmain">
                      {d.tarih}{d.saat ? ` · ${d.saat}` : ''}
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">{d.sure} saat</div>
                  </div>
                  <div className="text-[13px] font-extrabold text-primary whitespace-nowrap">
                    ₺{(d.ucret || 0).toLocaleString('tr-TR')}
                  </div>
                  <button
                    onClick={() => odemeToggle(og.id, d.id)}
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all
                      ${d.odendi
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                  >
                    {d.odendi ? '✓ Ödendi' : '⏳ Bekliyor'}
                  </button>
                  <button
                    onClick={() => setModalConfig({
                      title: '📅 Dersi Sil',
                      message: 'Bu ders kaydını silmek istediğine emin misin?',
                      onConfirm: () => dersSil(og.id, d.id)
                    })}
                    className="text-muted text-sm pl-1"
                  >✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="h-4" />
      </div>

      {/* MODAL */}
      <ConfirmModal
        visible={!!modalConfig}
        title={modalConfig?.title}
        message={modalConfig?.message}
        onConfirm={() => { modalConfig?.onConfirm(); setModalConfig(null); showToast('🗑️ Silindi') }}
        onCancel={() => setModalConfig(null)}
      />
      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  )
}
