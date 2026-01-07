package com.smartcity.energy.controller;

import com.smartcity.energy.dto.ApiResponse;
import com.smartcity.energy.dto.DistrictStatsResponse;
import com.smartcity.energy.model.DistrictProfile;
import com.smartcity.energy.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    /**
     * Get city-wide statistics
     * GET /api/v1/stats
     */
    @GetMapping
    public ResponseEntity<ApiResponse<DistrictStatsResponse>> getCityStats() {
        DistrictStatsResponse stats = statsService.getCityStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get statistics for a specific district
     * GET /api/v1/stats/daily/{district}
     */
    @GetMapping("/daily/{district}")
    public ResponseEntity<ApiResponse<DistrictStatsResponse>> getDistrictStats(
            @PathVariable String district) {
        DistrictStatsResponse stats = statsService.getDistrictStats(district);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Get all district profiles
     * GET /api/v1/stats/districts
     */
    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<DistrictProfile>>> getAllDistricts() {
        List<DistrictProfile> districts = statsService.getAllDistricts();
        return ResponseEntity.ok(ApiResponse.success(districts));
    }
}
