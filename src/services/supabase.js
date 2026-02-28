// ─────────────────────────────────────────
//  Supabase Servisi
//  Tüm veritabanı, auth ve storage işlemleri
// ─────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qdpolvvhjcncsfuvvdau.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcG9sdnZoamNuY3NmdXZ2ZGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNTUwNDIsImV4cCI6MjA4NzgzMTA0Mn0.ZgbWhGXsFJmkVecHLIkg113RIC41pUw_ERqVoPH76FM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── AUTH ──────────────────────────────────

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── NOTLAR ───────────────────────────────

export async function fetchNotlar() {
  const { data, error } = await supabase
    .from('notlar')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function insertNot(not) {
  const { data, error } = await supabase
    .from('notlar')
    .insert(not)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateNot(id, changes) {
  const { data, error } = await supabase
    .from('notlar')
    .update(changes)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteNot(id) {
  const { error } = await supabase.from('notlar').delete().eq('id', id)
  if (error) throw error
}

// ── ÖĞRENCİLER ───────────────────────────

export async function fetchOgrenciler() {
  const { data, error } = await supabase
    .from('ogrenciler')
    .select('*, dersler(*)')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function insertOgrenci(og) {
  const { data, error } = await supabase
    .from('ogrenciler')
    .insert(og)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateOgrenci(id, changes) {
  const { data, error } = await supabase
    .from('ogrenciler')
    .update(changes)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteOgrenci(id) {
  const { error } = await supabase.from('ogrenciler').delete().eq('id', id)
  if (error) throw error
}

// ── DERSLER ──────────────────────────────

export async function insertDers(ders) {
  const { data, error } = await supabase
    .from('dersler')
    .insert(ders)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDers(id, changes) {
  const { data, error } = await supabase
    .from('dersler')
    .update(changes)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDers(id) {
  const { error } = await supabase.from('dersler').delete().eq('id', id)
  if (error) throw error
}

// ── STORAGE (Ders Programı Fotoğrafı) ────

export async function uploadProgram(userId, file) {
  const path = `${userId}/ders-programi`
  // Önce varsa sil
  await supabase.storage.from('ders-programi').remove([path])
  const { error } = await supabase.storage
    .from('ders-programi')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('ders-programi').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteProgram(userId) {
  const path = `${userId}/ders-programi`
  const { error } = await supabase.storage.from('ders-programi').remove([path])
  if (error) throw error
}

export function getProgramUrl(userId) {
  const { data } = supabase.storage
    .from('ders-programi')
    .getPublicUrl(`${userId}/ders-programi`)
  return data.publicUrl
}
