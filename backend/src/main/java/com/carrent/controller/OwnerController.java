package com.carrent.controller;

import com.carrent.dto.DashboardStatsDTO;
import com.carrent.security.UserPrincipal;
import com.carrent.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboard(Authentication auth) {
        Long ownerId = ((UserPrincipal) auth.getPrincipal()).getId();
        return ResponseEntity.ok(ownerService.getOwnerDashboard(ownerId));
    }
}
