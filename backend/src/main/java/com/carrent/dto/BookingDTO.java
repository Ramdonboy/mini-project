package com.carrent.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingDTO {

    private Long id;
    private Long userId;
    private String userName;
    private Long carId;
    private String carModel;
    private String carBrand;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String status;
    private Long days;
}
