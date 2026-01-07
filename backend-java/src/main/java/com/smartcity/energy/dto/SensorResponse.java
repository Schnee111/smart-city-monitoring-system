package com.smartcity.energy.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for sensor response (used in map markers)
 */
public class SensorResponse {
    
    private UUID sensorId;
    private String districtName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String energySource;
    private String status;
    private EnergyLatestResponse latestReading;

    public SensorResponse() {}

    public SensorResponse(UUID sensorId, String districtName, BigDecimal latitude, 
                          BigDecimal longitude, String energySource, String status) {
        this.sensorId = sensorId;
        this.districtName = districtName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.energySource = energySource;
        this.status = status;
    }

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

    public EnergyLatestResponse getLatestReading() {
        return latestReading;
    }

    public void setLatestReading(EnergyLatestResponse latestReading) {
        this.latestReading = latestReading;
    }
}
