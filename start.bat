@echo off
echo Rümoski Plaka Oyunu başlatılıyor...
echo Port: 8812
echo URL: http://localhost:8812

cd /d "%~dp0"

python -m http.server 8812 2>nul || (
    py -m http.server 8812 2>nul || (
        echo Python bulunamadı! Node.js deneniyor...
        npx --yes serve -p 8812 . 2>nul || (
            echo Hata: Python veya Node.js bulunamadı!
            echo Lütfen Python veya Node.js yükleyin.
            pause
            exit /b 1
        )
    )
)