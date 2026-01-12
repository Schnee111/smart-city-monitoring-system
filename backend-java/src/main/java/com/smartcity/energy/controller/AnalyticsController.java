package com.smartcity.energy.controller;

import com.smartcity.energy.dto.ApiResponse;
import com.smartcity.energy.service.EnergyAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {
    private final EnergyAnalyticsService service;
    public AnalyticsController(EnergyAnalyticsService service) { this.service = service; }

    @GetMapping("/solar-savings")
    public ResponseEntity<ApiResponse<Long>> getSavings() {
        long savings = service.calculateTodaySavingsInRp();
        return ResponseEntity.ok(ApiResponse.success(savings));
    }

    @GetMapping("/cost-realtime")
    public ResponseEntity<ApiResponse<Long>> getRealtimeCost() {
        long cost = service.getRealtimeGridCostInRp();
        return ResponseEntity.ok(ApiResponse.success(cost));
    }

    @GetMapping("/emissions-realtime")
    public ResponseEntity<ApiResponse<Double>> getRealtimeEmissions() {
        double emissions = service.getRealtimeEmissionsKg();
        return ResponseEntity.ok(ApiResponse.success(emissions));
    }

    // simple breakdown for pie: { grid: <kwh>, solar: <kwh> }
    @GetMapping("/energy-breakdown")
    public ResponseEntity<ApiResponse<Object>> getBreakdown() {
        String date = java.time.LocalDate.now(java.time.ZoneId.of("Asia/Jakarta")).toString();
        double[] totals = service.getDailyTotals(date);
        double grid = totals[0];
        double solar = totals[1];
        var payload = java.util.Map.of("date", date, "gridKwh", grid, "solarKwh", solar);
        return ResponseEntity.ok(ApiResponse.success(payload));
    }
}
