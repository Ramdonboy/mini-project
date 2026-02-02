package com.carrent.controller;

import com.carrent.dto.CarDTO;
import com.carrent.dto.CarRequest;
import com.carrent.dto.FleetDistributionDTO;
import com.carrent.security.UserPrincipal;
import com.carrent.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @GetMapping("/browse")
    public ResponseEntity<List<CarDTO>> browse(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(carService.browseCars(type, brand, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CarDTO>> getMyCars(Authentication auth) {
        Long ownerId = getOwnerId(auth);
        return ResponseEntity.ok(carService.getCarsByOwner(ownerId));
    }

    @PostMapping
    public ResponseEntity<CarDTO> create(@Valid @RequestBody CarRequest request, Authentication auth) {
        Long ownerId = getOwnerId(auth);
        return ResponseEntity.ok(carService.createCar(request, ownerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> update(@PathVariable Long id,
                                         @Valid @RequestBody CarRequest request,
                                         Authentication auth) {
        Long ownerId = getOwnerId(auth);
        return ResponseEntity.ok(carService.updateCar(id, request, ownerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        Long ownerId = getOwnerId(auth);
        carService.deleteCar(id, ownerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fleet-distribution")
    public ResponseEntity<List<FleetDistributionDTO>> getFleetDistribution(
            @RequestParam(required = false) Long ownerId, Authentication auth) {
        UserPrincipal principal = auth != null && auth.getPrincipal() instanceof UserPrincipal
                ? (UserPrincipal) auth.getPrincipal() : null;
        if (ownerId != null && principal != null) {
            return ResponseEntity.ok(carService.getFleetDistributionByOwner(ownerId));
        }
        if (principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_OWNER"))) {
            return ResponseEntity.ok(carService.getFleetDistributionByOwner(principal.getId()));
        }
        return ResponseEntity.ok(carService.getFleetDistribution());
    }

    private Long getOwnerId(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Not authenticated");
        }
        return ((UserPrincipal) auth.getPrincipal()).getId();
    }
}
