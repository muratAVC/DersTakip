import React, { useState, useEffect } from 'react'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'

const PROGRAM_KEY = 'dersProgramiResim'

export default function DersProgrami() {
  const [imgSrc, setImgSrc] = useState(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem(PROGRAM_KEY)
    if (saved) setImgSrc(saved)
  }, [])

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      try {
        localStorage.setItem(PROGRAM_KEY, dataUrl)
        setImgSrc(dataUrl)
        showToast('✅ Program kaydedildi')
      } catch (_) {
        showToast('⚠️ Resim çok büyük!')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSil = () => {
    localStorage.removeItem(PROGRAM_KEY)
    setImgSrc(null)
    showToast('🗑️ Program silindi')
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-2.5 gap-2.5">

      {/* UPLOAD ALANI */}
      {!imgSrc ? (
        <label className="relative border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer bg-appbg hover:border-primary hover:bg-[#eaf0ff] transition-colors">
          <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          <div className="text-4xl mb-2 pointer-events-none">🖼️</div>
          <div className="text-sm font-extrabold text-textmain mb-1 pointer-events-none">Ders Programını Yükle</div>
          <div className="text-xs font-semibold text-muted pointer-events-none">Fotoğraf veya ekran görüntüsüne dokunun</div>
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border-2 border-primary">
          <img src={imgSrc} alt="Ders Programı" className="w-full block" />
        </div>
      )}

      {/* BUTONLAR */}
      {imgSrc && (
        <div className="flex gap-2">
          <label className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold cursor-pointer relative">
            <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            📷 Değiştir
          </label>
          <button
            onClick={handleSil}
            className="flex-1 py-2.5 rounded-xl bg-[#FFF0F0] text-accent border border-[#FFD5D5] text-xs font-extrabold"
          >🗑️ Sil</button>
        </div>
      )}

      {/* NOT */}
      <div className="bg-appbg border-[1.5px] border-border rounded-xl p-3 text-xs font-semibold text-muted leading-relaxed">
        <span className="text-textmain font-extrabold">📌 Önemli Hatırlatma</span><br />
        Bu uygulamacık çok sayıda sınıfa ders anlatan ve hangi sınıfta en son ne anlattığını unutan bir öğretmene yardım için yazıldı. İlk kullanımda sınıfı ve konuyu gir buluta kaydetsin bir daha unutma(tabiki kaydedersen). Güle Güle kullanın M.AVCI
      </div>

      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  )
}
