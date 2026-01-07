# Smart City Energy Simulator (Python)

Simulator untuk mengirim data energi random ke backend Spring Boot.

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Edit file `.env` untuk menyesuaikan konfigurasi:
```
API_BASE_URL=http://localhost:8080/api/v1
INTERVAL_SECONDS=5
```

## Usage

### 1. Seed Sensors (Optional)
Jika belum ada sensor di database:
```bash
python scripts/seed_sensors.py
```

### 2. Run Simulator
```bash
python scripts/sensor_gen.py
```

## Output
Simulator akan menampilkan:
- Jumlah sensor yang terdeteksi
- Data energi yang dikirim setiap interval
- Status pengiriman (success/failed)

## Requirements
- Python 3.8+
- Backend Spring Boot harus running di `http://localhost:8080`
- Database Cassandra harus sudah diinisialisasi
