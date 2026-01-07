frontend-next/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Route group untuk UI utama
│   │   ├── page.tsx        # Dashboard Overview
│   │   └── map/            # Halaman Peta Interaktif
│   ├── api/                # Route handler (jika diperlukan)
│   └── layout.tsx          # Main Layout (Sidebar & Nav)
├── components/             # Komponen UI (Map, Charts, Tables)
│   ├── map/                # Leaflet components
│   └── ui/                 # Reusable components (Tailwind)
├── lib/                    # Fungsi utilitas (fetcher, formatters)
├── types/                  # TypeScript interfaces (mengacu API_CONTRACT.md)
└── tailwind.config.js