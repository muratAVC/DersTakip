import { useState, useEffect, useCallback } from 'react'

const PROFIL_KEY = 'dersTakipProfil'

export function useProfil() {
  const [profil,    setProfil]    = useState(null)   // null = henüz yüklenmedi
  const [profilHazir, setProfilHazir] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFIL_KEY)
      if (raw) {
        setProfil(JSON.parse(raw))
      } else {
        setProfil(null) // kayıt yok → kurulum ekranı göster
      }
    } catch (_) {
      setProfil(null)
    }
    setProfilHazir(true)
  }, [])

  const profilKaydet = useCallback((yeniProfil) => {
    localStorage.setItem(PROFIL_KEY, JSON.stringify(yeniProfil))
    setProfil(yeniProfil)
  }, [])

  const profilSil = useCallback(() => {
    localStorage.removeItem(PROFIL_KEY)
    setProfil(null)
  }, [])

  return { profil, profilHazir, profilKaydet, profilSil }
}
