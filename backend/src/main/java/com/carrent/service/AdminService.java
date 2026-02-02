package com.carrent.service;

import com.carrent.dto.BookingDTO;
import com.carrent.dto.CarDTO;
import com.carrent.dto.DashboardStatsDTO;
import com.carrent.dto.FleetDistributionDTO;
import com.carrent.dto.UserDTO;
import com.carrent.entity.Booking;
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
public class AdminService {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final BookingRepository bookingRepository;
    private final CarService carService;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCars(carRepository.count());
        stats.setTotalBookings(bookingRepository.count());
        stats.setTotalRevenue(bookingRepository.getTotalRevenue() != null ?
                bookingRepository.getTotalRevenue() : BigDecimal.ZERO);
        stats.setFleetDistribution(carRepository.countByType().stream()
                .map(row -> new FleetDistributionDTO((String) row[0], (Long) row[1]))
                .collect(Collectors.toList()));
        stats.setBookingCountByStatus(
                bookingRepository.findAll().stream()
                        .collect(Collectors.groupingBy(b -> b.getStatus().name(), Collectors.counting())));
        return stats;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toUserDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream().map(carService::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toBookingDTO).collect(Collectors.toList());
    }

    private UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        return dto;
    }

    private BookingDTO toBookingDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserName(booking.getUser().getFullName());
        dto.setCarId(booking.getCar().getId());
        dto.setCarModel(booking.getCar().getModel());
        dto.setCarBrand(booking.getCar().getBrand());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus().name());
        dto.setDays(java.time.temporal.ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1);
        return dto;
    }
}
