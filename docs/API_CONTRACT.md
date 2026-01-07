# API Contract - Spring Boot to Next.js

**Base URL:** `/api/v1`

## Endpoints

### [GET] /sensors
- **Description**: Returns all sensors for Leaflet map markers.
- **Response**: `Array<{sensor_id: UUID, latitude: Decimal, longitude: Decimal, status: String}>`

### [POST] /energy/ingest
- **Description**: Ingest data from Python simulator.
- **Body**: `{ "sensor_id": UUID, "kwh_usage": Decimal, "voltage": Int }`

### [GET] /stats/daily/{district}
- **Description**: Get aggregated energy data for charts.
- **Response**: `{ "district": String, "total_kwh": Decimal, "solar_ratio": Decimal }`

### [GET] /energy/latest/{sensor_id}
- **Description**: Returns the most recent reading for a specific sensor.
- **Query Logic**: `SELECT * FROM energy_logs WHERE sensor_id = ? AND event_date = ? LIMIT 1` (Optimized for Cassandra clustering order).