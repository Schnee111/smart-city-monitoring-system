package com.smartcity.energy.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * EnergyLog Model - Represents time-series energy data
 * Maps to: smart_city.energy_logs table
 */
public class EnergyLog {
    
    private UUID sensorId;
    private LocalDate eventDate;
    private Instant recordedAt;
    private BigDecimal kwhUsage;
    private int voltage;

    public EnergyLog() {}

    public EnergyLog(UUID sensorId, LocalDate eventDate, Instant recordedAt, 
                     BigDecimal kwhUsage, int voltage) {
        this.sensorId = sensorId;
        this.eventDate = eventDate;
        this.recordedAt = recordedAt;
        this.kwhUsage = kwhUsage;
        this.voltage = voltage;
    }

    // Getters and Setters
    public UUID getSensorId() {
        return sensorId;
    }

    public void setSensorId(UUID sensorId) {
        this.sensorId = sensorId;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
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
}
