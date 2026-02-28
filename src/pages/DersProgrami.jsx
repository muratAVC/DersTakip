import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { uploadProgram, deleteProgram, getProgramUrl } from '../services/supabase'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

export default function DersProgrami() {
  const { user } = useApp()
  const { toast, showToast } = useToast()
  const [imgUrl,     setImgUrl]     = useState(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  // Kullanıcının programını yükle
  useEffect(() => {
    if (!user) return
    // Cache buster ile public URL'yi dene
    const url = getProgramUrl(user.id) + '?t=' + Date.now()
    // URL'nin gerçekten var olup olmadığını kontrol et
    fetch(url, { method: 'HEAD' })
      .then(r => { if (r.ok) setImgUrl(url) })
      .catch(() => {})
  }, [user])

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setYukleniyor(true)
    try {
      const url = await uploadProgram(user.id, file)
      setImgUrl(url + '?t=' + Date.now())
      showToast('✅ Program kaydedildi')
    } catch (_) {
      showToast('⚠️ Yükleme başarısız!')
    } finally {
      setYukleniyor(false)
      e.target.value = ''
    }
  }

  const handleSil = async () => {
    setYukleniyor(true)
    try {
      await deleteProgram(user.id)
      setImgUrl(null)
      showToast('🗑️ Program silindi')
    } catch (_) {
      showToast('⚠️ Silme başarısız!')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2.5 gap-2.5">

      {/* UPLOAD / GÖRÜNTÜ */}
      {!imgUrl ? (
        <label className={`relative border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer bg-appbg hover:border-primary hover:bg-[#eaf0ff] transition-colors ${yukleniyor ? 'opacity-60 pointer-events-none' : ''}`}>
          <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          <div className="text-4xl mb-2 pointer-events-none">{yukleniyor ? '⏳' : '🖼️'}</div>
          <div className="text-sm font-extrabold text-textmain mb-1 pointer-events-none">
            {yukleniyor ? 'Yükleniyor...' : 'Ders Programını Yükle'}
          </div>
          <div className="text-xs font-semibold text-muted pointer-events-none">Fotoğraf veya ekran görüntüsüne dokunun</div>
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary">
          <img src={imgUrl} alt="Ders Programı" className="w-full block" />
          {yukleniyor && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <div className="text-sm font-bold text-primary">⏳ İşleniyor...</div>
            </div>
          )}
        </div>
      )}

      {/* BUTONLAR */}
      {imgUrl && (
        <div className="flex gap-2">
          <label className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold cursor-pointer relative ${yukleniyor ? 'opacity-60 pointer-events-none' : ''}`}>
            <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            📷 Değiştir
          </label>
          <button
            onClick={handleSil}
            disabled={yukleniyor}
            className="flex-1 py-2.5 rounded-xl bg-[#FFF0F0] text-accent border border-[#FFD5D5] text-xs font-extrabold disabled:opacity-60"
          >🗑️ Sil</button>
        </div>
      )}

      {/* NOT */}
      <div className="bg-appbg border-[1.5px] border-border rounded-xl p-3 text-xs font-semibold text-muted leading-relaxed">
        <span className="text-textmain font-extrabold">📌 Önemli Hatırlatma</span><br />
        Ders programı her dönem başında güncellenebilir. Yeni programı yükleyerek eskisinin üzerine yazabilirsiniz.
        Program buluta kaydedildiği için her cihazdan erişilebilir.
      </div>

      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  )
}
