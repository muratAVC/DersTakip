// ─────────────────────────────────────────
//  JSONBin API Servisi
//  Tüm bulut okuma/yazma işlemleri burada
// ─────────────────────────────────────────

const BIN_ID  = '69a00245ae596e708f4b4ef7'
const API_KEY = '$2a$10$.h.Eu9L2jETnYGXmqSpPK.I9KTeEoQklk/71.pIr.pMbRDxhoFWmO'
const BASE    = `https://api.jsonbin.io/v3/b/${BIN_ID}`

const HEADERS_READ  = { 'X-Master-Key': API_KEY }
const HEADERS_WRITE = { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY }

/** Tüm veriyi JSONBin'den çeker */
export async function fetchData() {
  const res = await fetch(`${BASE}/latest`, { headers: HEADERS_READ })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.record // { notlar, ogrenciler }
}

/** Tüm veriyi JSONBin'e yazar */
export async function saveData(data) {
  const res = await fetch(BASE, {
    method:  'PUT',
    headers: HEADERS_WRITE,
    body:    JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return true
}

// Yerel yedek — internet kesilince buradan okunur
const BACKUP_KEY = 'dersTakipYedek'

export function saveLocalBackup(data) {
  try { localStorage.setItem(BACKUP_KEY, JSON.stringify(data)) } catch (_) {}
}

export function loadLocalBackup() {
  try {
    const raw = localStorage.getItem(BACKUP_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (_) { return null }
}
