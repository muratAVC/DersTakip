// ─────────────────────────────────────────
//  UYGULAMA KONFİGÜRASYONU
//  Değiştirmek istediğin sabit metinler
//  hep burada — başka dosyaya dokunma!
// ─────────────────────────────────────────

const config = {
  // Uygulama adı ve üretici
  appName:  'Ders Takip',
  producer: 'M. AVCI',

  // Ders Programı sekmesindeki bilgilendirme mesajı
  programNotu: ` Bu uygulamacık çok sayıda sınıfa ders anlatan ve hangi sınıfta en son ne anlattığını unutan bir öğretmene yardım için yazıldı. İlk kullanımda sınıfı ve konuyu gir buluta kaydetsin bir daha unutma(tabiki kaydedersen). Güle Güle kullanın M.AVCI`,

  // Sınıf seçenekleri (Konu Takip + Öğrenci formlarında kullanılır)
  siniflar: ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf', 'Mezun'],

  // Ders süresi seçenekleri (Öğrenci detay sayfasında)
  sureler: ['1', '1.5', '2', '2.5', '3'],

  // Branş seçenekleri (profil kurulumunda)
  branslar: [
    'Matematik', 'Fizik', 'Kimya', 'Biyoloji',
    'Türkçe', 'Edebiyat', 'Tarih', 'Coğrafya',
    'İngilizce', 'Almanca', 'Fransızca',
    'Felsefe', 'Din Kültürü', 'Beden Eğitimi',
    'Bilişim', 'Müzik', 'Görsel Sanatlar', 'Diğer',
  ],
}

export default config
