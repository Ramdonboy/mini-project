package com.carrent.service;

import com.carrent.dto.BookingDTO;
import com.carrent.dto.BookingRequest;
import com.carrent.dto.BookingSummaryDTO;
import com.carrent.entity.Booking;
import com.carrent.entity.Car;
import com.carrent.entity.User;
import com.carrent.repository.BookingRepository;
import com.carrent.repository.CarRepository;
import com.carrent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.10");

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public BookingSummaryDTO getBookingSummary(Long carId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        Car car = carRepository.findById(carId).orElseThrow(() -> new RuntimeException("Car not found"));
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("End date must be after start date");
        }
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        BigDecimal subtotal = car.getPricePerDay().multiply(BigDecimal.valueOf(days));
        BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax);

        BookingSummaryDTO summary = new BookingSummaryDTO();
        summary.setCarId(car.getId());
        summary.setCarModel(car.getModel());
        summary.setCarBrand(car.getBrand());
        summary.setPricePerDay(car.getPricePerDay());
        summary.setStartDate(startDate);
        summary.setEndDate(endDate);
        summary.setDays(days);
        summary.setSubtotal(subtotal);
        summary.setTax(tax);
        summary.setTotalPrice(total);
        return summary;
    }

    @Transactional
    public BookingDTO createBooking(BookingRequest request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Car car = carRepository.findById(request.getCarId()).orElseThrow(() -> new RuntimeException("Car not found"));

        // ACID: Calculate total in backend - never trust frontend
        BookingSummaryDTO summary = getBookingSummary(request.getCarId(), request.getStartDate(), request.getEndDate());

        // Concurrency control: Check availability within transaction
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(car, request.getStartDate(), request.getEndDate());
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Car is not available for the selected dates");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalPrice(summary.getTotalPrice());
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking = bookingRepository.save(booking);

        return toDTO(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getMyBookings(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsForOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        return bookingRepository.findByCarOwner(owner).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO updateBookingStatus(Long bookingId, String status, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getCar().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Not authorized to update this booking");
        }
        booking.setStatus(Booking.BookingStatus.valueOf(status));
        return toDTO(bookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be cancelled");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingDTO toDTO(Booking booking) {
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
        dto.setDays(ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1);
        return dto;
    }
}
