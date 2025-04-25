#!/bin/bash

echo "[*] Setup autoboot via crontab..."
CRONCMD="cd /root/wa_kecee_bot && npm start"
CRONLINE="@reboot ${CRONCMD}"

( crontab -l 2>/dev/null | grep -v -F "$CRONLINE" ; echo "$CRONLINE" ) | crontab -

echo "[+] Bot akan otomatis jalan saat VPS boot!"