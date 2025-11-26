# GeoKahoot 🗺️

Türkiye'nin 81 ilini harita üzerinde bularak oynamanız gereken eğlenceli bir coğrafya oyunu. Tek oynarken ya da arkadaşlarınızla rekabetçi bir şekilde oyun oynayabilirsiniz.

## 🎮 Oyun Modları

### 🟢 Kolay Mod (Easy)
- **İpucu:** İl plaka numarası (örneğin 34 = İstanbul, 35 = İzmir)
- **Görev:** Harita üzerinde tıklayarak doğru ili bulun
- **Başlangıç Can:** 3 hayat
- **Puanlama:**
  - 0-20 km: **+20 puan** (mükemmel)
  - 20-60 km: **+10 puan** (iyi)
  - 60-150 km: **+5 puan** (orta)
  - >150 km: **0 puan + can kaybı** (çok uzak)

### 🔴 Zor Mod (Hard)
- **İpucu:** İlin kültürel özellikleri, tarihi ve ünlü yerleri hakkında bilgi
- **Örnek İpucu:** "Pamukkale travertenleri ve antik Hierapolis kenti ile dünya çapında tanınır." → Denizli
- **Başlangıç Can:** 2 hayat
- **Puanlama:** Doğru cevap + bonuslar
  - ⚡ **Hız Bonusu:** 3 saniye içinde = +10 puan, 8 saniye içinde = +5 puan
  - 🔥 **Combo Bonusu:** 3 ard arda doğru = +5 puan, 5 ard arda doğru = +20 puan

## 📁 Dosya Yapısı

```
kahoot/
├── index.html          # Ana sayfa ve oyun arayüzü
├── script.js           # Oyun mantığı ve harita etkileşimleri
├── style.css           # Stil ve tasarım
├── rules.html          # Detaylı oyun kuralları sayfası
├── giriş.jpg           # Giriş sayfası arkaplanı
├── mor.jpg             # Oyun sayfası arkaplanı
└── README.md           # Bu dosya
```

## 🚀 Nasıl Oynanır

### Oyun Kurulumu
1. **Oyuncu Sayısı:** 1-4 arasında oyuncu seçin
2. **İsim Girin:** Her oyuncunun adını yazın
3. **Mod Seçin:** Kolay veya Zor
4. **Zaman Ayarlayın:** Her oyuncu için süre (varsayılan 60 saniye)
5. **Başlayın:** "Oyunu Başlat" butonuna tıklayın

### Oyun Sırası
- İpucu ekranında gösterilen ipucunu okuyun
- Harita üzerinde tıklayarak doğru ili seçin
- Puanınız tıklama konumunun hedefe yakınlığına göre hesaplanır
- **Skip:** Soruyu atlamak için -2 puan ve -1 can kaybedeceksiniz
- **Finish Turn:** Sıranızı erken bitirebilirsiniz

### Oyun Sonu
- Tüm oyuncuların sırası bittikten sonra en yüksek skora sahip oyuncu kazanır
- Final skorunuzu **Puan Tablosu**na kaydedebilirsiniz
- Kayıtlı skorlar tarayıcı depolamasında saklanır

## 🛠️ Teknik Detaylar

### Kültürel İpuçları
- Tüm 81 il için kültürel ipuçları doğrudan `script.js` içine gömülüdür
- Hiçbir dış kaynak veya API çağrısı gerekmez
- **Avantaj:** Çevrimdışı da çalışır, hızlı yükler, CORS sorunları olmaz

### Merkez Noktaları (Centroids)
- Her ilin merkez koordinatları `plateCentroids` tablosunda saklanır
- GeoJSON dosyasına ihtiyaç yoktur
- Oyun GeoJSON olmadan tamamen çalışır

### Puan Sistemi
- Bir harita tıklama en yakın il merkezine göre değerlendirilir
- Uzaklık Haversine formülü ile hesaplanır
- Easy modda: mesafeye dayalı kademeli puanlama
- Hard modda: combo ve hız bonusları uygulanır

## 📖 Kuralları Öğrenin

Detaylı oyun kuralları için oyun içinde **"Kurallar"** butonuna tıklayın veya `rules.html` dosyasını açın.

## 🎯 Strateji İpuçları

- **Türkiye Coğrafyasını Öğrenin:** Bölgelere göre iller nerelerde konumlanıyor
- **Plaka Numaralarını Hatırlayın:** Kolay modda başlarsanız öğrenilir
- **Kültürel Bilgi:** Zor modda ünlü yerleri (Pamukkale, Nemrut, Kapadokya vb.) bilin
- **Hız vs Doğruluk:** Hızlı cevaplar bonus puan verir ama yanlış cevap can kaybettirir
- **Can Yönetimi:** Riskli tahminlerden kaçının; can biterse sıra biter

## 📝 Özellikler

✅ Türkçe arayüz ve kurallar  
✅ Tek ve çok oyuncu desteği  
✅ İki zorluk modu (Kolay & Zor)  
✅ İnteraktif harita (Leaflet + OpenStreetMap)  
✅ Puan tablosu (tarayıcı depolaması)  
✅ Responsive tasarım  
✅ Tamamen istemci tarafında çalışır (sunucu gerekmez)  

## 🌐 Tarayıcı Uyumluluğu

Modern tarayıcılar uyumludur:
- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Safari
- ✅ Microsoft Edge

## 📄 Hakkında

Bu oyun Türkiye'nin coğrafyasını eğlenceli bir şekilde öğrenmek için geliştirilmiştir. Harita verileri **OpenStreetMap** ve **Leaflet.js** tarafından sağlanır.

---

**Eğlenceyle oynayın! 🎮🗺️**
