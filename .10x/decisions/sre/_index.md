# SRE — Index

## Kondisi [DISCOVERED 2026-10-29]
- Reliability: retry 2× + timeout 10 dtk ke Supabase pada API project; site-settings fallback ke default; 503 terkontrol.
- Tidak ada monitoring error/uptime atau RUM Core Web Vitals.
- Single point of failure: Supabase (DB + Storage + image transform). Tidak ada cache halaman → outage Supabase = halaman publik error/kosong.
- Rekomendasi: Vercel Speed Insights, ISR/SWR halaman publik (juga meredam outage), alert sederhana uptime.
