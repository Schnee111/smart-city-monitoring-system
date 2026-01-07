package com.smartcity.energy.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for ingesting energy data from simulator
 */
public class EnergyIngestRequest {
    
    @NotNull(message = "Sensor ID is required")
    private UUID sensorId;
    
    @NotNull(message = "kWh usage is required")
    private BigDecimal kwhUsage;
    
    @NotNull(message = "Voltage is required")
    private Integer voltage;

    public EnergyIngestRequest() {}

    public EnergyIngestRequest(UUID sensorId, BigDecimal kwhUsage, Integer voltage) {
        this.sensorId = sensorId;
        this.kwhUsage = kwhUsage;
        this.voltage = voltage;
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

    public Integer getVoltage() {
        return voltage;
    }

    public void setVoltage(Integer voltage) {
        this.voltage = voltage;
    }
}
