#!/bin/bash

# Rümoski Plaka Oyunu - Arka Plan Çalıştırma Scripti

echo "🚗 Rümoski Plaka Oyunu arka planda başlatılıyor..."

# PID dosyası
PID_FILE="rumoski.pid"

# Eğer zaten çalışıyorsa durdur
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat $PID_FILE)
    if ps -p $OLD_PID > /dev/null 2>&1; then
        echo "⚠️  Oyun zaten çalışıyor (PID: $OLD_PID). Durduruluyor..."
        kill $OLD_PID
        sleep 2
    fi
    rm -f $PID_FILE
fi

# Arka planda başlat
echo "🚀 Oyun başlatılıyor..."

# Python3 ile dene
if command -v python3 &> /dev/null; then
    nohup python3 -m http.server 8812 > rumoski.log 2>&1 &
    echo $! > $PID_FILE
    echo "✅ Python3 ile başlatıldı"
# Python ile dene
elif command -v python &> /dev/null; then
    nohup python -m http.server 8812 > rumoski.log 2>&1 &
    echo $! > $PID_FILE
    echo "✅ Python ile başlatıldı"
# Node.js ile dene
elif command -v npx &> /dev/null; then
    nohup npx serve -p 8812 . > rumoski.log 2>&1 &
    echo $! > $PID_FILE
    echo "✅ Node.js ile başlatıldı"
else
    echo "❌ Hata: Python veya Node.js bulunamadı!"
    exit 1
fi

# Kısa bir bekleme
sleep 3

# Kontrol et
if ps -p $(cat $PID_FILE) > /dev/null 2>&1; then
    echo "🎉 Oyun başarıyla arka planda çalışıyor!"
    echo "🌐 Adres: http://localhost:8812"
    echo "📁 PID: $(cat $PID_FILE)"
    echo "📝 Log dosyası: rumoski.log"
    echo ""
    echo "📋 Yararlı komutlar:"
    echo "  Durdur:     ./stop-background.sh"
    echo "  Durumu gör: ./status-background.sh"
    echo "  Log gör:    tail -f rumoski.log"
else
    echo "❌ Oyun başlatılamadı. Log dosyasını kontrol edin: cat rumoski.log"
    rm -f $PID_FILE
    exit 1
fi