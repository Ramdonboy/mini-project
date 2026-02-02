package com.carrent.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardStatsDTO {

    private Long totalUsers;
    private Long totalCars;
    private Long totalBookings;
    private BigDecimal totalRevenue;
    private List<FleetDistributionDTO> fleetDistribution;
    private Map<String, Long> bookingCountByStatus;
}
