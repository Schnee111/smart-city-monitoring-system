package com.smartcity.energy.dto;

import java.math.BigDecimal;

/**
 * DTO for district statistics response
 */
public class DistrictStatsResponse {
    
    private String district;
    private BigDecimal totalKwh;
    private BigDecimal solarRatio;
    private int totalSensors;
    private int activeSensors;
    private BigDecimal avgVoltage;

    public DistrictStatsResponse() {}

    public DistrictStatsResponse(String district, BigDecimal totalKwh, BigDecimal solarRatio,
                                  int totalSensors, int activeSensors, BigDecimal avgVoltage) {
        this.district = district;
        this.totalKwh = totalKwh;
        this.solarRatio = solarRatio;
        this.totalSensors = totalSensors;
        this.activeSensors = activeSensors;
        this.avgVoltage = avgVoltage;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public BigDecimal getTotalKwh() {
        return totalKwh;
    }

    public void setTotalKwh(BigDecimal totalKwh) {
        this.totalKwh = totalKwh;
    }

    public BigDecimal getSolarRatio() {
        return solarRatio;
    }

    public void setSolarRatio(BigDecimal solarRatio) {
        this.solarRatio = solarRatio;
    }

    public int getTotalSensors() {
        return totalSensors;
    }

    public void setTotalSensors(int totalSensors) {
        this.totalSensors = totalSensors;
    }

    public int getActiveSensors() {
        return activeSensors;
    }

    public void setActiveSensors(int activeSensors) {
        this.activeSensors = activeSensors;
    }

    public BigDecimal getAvgVoltage() {
        return avgVoltage;
    }

    public void setAvgVoltage(BigDecimal avgVoltage) {
        this.avgVoltage = avgVoltage;
    }
}
