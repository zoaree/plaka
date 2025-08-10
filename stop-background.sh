#!/bin/bash

# Rümoski Plaka Oyunu - Arka Plan Durdurma Scripti

echo "🛑 Rümoski Plaka Oyunu durduruluyor..."

PID_FILE="rumoski.pid"

if [ -f "$PID_FILE" ]; then
    PID=$(cat $PID_FILE)
    
    if ps -p $PID > /dev/null 2>&1; then
        echo "🔄 Process durduruluyor (PID: $PID)..."
        kill $PID
        
        # Process'in tamamen durmasını bekle
        sleep 3
        
        # Hala çalışıyorsa zorla durdur
        if ps -p $PID > /dev/null 2>&1; then
            echo "⚡ Zorla durduruluyor..."
            kill -9 $PID
            sleep 1
        fi
        
        if ! ps -p $PID > /dev/null 2>&1; then
            echo "✅ Oyun başarıyla durduruldu"
        else
            echo "❌ Oyun durdurulamadı"
        fi
    else
        echo "⚠️  Process zaten çalışmıyor"
    fi
    
    rm -f $PID_FILE
else
    echo "⚠️  PID dosyası bulunamadı. Oyun çalışmıyor olabilir."
fi

# Port 8812'de çalışan diğer process'leri kontrol et
echo "🔍 Port 8812 kontrol ediliyor..."
PORT_PROCESS=$(lsof -ti:8812 2>/dev/null)

if [ ! -z "$PORT_PROCESS" ]; then
    echo "⚠️  Port 8812'de hala process çalışıyor (PID: $PORT_PROCESS)"
    echo "🔄 Bu process'i de durduruyor..."
    kill $PORT_PROCESS 2>/dev/null
    sleep 2
    
    # Hala çalışıyorsa zorla durdur
    if kill -0 $PORT_PROCESS 2>/dev/null; then
        kill -9 $PORT_PROCESS 2>/dev/null
    fi
fi

echo "🎉 Temizlik tamamlandı!"