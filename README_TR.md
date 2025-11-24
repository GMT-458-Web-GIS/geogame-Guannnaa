# GeoKahoot (Türkiye) — Kılavuz

Bu küçük web oyunu, oyunculardan Leaflet tabanlı harita üzerinde Türkiye illerini bulmalarını istiyor.

Oyun Modları

- `Easy` (Kolay): İpucu olarak ilin plaka numarası gösterilir (örn. İstanbul için `34`). Oyuncu haritada ilgili bölgeye tıklar; puanlar tıklanan noktanın hedef merkeze olan uzaklığına göre verilir.
- `Hard` (Zor): İpucu olarak ilin kısa kültürel/ansiklopedik açıklaması gösterilir; oyuncu doğru ili bulmaya çalışır. Kültürel ipuçları `script.js` içerisine gömülüdür.

Önemli Dosyalar

- `index.html` — Ana sayfa ve kullanıcı arayüzü.
- `script.js` — Oyun mantığı ve harita etkileşimleri.
- `style.css` — Stil dosyası.

Yerelde Çalıştırma (Windows PowerShell)

1. Proje kök dizininde basit bir HTTP sunucusu başlatın (tarayıcı üzerinden `fetch` ve varlıklar düzgün çalışsın):

```powershell
python -m http.server 8000
```

2. Tarayıcıda oyunu açın:

```
http://localhost:8000/
```

Notlar

- Uygulama artık dışa bağımlı bir GeoJSON dosyasına ihtiyaç duymaz; `plateCentroids` adlı iç tablodan koordinatlar kullanılır.
- Kültürel ipuçları doğrudan `script.js` içine gömülüdür; ayrı bir `data` dosyası gerekli değildir.

Sorun Giderme

- Eğer `fetch` ile ilgili hatalar görüyorsanız, uygulamayı `http://localhost:8000/` üzerinden açtığınızdan emin olun (doğrudan `file://` ile açmayın).

İleri Adımlar

- İsterseniz kurallara kaynak notu ekleyebilirim (ör. "Kaynak: Wikipedia (tr)").
- Hard modun zorluk seviyesini (ör. kabul edilebilir mesafe) değiştirmek isterseniz, yardımcı olurum.

Keyifli oyunlar! Hangi diğer değişiklikleri yapmamı istersiniz?
