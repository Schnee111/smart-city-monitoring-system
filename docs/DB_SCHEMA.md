# Database Schema - Cassandra Raw CQL

**Keyspace:** `smart_city`
**Strategy:** `SimpleStrategy`, `Replication Factor: 1`

## Tables

### 1. sensors (Metadata)
Stores physical sensor information for CRUD operations.
- `sensor_id`: uuid (PRIMARY KEY)
- `district_name`: text
- `latitude`: decimal
- `longitude`: decimal
- `energy_source`: text ('Solar' or 'Grid')
- `status`: text ('Active', 'Maintenance', 'Offline')
- `created_at`: timestamp

### 2. energy_logs (Time-Series)
Stores high-frequency energy data.
- Partition Key: `(sensor_id, event_date)`
- Clustering Key: `recorded_at` (DESC)
- Columns: `kwh_usage` (decimal), `voltage` (int)

### 3. district_profiles (Context)
- `district_name`: text (PRIMARY KEY)
- `population`: int
- `category`: text ('Industrial', 'Residential')