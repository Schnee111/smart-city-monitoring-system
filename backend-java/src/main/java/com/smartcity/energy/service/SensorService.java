package com.smartcity.energy.service;

import com.smartcity.energy.dto.*;
import com.smartcity.energy.model.Sensor;
import com.smartcity.energy.repository.EnergyLogRepository;
import com.smartcity.energy.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SensorService {

    private final SensorRepository sensorRepository;
    private final EnergyLogRepository energyLogRepository;

    public SensorService(SensorRepository sensorRepository, EnergyLogRepository energyLogRepository) {
        this.sensorRepository = sensorRepository;
        this.energyLogRepository = energyLogRepository;
    }

    /**
     * Create a new sensor
     */
    public SensorResponse createSensor(CreateSensorRequest request) {
        Sensor sensor = new Sensor();
        sensor.setDistrictName(request.getDistrictName());
        sensor.setLatitude(request.getLatitude());
        sensor.setLongitude(request.getLongitude());
        sensor.setEnergySource(request.getEnergySource());
        
        Sensor saved = sensorRepository.save(sensor);
        return toSensorResponse(saved);
    }

    /**
     * Get all sensors with their latest readings
     */
    public List<SensorResponse> getAllSensors() {
        return sensorRepository.findAll().stream()
            .map(this::toSensorResponseWithLatest)
            .collect(Collectors.toList());
    }

    /**
     * Get sensor by ID
     */
    public Optional<SensorResponse> getSensorById(UUID sensorId) {
        return sensorRepository.findById(sensorId)
            .map(this::toSensorResponseWithLatest);
    }

    /**
     * Get sensors by district
     */
    public List<SensorResponse> getSensorsByDistrict(String districtName) {
        return sensorRepository.findByDistrict(districtName).stream()
            .map(this::toSensorResponseWithLatest)
            .collect(Collectors.toList());
    }

    /**
     * Update sensor status
     */
    public void updateSensorStatus(UUID sensorId, String status) {
        sensorRepository.updateStatus(sensorId, status);
    }

    /**
     * Update sensor fully
     */
    public SensorResponse updateSensor(UUID sensorId, UpdateSensorRequest request) {
        sensorRepository.update(
            sensorId,
            request.getDistrictName(),
            request.getLatitude(),
            request.getLongitude(),
            request.getEnergySource(),
            request.getStatus()
        );
        return getSensorById(sensorId).orElse(null);
    }

    /**
     * Delete sensor
     */
    public void deleteSensor(UUID sensorId) {
        sensorRepository.deleteById(sensorId);
    }

    /**
     * Check if sensor exists
     */
    public boolean sensorExists(UUID sensorId) {
        return sensorRepository.findById(sensorId).isPresent();
    }

    /**
     * Convert Sensor to SensorResponse
     */
    private SensorResponse toSensorResponse(Sensor sensor) {
        return new SensorResponse(
            sensor.getSensorId(),
            sensor.getDistrictName(),
            sensor.getLatitude(),
            sensor.getLongitude(),
            sensor.getEnergySource(),
            sensor.getStatus()
        );
    }

    /**
     * Convert Sensor to SensorResponse with latest reading
     */
    private SensorResponse toSensorResponseWithLatest(Sensor sensor) {
        SensorResponse response = toSensorResponse(sensor);
        
        // Fetch latest energy reading
        energyLogRepository.findLatest(sensor.getSensorId())
            .ifPresent(log -> {
                EnergyLatestResponse latest = new EnergyLatestResponse(
                    log.getSensorId(),
                    log.getKwhUsage(),
                    log.getVoltage(),
                    log.getRecordedAt()
                );
                response.setLatestReading(latest);
            });
        
        return response;
    }
}
