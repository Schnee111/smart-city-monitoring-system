package com.smartcity.energy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * DTO for updating a sensor
 */
public class UpdateSensorRequest {
    
    @NotBlank(message = "District name is required")
    private String districtName;
    
    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;
    
    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;
    
    @NotBlank(message = "Energy source is required")
    private String energySource;
    
    @NotBlank(message = "Status is required")
    private String status;

    public UpdateSensorRequest() {}

    public UpdateSensorRequest(String districtName, BigDecimal latitude, 
                               BigDecimal longitude, String energySource, String status) {
        this.districtName = districtName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.energySource = energySource;
        this.status = status;
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
}
