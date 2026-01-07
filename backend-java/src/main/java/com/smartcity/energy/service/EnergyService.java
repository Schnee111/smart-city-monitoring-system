package com.smartcity.energy.service;

import com.smartcity.energy.dto.EnergyIngestRequest;
import com.smartcity.energy.dto.EnergyLatestResponse;
import com.smartcity.energy.model.EnergyLog;
import com.smartcity.energy.repository.EnergyLogRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class EnergyService {

    private final EnergyLogRepository energyLogRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public EnergyService(EnergyLogRepository energyLogRepository, 
                         SimpMessagingTemplate messagingTemplate) {
        this.energyLogRepository = energyLogRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Ingest energy data from simulator (async for high throughput)
     */
    public CompletableFuture<EnergyLog> ingestEnergyData(EnergyIngestRequest request) {
        EnergyLog log = new EnergyLog();
        log.setSensorId(request.getSensorId());
        log.setEventDate(LocalDate.now());
        log.setKwhUsage(request.getKwhUsage());
        log.setVoltage(request.getVoltage());

        // Save asynchronously
        CompletableFuture<EnergyLog> future = energyLogRepository.saveAsync(log);

        // Broadcast to WebSocket subscribers
        future.thenAccept(savedLog -> {
            EnergyLatestResponse response = new EnergyLatestResponse(
                savedLog.getSensorId(),
                savedLog.getKwhUsage(),
                savedLog.getVoltage(),
                savedLog.getRecordedAt()
            );
            messagingTemplate.convertAndSend("/topic/energy/" + savedLog.getSensorId(), response);
            messagingTemplate.convertAndSend("/topic/energy/all", response);
        });

        return future;
    }

    /**
     * Ingest energy data synchronously
     */
    public EnergyLog ingestEnergyDataSync(EnergyIngestRequest request) {
        EnergyLog log = new EnergyLog();
        log.setSensorId(request.getSensorId());
        log.setEventDate(LocalDate.now());
        log.setKwhUsage(request.getKwhUsage());
        log.setVoltage(request.getVoltage());

        EnergyLog saved = energyLogRepository.save(log);

        // Broadcast to WebSocket subscribers
        EnergyLatestResponse response = new EnergyLatestResponse(
            saved.getSensorId(),
            saved.getKwhUsage(),
            saved.getVoltage(),
            saved.getRecordedAt()
        );
        messagingTemplate.convertAndSend("/topic/energy/" + saved.getSensorId(), response);
        messagingTemplate.convertAndSend("/topic/energy/all", response);

        return saved;
    }

    /**
     * Get latest reading for a sensor
     */
    public Optional<EnergyLatestResponse> getLatestReading(UUID sensorId) {
        return energyLogRepository.findLatest(sensorId)
            .map(log -> new EnergyLatestResponse(
                log.getSensorId(),
                log.getKwhUsage(),
                log.getVoltage(),
                log.getRecordedAt()
            ));
    }

    /**
     * Get readings for a sensor on a specific date
     */
    public List<EnergyLatestResponse> getReadingsByDate(UUID sensorId, LocalDate date) {
        return energyLogRepository.findByDate(sensorId, date).stream()
            .map(log -> new EnergyLatestResponse(
                log.getSensorId(),
                log.getKwhUsage(),
                log.getVoltage(),
                log.getRecordedAt()
            ))
            .collect(Collectors.toList());
    }

    /**
     * Calculate daily total for a sensor
     */
    public BigDecimal getDailyTotal(UUID sensorId, LocalDate date) {
        return energyLogRepository.calculateDailyTotal(sensorId, date);
    }

    /**
     * Calculate average voltage for a sensor
     */
    public double getAverageVoltage(UUID sensorId, LocalDate date) {
        return energyLogRepository.calculateAverageVoltage(sensorId, date);
    }
}
