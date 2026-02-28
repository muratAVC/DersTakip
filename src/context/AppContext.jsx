import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  supabase,
  onAuthChange,
  fetchNotlar, insertNot, updateNot, deleteNot,
  fetchOgrenciler, insertOgrenci, updateOgrenci, deleteOgrenci,
  insertDers, updateDers, deleteDers,
} from '../services/supabase'

// ─────────────────────────────────────────
//  Global State — Supabase + Auth + Realtime
// ─────────────────────────────────────────

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user,       setUser]       = useState(undefined) // undefined = henüz bilinmiyor
  const [notlar,     setNotlar]     = useState([])
  const [ogrenciler, setOgrenciler] = useState([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [syncDurum,  setSyncDurum]  = useState('bos')

  // ── Auth değişikliğini dinle ──────────────────
  useEffect(() => {
    const { data: { subscription } } = onAuthChange((u) => {
      setUser(u)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Kullanıcı girince veriyi yükle ───────────
  useEffect(() => {
    if (user) {
      yukle()
      const unsub = realtimeAbone()
      return unsub
    } else if (user === null) {
      setNotlar([])
      setOgrenciler([])
    }
  }, [user])

  // ── Veri Yükle ───────────────────────────────
  const yukle = useCallback(async () => {
    setYukleniyor(true)
    try {
      const [n, o] = await Promise.all([fetchNotlar(), fetchOgrenciler()])
      setNotlar(n)
      setOgrenciler(o)
    } catch (e) {
      console.error('Yükleme hatası:', e)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  // ── Realtime Abonelikler ──────────────────────
  const realtimeAbone = useCallback(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notlar' },
        payload => setNotlar(prev => [payload.new, ...prev]))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notlar' },
        payload => setNotlar(prev => prev.map(n => n.id === payload.new.id ? payload.new : n)))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notlar' },
        payload => setNotlar(prev => prev.filter(n => n.id !== payload.old.id)))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ogrenciler' }, yukle)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dersler' }, yukle)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [yukle])

  // ── Sync badge yardımcısı ─────────────────────
  const withSync = useCallback(async (fn) => {
    setSyncDurum('yukleniyor')
    try {
      const result = await fn()
      setSyncDurum('tamam')
      setTimeout(() => setSyncDurum('bos'), 2000)
      return result
    } catch (e) {
      setSyncDurum('hata')
      setTimeout(() => setSyncDurum('bos'), 3000)
      throw e
    }
  }, [])

  // ── NOT İŞLEMLERİ ────────────────────────────
  const notEkle = useCallback(async (not) => {
    await withSync(() => insertNot({
      ...not,
      user_id: user.id,
      tarih: new Date().toLocaleDateString('tr-TR'),
    }))
  }, [user, withSync])

  const notGuncelle = useCallback(async (id, changes) => {
    await withSync(() => updateNot(id, changes))
  }, [withSync])

  const notSil = useCallback(async (id) => {
    await withSync(() => deleteNot(id))
  }, [withSync])

  // ── ÖĞRENCİ İŞLEMLERİ ───────────────────────
  const ogEkle = useCallback(async (og) => {
    await withSync(() => insertOgrenci({ ...og, user_id: user.id, adres: '', ucret: 0 }))
    await yukle()
  }, [user, withSync, yukle])

  const ogGuncelle = useCallback(async (id, changes) => {
    await withSync(() => updateOgrenci(id, changes))
    await yukle()
  }, [withSync, yukle])

  const ogSil = useCallback(async (id) => {
    await withSync(() => deleteOgrenci(id))
    await yukle()
  }, [withSync, yukle])

  // ── DERS İŞLEMLERİ ───────────────────────────
  const dersEkle = useCallback(async (ogId, ders) => {
    await withSync(() => insertDers({ ...ders, ogrenci_id: ogId, user_id: user.id }))
    await yukle()
  }, [user, withSync, yukle])

  const dersSil = useCallback(async (_ogId, dersId) => {
    await withSync(() => deleteDers(dersId))
    await yukle()
  }, [withSync, yukle])

  const odemeToggle = useCallback(async (ogId, dersId) => {
    const og   = ogrenciler.find(o => o.id === ogId)
    const ders = og?.dersler?.find(d => d.id === dersId)
    if (!ders) return
    await withSync(() => updateDers(dersId, { odendi: !ders.odendi }))
    await yukle()
  }, [ogrenciler, withSync, yukle])

  return (
    <AppContext.Provider value={{
      user, yukleniyor,
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
