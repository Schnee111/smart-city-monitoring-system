package com.smartcity.energy.controller;

import com.smartcity.energy.dto.ApiResponse;
import com.smartcity.energy.dto.CreateSensorRequest;
import com.smartcity.energy.dto.UpdateSensorRequest;
import com.smartcity.energy.dto.SensorResponse;
import com.smartcity.energy.service.SensorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sensors")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    /**
     * Register a new sensor
     * POST /api/v1/sensors
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SensorResponse>> createSensor(
            @Valid @RequestBody CreateSensorRequest request) {
        SensorResponse sensor = sensorService.createSensor(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Sensor created successfully", sensor));
    }

    /**
     * Get all sensors (for map markers)
     * GET /api/v1/sensors
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SensorResponse>>> getAllSensors() {
        List<SensorResponse> sensors = sensorService.getAllSensors();
        return ResponseEntity.ok(ApiResponse.success(sensors));
    }

    /**
     * Get sensor by ID
     * GET /api/v1/sensors/{sensorId}
     */
    @GetMapping("/{sensorId}")
    public ResponseEntity<ApiResponse<SensorResponse>> getSensorById(
            @PathVariable UUID sensorId) {
        return sensorService.getSensorById(sensorId)
            .map(sensor -> ResponseEntity.ok(ApiResponse.success(sensor)))
            .orElse(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Sensor not found")));
    }

    /**
     * Get sensors by district
     * GET /api/v1/sensors/district/{districtName}
     */
    @GetMapping("/district/{districtName}")
    public ResponseEntity<ApiResponse<List<SensorResponse>>> getSensorsByDistrict(
            @PathVariable String districtName) {
        List<SensorResponse> sensors = sensorService.getSensorsByDistrict(districtName);
        return ResponseEntity.ok(ApiResponse.success(sensors));
    }

    /**
     * Update sensor status
     * PUT /api/v1/sensors/{sensorId}/status
     */
    @PutMapping("/{sensorId}/status")
    public ResponseEntity<ApiResponse<Void>> updateSensorStatus(
            @PathVariable UUID sensorId,
            @RequestParam String status) {
        if (!sensorService.sensorExists(sensorId)) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Sensor not found"));
        }
        sensorService.updateSensorStatus(sensorId, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated", null));
    }

    /**
     * Update sensor fully
     * PUT /api/v1/sensors/{sensorId}
     */
    @PutMapping("/{sensorId}")
    public ResponseEntity<ApiResponse<SensorResponse>> updateSensor(
            @PathVariable UUID sensorId,
            @Valid @RequestBody UpdateSensorRequest request) {
        if (!sensorService.sensorExists(sensorId)) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Sensor not found"));
        }
        SensorResponse updated = sensorService.updateSensor(sensorId, request);
        return ResponseEntity.ok(ApiResponse.success("Sensor updated", updated));
    }

    /**
     * Delete sensor
     * DELETE /api/v1/sensors/{sensorId}
     */
    @DeleteMapping("/{sensorId}")
    public ResponseEntity<ApiResponse<Void>> deleteSensor(@PathVariable UUID sensorId) {
        if (!sensorService.sensorExists(sensorId)) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Sensor not found"));
        }
        sensorService.deleteSensor(sensorId);
        return ResponseEntity.ok(ApiResponse.success("Sensor deleted", null));
    }
}
