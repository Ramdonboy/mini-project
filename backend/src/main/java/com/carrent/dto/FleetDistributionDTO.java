package com.carrent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FleetDistributionDTO {

    private String type;
    private Long count;
}
