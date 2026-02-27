import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { fetchData, saveData, saveLocalBackup, loadLocalBackup } from '../services/jsonbin'

// ─────────────────────────────────────────
//  Global State — Context API
//  Tüm sayfalarda erişilecek veriler burada
// ─────────────────────────────────────────

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [notlar,     setNotlar]     = useState([])
  const [ogrenciler, setOgrenciler] = useState([])
  const [syncDurum,  setSyncDurum]  = useState('bos') // 'bos' | 'yukleniyor' | 'tamam' | 'hata'

  const debounceRef = useRef(null)

  // ── Veri Yükle ──
  const yukle = useCallback(async () => {
    setSyncDurum('yukleniyor')
    try {
      const data = await fetchData()
      const n = data.notlar     || []
      const o = data.ogrenciler || []
      setNotlar(n)
      setOgrenciler(o)
      saveLocalBackup({ notlar: n, ogrenciler: o })
      setSyncDurum('tamam')
      setTimeout(() => setSyncDurum('bos'), 2000)
    } catch (_) {
      const backup = loadLocalBackup()
      if (backup) {
        setNotlar(backup.notlar     || [])
        setOgrenciler(backup.ogrenciler || [])
      }
      setSyncDurum('hata')
      setTimeout(() => setSyncDurum('bos'), 3000)
    }
  }, [])

  // ── Debounced Save ── (600ms — art arda değişikliklerde tek istek)
  const save = useCallback((yeniNotlar, yeniOgrenciler) => {
    const n = yeniNotlar     ?? notlar
    const o = yeniOgrenciler ?? ogrenciler
    saveLocalBackup({ notlar: n, ogrenciler: o })
    setSyncDurum('yukleniyor')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        await saveData({ notlar: n, ogrenciler: o })
        setSyncDurum('tamam')
        setTimeout(() => setSyncDurum('bos'), 2000)
      } catch (_) {
        setSyncDurum('hata')
        setTimeout(() => setSyncDurum('bos'), 3000)
      }
    }, 600)
  }, [notlar, ogrenciler])

  // ── Not İşlemleri ──
  const notEkle = useCallback((not) => {
    const yeni = [...notlar, { ...not, id: Date.now(), tarih: new Date().toLocaleDateString('tr-TR') }]
    setNotlar(yeni)
    save(yeni, null)
  }, [notlar, save])

  const notGuncelle = useCallback((id, guncelleme) => {
    const yeni = notlar.map(n => n.id === id ? { ...n, ...guncelleme } : n)
    setNotlar(yeni)
    save(yeni, null)
  }, [notlar, save])

  const notSil = useCallback((id) => {
    const yeni = notlar.filter(n => n.id !== id)
    setNotlar(yeni)
    save(yeni, null)
  }, [notlar, save])

  // ── Öğrenci İşlemleri ──
  const ogEkle = useCallback((og) => {
    const yeni = [...ogrenciler, { ...og, id: Date.now(), adres: '', ucret: 0, dersler: [] }]
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  const ogGuncelle = useCallback((id, guncelleme) => {
    const yeni = ogrenciler.map(o => o.id === id ? { ...o, ...guncelleme } : o)
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  const ogSil = useCallback((id) => {
    const yeni = ogrenciler.filter(o => o.id !== id)
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  // ── Ders İşlemleri (öğrenciye bağlı) ──
  const dersEkle = useCallback((ogId, ders) => {
    const yeni = ogrenciler.map(o =>
      o.id === ogId
        ? { ...o, dersler: [...(o.dersler || []), { ...ders, id: Date.now(), odendi: false }] }
        : o
    )
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  const dersSil = useCallback((ogId, dersId) => {
    const yeni = ogrenciler.map(o =>
      o.id === ogId
        ? { ...o, dersler: (o.dersler || []).filter(d => d.id !== dersId) }
        : o
    )
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  const odemeToggle = useCallback((ogId, dersId) => {
    const yeni = ogrenciler.map(o =>
      o.id === ogId
        ? { ...o, dersler: (o.dersler || []).map(d => d.id === dersId ? { ...d, odendi: !d.odendi } : d) }
        : o
    )
    setOgrenciler(yeni)
    save(null, yeni)
  }, [ogrenciler, save])

  return (
    <AppContext.Provider value={{
      notlar, ogrenciler, syncDurum,
      yukle,
      notEkle, notGuncelle, notSil,
      ogEkle, ogGuncelle, ogSil,
      dersEkle, dersSil, odemeToggle,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
