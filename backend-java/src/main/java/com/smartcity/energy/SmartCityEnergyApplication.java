package com.smartcity.energy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmartCityEnergyApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCityEnergyApplication.class, args);
    }
}
