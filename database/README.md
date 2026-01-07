# Database Setup - Apache Cassandra

## Prerequisites
- Docker installed on your machine

## Quick Start

### 1. Run Cassandra Container
```bash
docker run --name smart-city-db -p 9042:9042 -d cassandra:latest
```

### 2. Wait for Cassandra to Start (about 30-60 seconds)
```bash
docker logs smart-city-db
```
Look for: "Starting listening for CQL clients"

### 3. Initialize Database
```bash
# Copy init script to container
docker cp init.cql smart-city-db:/init.cql

# Execute initialization
docker exec -it smart-city-db cqlsh -f /init.cql
```

### 4. Verify Setup
```bash
docker exec -it smart-city-db cqlsh -e "USE smart_city; SELECT * FROM sensors;"
```

## Useful Commands

### Access CQL Shell
```bash
docker exec -it smart-city-db cqlsh
```

### Check Tables
```sql
USE smart_city;
DESCRIBE TABLES;
```

### View Sensor Data
```sql
SELECT * FROM sensors;
SELECT * FROM district_profiles;
SELECT * FROM energy_logs LIMIT 10;
```

### Stop/Start Container
```bash
docker stop smart-city-db
docker start smart-city-db
```

### Remove Container (Data will be lost)
```bash
docker rm -f smart-city-db
```
