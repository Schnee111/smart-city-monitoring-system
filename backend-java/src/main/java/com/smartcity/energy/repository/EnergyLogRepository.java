package com.smartcity.energy.repository;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.*;
import com.smartcity.energy.model.EnergyLog;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

/**
 * EnergyLog Repository - Raw CQL implementation (NO ORM)
 * Optimized for time-series data with async writes
 */
@Repository
public class EnergyLogRepository {

    private final CqlSession session;

    // PreparedStatements
    private PreparedStatement insertStmt;
    private PreparedStatement selectLatestStmt;
    private PreparedStatement selectByDateRangeStmt;
    private PreparedStatement selectDailyTotalStmt;

    public EnergyLogRepository(CqlSession session) {
        this.session = session;
    }

    @PostConstruct
    public void init() {
        // Insert energy log
        insertStmt = session.prepare(
            "INSERT INTO energy_logs (sensor_id, event_date, recorded_at, kwh_usage, voltage) " +
            "VALUES (?, ?, ?, ?, ?)"
        );

        // Get latest reading (uses clustering order DESC)
        selectLatestStmt = session.prepare(
            "SELECT sensor_id, event_date, recorded_at, kwh_usage, voltage " +
            "FROM energy_logs WHERE sensor_id = ? AND event_date = ? LIMIT 1"
        );

        // Get readings by date range
        selectByDateRangeStmt = session.prepare(
            "SELECT sensor_id, event_date, recorded_at, kwh_usage, voltage " +
            "FROM energy_logs WHERE sensor_id = ? AND event_date = ? " +
            "AND recorded_at >= ? AND recorded_at <= ?"
        );

        // For aggregation queries
        selectDailyTotalStmt = session.prepare(
            "SELECT sensor_id, event_date, recorded_at, kwh_usage, voltage " +
            "FROM energy_logs WHERE sensor_id = ? AND event_date = ?"
        );
    }

    /**
     * Save energy log synchronously
     */
    public EnergyLog save(EnergyLog log) {
        if (log.getRecordedAt() == null) {
            log.setRecordedAt(Instant.now());
        }
        if (log.getEventDate() == null) {
            log.setEventDate(LocalDate.now());
        }

        BoundStatement bound = insertStmt.bind(
            log.getSensorId(),
            log.getEventDate(),
            log.getRecordedAt(),
            log.getKwhUsage(),
            log.getVoltage()
        );

        session.execute(bound);
        return log;
    }

    /**
     * Save energy log asynchronously (for high-throughput ingestion)
     */
    @Async
    public CompletableFuture<EnergyLog> saveAsync(EnergyLog log) {
        if (log.getRecordedAt() == null) {
            log.setRecordedAt(Instant.now());
        }
        if (log.getEventDate() == null) {
            log.setEventDate(LocalDate.now());
        }

        BoundStatement bound = insertStmt.bind(
            log.getSensorId(),
            log.getEventDate(),
            log.getRecordedAt(),
            log.getKwhUsage(),
            log.getVoltage()
        );

        CompletionStage<AsyncResultSet> future = session.executeAsync(bound);
        return future.thenApply(rs -> log).toCompletableFuture();
    }

    /**
     * Get the latest reading for a sensor
     */
    public Optional<EnergyLog> findLatest(UUID sensorId) {
        LocalDate today = LocalDate.now();
        BoundStatement bound = selectLatestStmt.bind(sensorId, today);
        ResultSet rs = session.execute(bound);
        Row row = rs.one();

        if (row != null) {
            return Optional.of(mapRowToEnergyLog(row));
        }

        // Try yesterday if no data today
        LocalDate yesterday = today.minusDays(1);
        bound = selectLatestStmt.bind(sensorId, yesterday);
        rs = session.execute(bound);
        row = rs.one();

        if (row != null) {
            return Optional.of(mapRowToEnergyLog(row));
        }

        return Optional.empty();
    }

    /**
     * Get readings for a sensor on a specific date
     */
    public List<EnergyLog> findByDate(UUID sensorId, LocalDate date) {
        BoundStatement bound = selectDailyTotalStmt.bind(sensorId, date);
        ResultSet rs = session.execute(bound);
        List<EnergyLog> logs = new ArrayList<>();

        for (Row row : rs) {
            logs.add(mapRowToEnergyLog(row));
        }

        return logs;
    }

    /**
     * Get readings within a time range on a specific date
     */
    public List<EnergyLog> findByDateRange(UUID sensorId, LocalDate date, 
                                            Instant startTime, Instant endTime) {
        BoundStatement bound = selectByDateRangeStmt.bind(sensorId, date, startTime, endTime);
        ResultSet rs = session.execute(bound);
        List<EnergyLog> logs = new ArrayList<>();

        for (Row row : rs) {
            logs.add(mapRowToEnergyLog(row));
        }

        return logs;
    }

    /**
     * Calculate total kWh for a sensor on a specific date
     */
    public BigDecimal calculateDailyTotal(UUID sensorId, LocalDate date) {
        List<EnergyLog> logs = findByDate(sensorId, date);
        return logs.stream()
            .map(EnergyLog::getKwhUsage)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calculate average voltage for a sensor on a specific date
     */
    public double calculateAverageVoltage(UUID sensorId, LocalDate date) {
        List<EnergyLog> logs = findByDate(sensorId, date);
        if (logs.isEmpty()) return 0;
        
        return logs.stream()
            .mapToInt(EnergyLog::getVoltage)
            .average()
            .orElse(0);
    }

    /**
     * Map Cassandra Row to EnergyLog object
     */
    private EnergyLog mapRowToEnergyLog(Row row) {
        EnergyLog log = new EnergyLog();
        log.setSensorId(row.getUuid("sensor_id"));
        log.setEventDate(row.getLocalDate("event_date"));
        log.setRecordedAt(row.getInstant("recorded_at"));
        log.setKwhUsage(row.getBigDecimal("kwh_usage"));
        log.setVoltage(row.getInt("voltage"));
        return log;
    }
}
