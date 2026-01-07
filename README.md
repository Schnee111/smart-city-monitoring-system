# 🏙️ Smart City Energy Monitoring (SCEM)

**Proyek Mata Kuliah NoSQL - Apache Cassandra**

Sistem pemantauan energi pintar berbasis IoT untuk skala perkotaan (Multi-distrik) dengan teknologi Apache Cassandra sebagai database NoSQL.

## 🎯 Tujuan Proyek

- **SDG 7**: Energi Bersih & Terjangkau
- **SDG 11**: Kota & Pemukiman Berkelanjutan
- Mengelola inventaris sensor (CRUD) dan memvisualisasikan data penggunaan energi time-series secara real-time.

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Database** | Apache Cassandra (Wide-column Store) |
| **Backend** | Java Spring Boot 3 + DataStax Driver 4.x |
| **Frontend** | Next.js 14 + Tailwind CSS + Leaflet.js |
| **Simulator** | Python 3 + Requests |

> ⚠️ **Golden Rule**: TIDAK MENGGUNAKAN ORM. Semua interaksi database menggunakan Raw CQL via `CqlSession` dan `PreparedStatement`.

## 📁 Struktur Proyek

```
smart_city/
├── database/           # CQL scripts untuk inisialisasi Cassandra
├── backend-java/       # Spring Boot REST API
├── frontend-next/      # Next.js Dashboard
├── simulator-python/   # Python data simulator
└── docs/              # Dokumentasi proyek
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Java 17+
- Node.js 18+
- Python 3.8+
- Maven

### 1. Setup Database (Cassandra)

```bash
# Jalankan Cassandra container
docker run --name smart-city-db -p 9042:9042 -d cassandra:latest

# Tunggu ~20 detik, lalu inisialisasi database
docker cp database/init.cql smart-city-db:/init.cql
docker exec -it smart-city-db cqlsh -f /init.cql

# Verifikasi
docker exec -it smart-city-db cqlsh -e "USE smart_city; SELECT * FROM sensors;"
```

### 2. Run Backend (Spring Boot)

```bash
cd backend-java

# Build & Run
mvn clean install
mvn spring-boot:run

# API akan tersedia di http://localhost:8080
```

### 3. Run Frontend (Next.js)

```bash
cd frontend-next

# Install dependencies
npm install

# Run development server
npm run dev

# Dashboard tersedia di http://localhost:3000
```

### 4. Run Simulator (Python)

```bash
cd simulator-python

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed lebih banyak sensors
python scripts/seed_sensors.py

# Jalankan simulator
python scripts/sensor_gen.py
```

## 📡 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/v1/sensors` | GET | Daftar semua sensor |
| `/api/v1/sensors` | POST | Registrasi sensor baru |
| `/api/v1/sensors/{id}` | GET | Detail sensor |
| `/api/v1/energy/ingest` | POST | Ingest data dari simulator |
| `/api/v1/energy/latest/{id}` | GET | Pembacaan terakhir sensor |
| `/api/v1/stats` | GET | Statistik kota keseluruhan |
| `/api/v1/stats/daily/{district}` | GET | Statistik per distrik |

## 📊 Fitur Dashboard

- 🗺️ **Peta Interaktif**: Visualisasi sensor dengan Leaflet.js
- 📈 **Grafik Real-time**: Tren penggunaan energi dengan Recharts
- 🏙️ **Panel Distrik**: Filter berdasarkan area kota
- 📊 **Kartu Statistik**: Total konsumsi, rasio solar, sensor aktif
- 🌙 **Dark Mode**: Tema glassmorphism modern

## 🗄️ Database Schema

```sql
-- Sensors (Metadata)
CREATE TABLE sensors (
    sensor_id uuid PRIMARY KEY,
    district_name text,
    latitude decimal,
    longitude decimal,
    energy_source text,
    status text,
    created_at timestamp
);

-- Energy Logs (Time-Series)
CREATE TABLE energy_logs (
    sensor_id uuid,
    event_date date,
    recorded_at timestamp,
    kwh_usage decimal,
    voltage int,
    PRIMARY KEY ((sensor_id, event_date), recorded_at)
) WITH CLUSTERING ORDER BY (recorded_at DESC);

-- District Profiles
CREATE TABLE district_profiles (
    district_name text PRIMARY KEY,
    population int,
    category text
);
```

## 👥 Tim Pengembang

| Nama | NIM | Role |
|------|-----|------|
| [Nama Anda] | [NIM] | Backend Developer |
| [Nama 2] | [NIM] | Frontend Developer |
| [Nama 3] | [NIM] | Database & Simulator |

## 📝 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah NoSQL.

---

**Smart City Energy Monitoring © 2026**
