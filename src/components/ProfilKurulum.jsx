import React, { useState } from 'react'
import config from '../config'

export default function ProfilKurulum({ mevcutProfil, onKaydet, onKapat }) {
  const [ad,    setAd]    = useState(mevcutProfil?.ad    || '')
  const [brans, setBrans] = useState(mevcutProfil?.brans || '')
  const [hata,  setHata]  = useState('')

  const ilkKurulum = !mevcutProfil

  const handleKaydet = () => {
    if (!ad.trim())  { setHata('Adınızı girmelisiniz.'); return }
    if (!brans)      { setHata('Branşınızı seçmelisiniz.'); return }
    onKaydet({ ad: ad.trim(), brans })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-end justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[400px] modal-up overflow-hidden">

        {/* Başlık */}
        <div className="bg-gradient-to-r from-primary to-primaryL px-5 pt-5 pb-6">
          <div className="text-2xl mb-1">{ilkKurulum ? '👋' : '✏️'}</div>
          <div className="text-white font-black text-lg">
            {ilkKurulum ? 'Hoş Geldiniz!' : 'Profili Düzenle'}
          </div>
          <div className="text-white/70 text-xs font-semibold mt-0.5">
            {ilkKurulum
              ? 'Başlamadan önce birkaç bilgi alalım.'
              : 'Bilgilerinizi güncelleyin.'}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Ad */}
          <div>
            <label className="text-[10px] font-extrabold text-muted uppercase tracking-wide block mb-1.5">
              Adınız
            </label>
            <input
              type="text"
              value={ad}
              onChange={e => { setAd(e.target.value); setHata('') }}
              placeholder="Adınızı girin"
              maxLength={50}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-border text-sm font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Branş */}
          <div>
            <label className="text-[10px] font-extrabold text-muted uppercase tracking-wide block mb-1.5">
              Branş
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {config.branslar.map(b => (
                <button
                  key={b}
                  onClick={() => { setBrans(b); setHata('') }}
                  className={`py-2 px-2 rounded-xl text-[11px] font-extrabold border-[1.5px] transition-all text-center
                    ${brans === b
                      ? 'bg-primary border-primary text-white'
                      : 'bg-appbg border-border text-muted hover:border-primary/40'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Hata */}
          {hata && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg">
              ⚠️ {hata}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex gap-2 pt-1">
            {!ilkKurulum && (
              <button
                onClick={onKapat}
                className="flex-1 py-3 rounded-xl font-extrabold text-sm text-muted bg-appbg border border-border"
              >İptal</button>
            )}
            <button
              onClick={handleKaydet}
              className="flex-1 py-3 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-primary to-primaryL"
            >
              {ilkKurulum ? '🚀 Başla' : '💾 Kaydet'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
