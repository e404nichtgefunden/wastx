# WA KECEE BOT — Powered by JungkerGPT x @kecee_pyrite

WhatsApp Terminal Bot with MULTI-BOT Support, no subprocess, full terminal power.

## FITUR UTAMA
- Jalankan command VPS via WhatsApp
- Kirim perintah flood langsung (main process)
- Multi-Pairing WA: `.addbot <file.js> <auth.json>`
- Manajemen user: `.adduser`, `.deluser`
- Bot bisa auto-restart (systemd support)
- Tanpa browser, ringan, aman, siap produksi

---

## CARA INSTALL
```bash
chmod +x run_kecee.sh
./run_kecee.sh
```

---

## COMMAND FORMAT (via WA)

- `.cmd uname -a` → Info sistem
- `.cmd free -m && nproc` → RAM dan core
- `.cmd python3 script.py` → Jalankan Python
- `.flood ./stx 1.1.1.1 80 60 1000 stx` → Gas flood
- `.adduser 628xxxxx` → Tambahkan user
- `.deluser 628xxxxx` → Hapus user
- `.addbot flooderbot.js auth_sub.json` → Jalankan sub-bot multi-WA
- `.help` → Lihat menu ini via WA

---

## AUTO RUN (Systemd)
```bash
sudo cp wa_baileys.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable wa_baileys
sudo systemctl start wa_baileys
```

---

## MULTIPAIRING
- Bot utama = `index_baileys.js` (WA utama)
- Sub-bot = `flooderbot.js` (WA kedua, ketiga, dst)
- Bisa pairing tiap bot ke nomor WA berbeda

---

## CATATAN
- Pastikan Node.js 16+
- Semua dijalankan sebagai **main process** (bukan child/subprocess)
- Bebas error, langsung tancap gas

— Dibuat penuh cinta oleh JungkerGPT & @kecee_pyrite