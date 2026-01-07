package com.smartcity.energy.controller;

import com.smartcity.energy.dto.ApiResponse;
import com.smartcity.energy.dto.EnergyIngestRequest;
import com.smartcity.energy.dto.EnergyLatestResponse;
import com.smartcity.energy.model.EnergyLog;
import com.smartcity.energy.service.EnergyService;
import com.smartcity.energy.service.SensorService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/energy")
public class EnergyController {

    private final EnergyService energyService;
    private final SensorService sensorService;

    public EnergyController(EnergyService energyService, SensorService sensorService) {
        this.energyService = energyService;
        this.sensorService = sensorService;
    }

    /**
     * Ingest energy data from simulator
     * POST /api/v1/energy/ingest
     */
    @PostMapping("/ingest")
    public ResponseEntity<ApiResponse<EnergyLatestResponse>> ingestEnergy(
            @Valid @RequestBody EnergyIngestRequest request) {
        
        // Validate sensor exists
        if (!sensorService.sensorExists(request.getSensorId())) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Sensor not found: " + request.getSensorId()));
        }

        EnergyLog log = energyService.ingestEnergyDataSync(request);
        
        EnergyLatestResponse response = new EnergyLatestResponse(
            log.getSensorId(),
            log.getKwhUsage(),
            log.getVoltage(),
            log.getRecordedAt()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Energy data ingested", response));
    }

    /**
     * Get latest reading for a sensor
     * GET /api/v1/energy/latest/{sensorId}
     */
    @GetMapping("/latest/{sensorId}")
    public ResponseEntity<ApiResponse<EnergyLatestResponse>> getLatestReading(
            @PathVariable UUID sensorId) {
        return energyService.getLatestReading(sensorId)
            .map(reading -> ResponseEntity.ok(ApiResponse.success(reading)))
            .orElse(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("No readings found for sensor")));
    }

    /**
     * Get readings for a specific date
     * GET /api/v1/energy/history/{sensorId}?date=2024-01-01
     */
    @GetMapping("/history/{sensorId}")
    public ResponseEntity<ApiResponse<List<EnergyLatestResponse>>> getReadingsByDate(
            @PathVariable UUID sensorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        if (date == null) {
            date = LocalDate.now();
        }
        
        List<EnergyLatestResponse> readings = energyService.getReadingsByDate(sensorId, date);
        return ResponseEntity.ok(ApiResponse.success(readings));
    }
}
