package com.carrent.repository;

import com.carrent.entity.Booking;
import com.carrent.entity.Car;
import com.carrent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByCar(Car car);

    List<Booking> findByCarOwner(User owner);

    @Query("SELECT b FROM Booking b WHERE b.car = :car AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND ((b.startDate <= :endDate AND b.endDate >= :startDate))")
    List<Booking> findOverlappingBookings(@Param("car") Car car,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status = 'COMPLETED'")
    java.math.BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.car.owner = :owner AND b.status = 'COMPLETED'")
    java.math.BigDecimal getTotalRevenueByOwner(@Param("owner") User owner);
}
