package com.carrent.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarDTO {

    private Long id;
    private String model;
    private String brand;
    private String type;
    private String fuelType;
    private String transmission;
    private BigDecimal pricePerDay;
    private String status;
    private Long ownerId;
    private String ownerName;
    private String description;
    private String imageUrl;
}
