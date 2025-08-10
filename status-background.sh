#!/bin/bash

# Rümoski Plaka Oyunu - Durum Kontrol Scripti

echo "📊 Rümoski Plaka Oyunu Durum Raporu"
echo "=================================="

PID_FILE="rumoski.pid"

# PID dosyası kontrolü
if [ -f "$PID_FILE" ]; then
    PID=$(cat $PID_FILE)
    echo "📁 PID Dosyası: Mevcut (PID: $PID)"
    
    # Process kontrolü
    if ps -p $PID > /dev/null 2>&1; then
        echo "✅ Durum: ÇALIŞIYOR"
        echo "🕐 Başlama Zamanı: $(ps -o lstart= -p $PID)"
        echo "💾 Bellek Kullanımı: $(ps -o rss= -p $PID | awk '{print $1/1024 " MB"}')"
        echo "⏱️  CPU Süresi: $(ps -o time= -p $PID)"
    else
        echo "❌ Durum: DURDURULMUŞ (PID dosyası mevcut ama process çalışmıyor)"
    fi
else
    echo "📁 PID Dosyası: Yok"
    echo "❌ Durum: DURDURULMUŞ"
fi

echo ""

# Port kontrolü
echo "🌐 Port 8812 Kontrolü:"
PORT_CHECK=$(lsof -ti:8812 2>/dev/null)
if [ ! -z "$PORT_CHECK" ]; then
    echo "✅ Port 8812: KULLANILIYOR (PID: $PORT_CHECK)"
    
    # Hangi komutla çalışıyor
    COMMAND=$(ps -o comm= -p $PORT_CHECK 2>/dev/null)
    echo "🔧 Komut: $COMMAND"
    
    # URL testi
    if curl -s http://localhost:8812 > /dev/null 2>&1; then
        echo "🌍 Web Erişimi: BAŞARILI"
        echo "🔗 URL: http://localhost:8812"
    else
        echo "🌍 Web Erişimi: BAŞARISIZ"
    fi
else
    echo "❌ Port 8812: BOŞ"
fi

echo ""

# Log dosyası kontrolü
if [ -f "rumoski.log" ]; then
    echo "📝 Log Dosyası: Mevcut"
    echo "📏 Boyut: $(du -h rumoski.log | cut -f1)"
    echo "🕐 Son Güncelleme: $(stat -c %y rumoski.log)"
    echo ""
    echo "📋 Son 5 Log Satırı:"
    echo "-------------------"
    tail -5 rumoski.log 2>/dev/null || echo "Log okunamadı"
else
    echo "📝 Log Dosyası: Yok"
fi

echo ""
echo "=================================="

# Özet
if [ -f "$PID_FILE" ] && ps -p $(cat $PID_FILE) > /dev/null 2>&1; then
    echo "🎉 ÖZET: Oyun aktif olarak çalışıyor!"
    echo "🌐 Oyuna erişim: http://localhost:8812"
elif [ ! -z "$PORT_CHECK" ]; then
    echo "⚠️  ÖZET: Port kullanılıyor ama PID dosyası yok"
    echo "🔧 Manuel olarak başlatılmış olabilir"
else
    echo "❌ ÖZET: Oyun çalışmıyor"
    echo "🚀 Başlatmak için: ./run-background.sh"
fi