package com.smartcity.energy.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Sensor Model - Represents a physical energy sensor
 * Maps to: smart_city.sensors table
 */
public class Sensor {
    
    private UUID sensorId;
    private String districtName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String energySource;  // 'Solar' or 'Grid'
    private String status;        // 'Active', 'Maintenance', 'Offline'
    private Instant createdAt;

    public Sensor() {}

    public Sensor(UUID sensorId, String districtName, BigDecimal latitude, BigDecimal longitude,
                  String energySource, String status, Instant createdAt) {
        this.sensorId = sensorId;
        this.districtName = districtName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.energySource = energySource;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getSensorId() {
        return sensorId;
    }

    public void setSensorId(UUID sensorId) {
        this.sensorId = sensorId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getEnergySource() {
        return energySource;
    }

    public void setEnergySource(String energySource) {
        this.energySource = energySource;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
