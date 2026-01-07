package com.smartcity.energy.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for latest energy reading response
 */
public class EnergyLatestResponse {
    
    private UUID sensorId;
    private BigDecimal kwhUsage;
    private int voltage;
    private Instant recordedAt;

    public EnergyLatestResponse() {}

    public EnergyLatestResponse(UUID sensorId, BigDecimal kwhUsage, int voltage, Instant recordedAt) {
        this.sensorId = sensorId;
        this.kwhUsage = kwhUsage;
        this.voltage = voltage;
        this.recordedAt = recordedAt;
    }

    public UUID getSensorId() {
        return sensorId;
    }

    public void setSensorId(UUID sensorId) {
        this.sensorId = sensorId;
    }

    public BigDecimal getKwhUsage() {
        return kwhUsage;
    }

    public void setKwhUsage(BigDecimal kwhUsage) {
        this.kwhUsage = kwhUsage;
    }

    public int getVoltage() {
        return voltage;
    }

    public void setVoltage(int voltage) {
        this.voltage = voltage;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
    }
}
