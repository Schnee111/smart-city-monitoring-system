package com.smartcity.energy.model;

/**
 * DistrictProfile Model - Context data for districts
 * Maps to: smart_city.district_profiles table
 */
public class DistrictProfile {
    
    private String districtName;
    private int population;
    private String category;  // 'Industrial', 'Residential', 'Commercial'

    public DistrictProfile() {}

    public DistrictProfile(String districtName, int population, String category) {
        this.districtName = districtName;
        this.population = population;
        this.category = category;
    }

    // Getters and Setters
    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
