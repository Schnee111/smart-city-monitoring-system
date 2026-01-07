package com.smartcity.energy.service;

import com.smartcity.energy.dto.DistrictStatsResponse;
import com.smartcity.energy.model.DistrictProfile;
import com.smartcity.energy.model.Sensor;
import com.smartcity.energy.repository.DistrictProfileRepository;
import com.smartcity.energy.repository.EnergyLogRepository;
import com.smartcity.energy.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class StatsService {

    private final SensorRepository sensorRepository;
    private final EnergyLogRepository energyLogRepository;
    private final DistrictProfileRepository districtProfileRepository;

    public StatsService(SensorRepository sensorRepository,
                        EnergyLogRepository energyLogRepository,
                        DistrictProfileRepository districtProfileRepository) {
        this.sensorRepository = sensorRepository;
        this.energyLogRepository = energyLogRepository;
        this.districtProfileRepository = districtProfileRepository;
    }

    /**
     * Get aggregated statistics for a district
     */
    public DistrictStatsResponse getDistrictStats(String districtName) {
        List<Sensor> sensors = sensorRepository.findByDistrict(districtName);
        
        if (sensors.isEmpty()) {
            return new DistrictStatsResponse(
                districtName,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                0, 0,
                BigDecimal.ZERO
            );
        }

        LocalDate today = LocalDate.now();
        BigDecimal totalKwh = BigDecimal.ZERO;
        double totalVoltage = 0;
        int voltageCount = 0;
        int solarCount = 0;
        int activeSensors = 0;

        for (Sensor sensor : sensors) {
            // Sum daily kWh
            BigDecimal dailyTotal = energyLogRepository.calculateDailyTotal(sensor.getSensorId(), today);
            totalKwh = totalKwh.add(dailyTotal);

            // Average voltage
            double avgVoltage = energyLogRepository.calculateAverageVoltage(sensor.getSensorId(), today);
            if (avgVoltage > 0) {
                totalVoltage += avgVoltage;
                voltageCount++;
            }

            // Count solar sensors
            if ("Solar".equalsIgnoreCase(sensor.getEnergySource())) {
                solarCount++;
            }

            // Count active sensors
            if ("Active".equalsIgnoreCase(sensor.getStatus())) {
                activeSensors++;
            }
        }

        // Calculate solar ratio
        BigDecimal solarRatio = sensors.size() > 0 
            ? BigDecimal.valueOf(solarCount)
                .divide(BigDecimal.valueOf(sensors.size()), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        // Calculate average voltage
        BigDecimal avgVoltage = voltageCount > 0 
            ? BigDecimal.valueOf(totalVoltage / voltageCount)
                .setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        return new DistrictStatsResponse(
            districtName,
            totalKwh.setScale(2, RoundingMode.HALF_UP),
            solarRatio.setScale(2, RoundingMode.HALF_UP),
            sensors.size(),
            activeSensors,
            avgVoltage
        );
    }

    /**
     * Get city-wide statistics
     */
    public DistrictStatsResponse getCityStats() {
        List<Sensor> allSensors = sensorRepository.findAll();
        
        if (allSensors.isEmpty()) {
            return new DistrictStatsResponse(
                "All Districts",
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                0, 0,
                BigDecimal.ZERO
            );
        }

        LocalDate today = LocalDate.now();
        BigDecimal totalKwh = BigDecimal.ZERO;
        double totalVoltage = 0;
        int voltageCount = 0;
        int solarCount = 0;
        int activeSensors = 0;

        for (Sensor sensor : allSensors) {
            BigDecimal dailyTotal = energyLogRepository.calculateDailyTotal(sensor.getSensorId(), today);
            totalKwh = totalKwh.add(dailyTotal);

            double avgVoltage = energyLogRepository.calculateAverageVoltage(sensor.getSensorId(), today);
            if (avgVoltage > 0) {
                totalVoltage += avgVoltage;
                voltageCount++;
            }

            if ("Solar".equalsIgnoreCase(sensor.getEnergySource())) {
                solarCount++;
            }

            if ("Active".equalsIgnoreCase(sensor.getStatus())) {
                activeSensors++;
            }
        }

        BigDecimal solarRatio = allSensors.size() > 0 
            ? BigDecimal.valueOf(solarCount)
                .divide(BigDecimal.valueOf(allSensors.size()), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        BigDecimal avgVoltage = voltageCount > 0 
            ? BigDecimal.valueOf(totalVoltage / voltageCount)
                .setScale(2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        return new DistrictStatsResponse(
            "All Districts",
            totalKwh.setScale(2, RoundingMode.HALF_UP),
            solarRatio.setScale(2, RoundingMode.HALF_UP),
            allSensors.size(),
            activeSensors,
            avgVoltage
        );
    }

    /**
     * Get all district profiles
     */
    public List<DistrictProfile> getAllDistricts() {
        return districtProfileRepository.findAll();
    }

    /**
     * Get district profile by name
     */
    public Optional<DistrictProfile> getDistrictProfile(String districtName) {
        return districtProfileRepository.findByName(districtName);
    }
}
