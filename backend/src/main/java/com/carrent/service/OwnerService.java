package com.carrent.service;

import com.carrent.dto.DashboardStatsDTO;
import com.carrent.dto.FleetDistributionDTO;
import com.carrent.entity.User;
import com.carrent.repository.BookingRepository;
import com.carrent.repository.CarRepository;
import com.carrent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getOwnerDashboard(Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalCars(carRepository.findByOwner(owner).size());
        stats.setTotalBookings(bookingRepository.findByCarOwner(owner).size());
        stats.setTotalRevenue(bookingRepository.getTotalRevenueByOwner(owner) != null ?
                bookingRepository.getTotalRevenueByOwner(owner) : BigDecimal.ZERO);
        stats.setFleetDistribution(carRepository.countByTypeForOwner(owner).stream()
                .map(row -> new FleetDistributionDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList()));
        stats.setBookingCountByStatus(
                bookingRepository.findByCarOwner(owner).stream()
                        .collect(Collectors.groupingBy(b -> b.getStatus().name(), Collectors.counting())));
        stats.setTotalUsers(null);
        return stats;
    }
}
