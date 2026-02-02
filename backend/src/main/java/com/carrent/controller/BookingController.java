package com.carrent.controller;

import com.carrent.dto.BookingDTO;
import com.carrent.dto.BookingRequest;
import com.carrent.dto.BookingSummaryDTO;
import com.carrent.security.UserPrincipal;
import com.carrent.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/summary")
    public ResponseEntity<BookingSummaryDTO> getSummary(
            @RequestParam Long carId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        return ResponseEntity.ok(bookingService.getBookingSummary(
                carId,
                java.time.LocalDate.parse(startDate),
                java.time.LocalDate.parse(endDate)));
    }

    @PostMapping
    public ResponseEntity<BookingDTO> create(@Valid @RequestBody BookingRequest request,
                                             Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping("/owner")
    public ResponseEntity<List<BookingDTO>> getOwnerBookings(@RequestParam Long ownerId) {
        return ResponseEntity.ok(bookingService.getBookingsForOwner(ownerId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateStatus(@PathVariable Long id,
                                                   @RequestBody Map<String, String> body,
                                                   @RequestParam Long ownerId) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, body.get("status"), ownerId));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromAuth(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Not authenticated");
        }
        return ((UserPrincipal) auth.getPrincipal()).getId();
    }
}
