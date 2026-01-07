package com.smartcity.energy.repository;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.*;
import com.smartcity.energy.model.Sensor;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Sensor Repository - Raw CQL implementation (NO ORM)
 * Uses PreparedStatement for security and performance
 */
@Repository
public class SensorRepository {

    private final CqlSession session;

    // PreparedStatements for better performance
    private PreparedStatement insertStmt;
    private PreparedStatement selectAllStmt;
    private PreparedStatement selectByIdStmt;
    private PreparedStatement selectByDistrictStmt;
    private PreparedStatement updateStatusStmt;
    private PreparedStatement updateSensorStmt;
    private PreparedStatement deleteStmt;

    public SensorRepository(CqlSession session) {
        this.session = session;
    }

    @PostConstruct
    public void init() {
        // Prepare all statements at startup
        insertStmt = session.prepare(
            "INSERT INTO sensors (sensor_id, district_name, latitude, longitude, energy_source, status, created_at) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        selectAllStmt = session.prepare(
            "SELECT sensor_id, district_name, latitude, longitude, energy_source, status, created_at FROM sensors"
        );

        selectByIdStmt = session.prepare(
            "SELECT sensor_id, district_name, latitude, longitude, energy_source, status, created_at FROM sensors WHERE sensor_id = ?"
        );

        selectByDistrictStmt = session.prepare(
            "SELECT sensor_id, district_name, latitude, longitude, energy_source, status, created_at FROM sensors WHERE district_name = ?"
        );

        updateStatusStmt = session.prepare(
            "UPDATE sensors SET status = ? WHERE sensor_id = ?"
        );

        updateSensorStmt = session.prepare(
            "UPDATE sensors SET district_name = ?, latitude = ?, longitude = ?, energy_source = ?, status = ? WHERE sensor_id = ?"
        );

        deleteStmt = session.prepare(
            "DELETE FROM sensors WHERE sensor_id = ?"
        );
    }

    /**
     * Create a new sensor
     */
    public Sensor save(Sensor sensor) {
        if (sensor.getSensorId() == null) {
            sensor.setSensorId(UUID.randomUUID());
        }
        if (sensor.getCreatedAt() == null) {
            sensor.setCreatedAt(Instant.now());
        }
        if (sensor.getStatus() == null) {
            sensor.setStatus("Active");
        }

        BoundStatement bound = insertStmt.bind(
            sensor.getSensorId(),
            sensor.getDistrictName(),
            sensor.getLatitude(),
            sensor.getLongitude(),
            sensor.getEnergySource(),
            sensor.getStatus(),
            sensor.getCreatedAt()
        );

        session.execute(bound);
        return sensor;
    }

    /**
     * Find all sensors
     */
    public List<Sensor> findAll() {
        ResultSet rs = session.execute(selectAllStmt.bind());
        List<Sensor> sensors = new ArrayList<>();
        
        for (Row row : rs) {
            sensors.add(mapRowToSensor(row));
        }
        
        return sensors;
    }

    /**
     * Find sensor by ID
     */
    public Optional<Sensor> findById(UUID sensorId) {
        BoundStatement bound = selectByIdStmt.bind(sensorId);
        ResultSet rs = session.execute(bound);
        Row row = rs.one();
        
        if (row != null) {
            return Optional.of(mapRowToSensor(row));
        }
        return Optional.empty();
    }

    /**
     * Find sensors by district name
     */
    public List<Sensor> findByDistrict(String districtName) {
        BoundStatement bound = selectByDistrictStmt.bind(districtName);
        ResultSet rs = session.execute(bound);
        List<Sensor> sensors = new ArrayList<>();
        
        for (Row row : rs) {
            sensors.add(mapRowToSensor(row));
        }
        
        return sensors;
    }

    /**
     * Update sensor status
     */
    public void updateStatus(UUID sensorId, String status) {
        BoundStatement bound = updateStatusStmt.bind(status, sensorId);
        session.execute(bound);
    }

    /**
     * Update sensor fully
     */
    public void update(UUID sensorId, String districtName, BigDecimal latitude, 
                       BigDecimal longitude, String energySource, String status) {
        BoundStatement bound = updateSensorStmt.bind(
            districtName, latitude, longitude, energySource, status, sensorId
        );
        session.execute(bound);
    }

    /**
     * Delete sensor by ID
     */
    public void deleteById(UUID sensorId) {
        BoundStatement bound = deleteStmt.bind(sensorId);
        session.execute(bound);
    }

    /**
     * Count sensors by energy source type
     */
    public long countByEnergySource(String energySource) {
        // Using ALLOW FILTERING for simplicity - in production, create a separate table
        String cql = "SELECT COUNT(*) FROM sensors WHERE energy_source = ? ALLOW FILTERING";
        PreparedStatement stmt = session.prepare(cql);
        BoundStatement bound = stmt.bind(energySource);
        ResultSet rs = session.execute(bound);
        Row row = rs.one();
        return row != null ? row.getLong(0) : 0;
    }

    /**
     * Count active sensors
     */
    public long countActiveInDistrict(String districtName) {
        String cql = "SELECT COUNT(*) FROM sensors WHERE district_name = ? AND status = 'Active' ALLOW FILTERING";
        PreparedStatement stmt = session.prepare(cql);
        BoundStatement bound = stmt.bind(districtName);
        ResultSet rs = session.execute(bound);
        Row row = rs.one();
        return row != null ? row.getLong(0) : 0;
    }

    /**
     * Map Cassandra Row to Sensor object
     */
    private Sensor mapRowToSensor(Row row) {
        Sensor sensor = new Sensor();
        sensor.setSensorId(row.getUuid("sensor_id"));
        sensor.setDistrictName(row.getString("district_name"));
        sensor.setLatitude(row.getBigDecimal("latitude"));
        sensor.setLongitude(row.getBigDecimal("longitude"));
        sensor.setEnergySource(row.getString("energy_source"));
        sensor.setStatus(row.getString("status"));
        sensor.setCreatedAt(row.getInstant("created_at"));
        return sensor;
    }
}
