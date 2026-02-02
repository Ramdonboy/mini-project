package com.carrent.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarRequest {

    @NotBlank
    private String model;

    @NotBlank
    private String brand;

    @NotBlank
    private String type;

    @NotBlank
    private String fuelType;

    @NotBlank
    private String transmission;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal pricePerDay;

    private String description;
    private String imageUrl;
}
