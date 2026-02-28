import React, { useState } from 'react'
import { signIn, signUp } from '../services/supabase'

export default function Login() {
  const [mod,      setMod]      = useState('giris') // 'giris' | 'kayit'
  const [email,    setEmail]    = useState('')
  const [sifre,    setSifre]    = useState('')
  const [hata,     setHata]     = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [basarili, setBasarili] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)
    try {
      if (mod === 'giris') {
        await signIn(email, sifre)
        // Auth değişikliği AppContext'te yakalanır, yönlendirme otomatik olur
      } else {
        await signUp(email, sifre)
        setBasarili(true)
      }
    } catch (err) {
      const mesajlar = {
        'Invalid login credentials':     'E-posta veya şifre hatalı.',
        'Email not confirmed':            'E-postanı doğrulamanı bekliyoruz.',
        'User already registered':        'Bu e-posta zaten kayıtlı.',
        'Password should be at least 6 characters': 'Şifre en az 6 karakter olmalı.',
      }
      setHata(mesajlar[err.message] || err.message)
    } finally {
      setYukleniyor(false)
    }
  }

  const inp = "w-full px-4 py-3 rounded-xl border-[1.5px] border-border text-sm font-semibold text-textmain bg-white outline-none focus:border-primary transition-colors"

  return (
    <div className="min-h-screen bg-appbg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">

        {/* LOGO / BAŞLIK */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-black text-textmain">Ders Takip</h1>
          <p className="text-sm text-muted font-semibold mt-1">by Mergen</p>
        </div>

        {/* KART */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">

          {/* SEKME */}
          <div className="flex gap-1 bg-appbg rounded-xl p-1 mb-6">
            {['giris', 'kayit'].map(m => (
              <button
                key={m}
                onClick={() => { setMod(m); setHata(''); setBasarili(false) }}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all
                  ${mod === m ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
              >
                {m === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            ))}
          </div>

          {/* KAYIT BAŞARILI */}
          {basarili ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-sm font-bold text-textmain mb-1">Kaydın tamamlandı!</p>
              <p className="text-xs text-muted font-semibold">
                <strong>{email}</strong> adresine doğrulama maili gönderdik.
                Maili onayladıktan sonra giriş yapabilirsin.
              </p>
              <button
                onClick={() => { setMod('giris'); setBasarili(false) }}
                className="mt-4 text-primary text-sm font-bold underline"
              >Giriş yap →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-wide block mb-1">E-posta</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@email.com" required
                  className={inp}
                />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-muted uppercase tracking-wide block mb-1">Şifre</label>
                <input
                  type="password" value={sifre} onChange={e => setSifre(e.target.value)}
                  placeholder="En az 6 karakter" required minLength={6}
                  className={inp}
                />
              </div>

              {hata && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg">
                  ⚠️ {hata}
                </div>
              )}

              <button
                type="submit" disabled={yukleniyor}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primaryL text-white font-extrabold text-sm disabled:opacity-60 transition-opacity mt-2"
              >
                {yukleniyor ? '⏳ Bekle...' : mod === 'giris' ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-4 font-semibold">
          Verileriniz güvenli şekilde saklanır.
        </p>
      </div>
    </div>
  )
}
