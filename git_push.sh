#!/bin/bash

echo "[*] Inisialisasi Git Repo..."
cd /root/wa_kecee_bot || exit

git init
git remote add origin https://github.com/e404nichtgefunden/wastx.git
git checkout -b main

echo "[*] Menambahkan semua file..."
git add .

echo "[*] Commit..."
git commit -m "Initial commit by JungkerGPT x @kecee_pyrite"

echo "[*] Push ke GitHub..."
git push -u origin main