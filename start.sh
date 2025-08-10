#!/bin/bash

echo "🚗 Rümoski Plaka Oyunu başlatılıyor..."
echo "Port: 8812"
echo "URL: http://localhost:8812"
echo "Durdurmak için Ctrl+C basın"
echo ""

# Script'in bulunduğu dizine git
cd "$(dirname "$0")"

# Python3 dene
if command -v python3 &> /dev/null; then
    echo "Python3 ile başlatılıyor..."
    python3 -m http.server 8812
# Python dene
elif command -v python &> /dev/null; then
    echo "Python ile başlatılıyor..."
    python -m http.server 8812
# Node.js dene
elif command -v npx &> /dev/null; then
    echo "Node.js ile başlatılıyor..."
    npx --yes serve -p 8812 .
else
    echo "❌ Hata: Python veya Node.js bulunamadı!"
    echo "Lütfen Python3 veya Node.js yükleyin:"
    echo "  - Python: https://python.org"
    echo "  - Node.js: https://nodejs.org"
    exit 1
fi