# 🚗 Rümoski - Plaka Tahmin Oyunu

Modern, animasyonlu ve mobil uyumlu Türkiye plaka tahmin oyunu.

## 🎮 Özellikler

- **81 İl Tamamı**: Türkiye'nin tüm 81 ilinin plaka kodlarını öğren
- **Basit Arayüz**: Sadece isim gir ve oyna
- **Mobil Uyumlu**: Telefon, tablet ve bilgisayarda mükemmel çalışır
- **Animasyonlar**: Güzel geçiş efektleri ve confetti kutlaması
- **Skor Tablosu**: En yüksek skorları kaydet ve karşılaştır
- **Tema Desteği**: Karanlık/aydınlık tema geçişi
- **Öğretici**: Bazı şehirler için bilgilendirici ipuçları

## 🚀 Hızlı Başlangıç

### Windows
```bash
# Çift tıklayarak çalıştır
start.bat
```

### Linux/macOS
```bash
# Terminal'de çalıştır
./start.sh
```

### Manuel Başlatma
```bash
# Python ile
python -m http.server 8812

# Node.js ile
npx serve -p 8812 .
```

Oyun http://localhost:8812 adresinde açılacak.

## 🎯 Nasıl Oynanır

1. **İsim Gir**: Oyuna başlamadan önce ismini yaz
2. **Plaka Tahmin Et**: Gösterilen plaka kodunun hangi şehre ait olduğunu tahmin et
3. **Puan Kazan**: Her doğru cevap 10 puan + 3 saniye bonus
4. **Tamamla**: 81 ili bitir veya süre dolana kadar devam et

## 📁 Proje Yapısı

```
plaka/
├── index.html      # Ana HTML dosyası
├── style.css       # CSS stilleri ve animasyonlar
├── script.js       # Oyun mantığı ve etkileşimler
├── data.js         # İl verileri ve ayarlar
├── start.bat       # Windows başlatma scripti
├── start.sh        # Linux/macOS başlatma scripti
└── README.md       # Bu dosya
```

## 🛠️ Teknolojiler

- **Vanilla JavaScript**: Framework kullanmadan saf JS
- **CSS3**: Modern animasyonlar ve responsive tasarım
- **HTML5**: Semantik yapı
- **LocalStorage**: Skor kaydetme
- **Canvas API**: Confetti animasyonu

## 🎨 Özelleştirme

### Tema Değiştirme
Sağ üst köşedeki 🌙/☀️ butonuyla tema değiştirebilirsin.

### Süre Ayarlama
`script.js` dosyasında `timeLeft: 120` değerini değiştir.

### Yeni İpuçları Ekleme
`data.js` dosyasındaki `FACTS` dizisine yeni bilgiler ekle.

## 📱 Mobil Uyumluluk

- Responsive tasarım
- Touch-friendly butonlar
- Mobil klavye desteği
- Optimized performans

## 🏆 Skor Sistemi

- Her doğru cevap: **10 puan**
- Zaman bonusu: **+3 saniye**
- Maksimum bonus: **20 saniye**
- Skorlar tarayıcıda saklanır

## 🤝 Katkıda Bulunma

1. Projeyi fork'la
2. Feature branch oluştur (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerini commit'le (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'ini push'la (`git push origin feature/yeni-ozellik`)
5. Pull Request oluştur

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Rümoski Ekibi** - Modern web oyunları geliştiriyoruz.

---

⭐ Beğendiysen yıldız vermeyi unutma!