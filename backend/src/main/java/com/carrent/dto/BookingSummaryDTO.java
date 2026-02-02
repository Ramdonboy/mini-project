package com.carrent.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingSummaryDTO {

    private Long carId;
    private String carModel;
    private String carBrand;
    private BigDecimal pricePerDay;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long days;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal totalPrice;
}
