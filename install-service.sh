#!/bin/bash

# Rümoski Plaka Oyunu Servis Kurulum Scripti

echo "🚗 Rümoski Plaka Oyunu Servis Kurulumu Başlıyor..."

# Mevcut dizini al
CURRENT_DIR=$(pwd)

# Service dosyasını güncelle
sed "s|/home/kadiroski/Desktop/plaka|$CURRENT_DIR|g" rumoski.service > rumoski-updated.service

# Service dosyasını sistem dizinine kopyala
echo "📁 Servis dosyası kopyalanıyor..."
sudo cp rumoski-updated.service /etc/systemd/system/rumoski.service

# Systemd'yi yeniden yükle
echo "🔄 Systemd yeniden yükleniyor..."
sudo systemctl daemon-reload

# Servisi etkinleştir (boot'ta otomatik başlasın)
echo "✅ Servis etkinleştiriliyor..."
sudo systemctl enable rumoski.service

# Servisi başlat
echo "🚀 Servis başlatılıyor..."
sudo systemctl start rumoski.service

# Servis durumunu kontrol et
echo "📊 Servis durumu:"
sudo systemctl status rumoski.service --no-pager

echo ""
echo "🎉 Kurulum tamamlandı!"
echo "🌐 Oyun şu adreste çalışıyor: http://localhost:8812"
echo ""
echo "📋 Yararlı komutlar:"
echo "  Servisi durdur:    sudo systemctl stop rumoski"
echo "  Servisi başlat:    sudo systemctl start rumoski"
echo "  Servisi yeniden başlat: sudo systemctl restart rumoski"
echo "  Servis durumu:     sudo systemctl status rumoski"
echo "  Servisi kaldır:    sudo systemctl disable rumoski && sudo rm /etc/systemd/system/rumoski.service"

# Geçici dosyayı temizle
rm rumoski-updated.service