package com.ausyexpo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ausyexpo.model.Transportation;
import com.ausyexpo.service.TransportationService;

@RestController
@RequestMapping("/api/transportation")
@CrossOrigin(origins = "*")
public class TransportationController {

    @Autowired
    private TransportationService transportationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> getAllTransportation() {
        try {
            List<Transportation> transportation = transportationService.getAllTransportation();
            return ResponseEntity.ok(transportation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Transportation> getTransportationById(@PathVariable Long id) {
        try {
            Optional<Transportation> transportation = transportationService.getTransportationById(id);
            if (transportation.isPresent()) {
                return ResponseEntity.ok(transportation.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> getTransportationByBranch(@PathVariable Long branchId) {
        try {
            List<Transportation> transportation = transportationService.getTransportationByBranch(branchId);
            return ResponseEntity.ok(transportation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> getActiveTransportation() {
        try {
            List<Transportation> transportation = transportationService.getActiveTransportation();
            return ResponseEntity.ok(transportation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> getActiveTransportationByBranch(@PathVariable Long branchId) {
        try {
            List<Transportation> transportation = transportationService.getActiveTransportationByBranch(branchId);
            return ResponseEntity.ok(transportation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> createTransportation(@RequestBody Transportation transportation) {
        try {
            Transportation createdTransportation = transportationService.createTransportation(transportation);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTransportation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating transportation");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> updateTransportation(@PathVariable Long id, @RequestBody Transportation transportationDetails) {
        try {
            Transportation updatedTransportation = transportationService.updateTransportation(id, transportationDetails);
            return ResponseEntity.ok(updatedTransportation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating transportation");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteTransportation(@PathVariable Long id) {
        try {
            transportationService.deleteTransportation(id);
            return ResponseEntity.ok().body("Transportation deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting transportation");
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> searchTransportation(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String driverName,
            @RequestParam(required = false) String vehicleNumber,
            @RequestParam(required = false) Boolean isActive) {
        try {
            List<Transportation> transportation = transportationService.searchTransportation(branchId, vehicleType, driverName, vehicleNumber, isActive);
            return ResponseEntity.ok(transportation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Transportation>> getAvailableVehicles(
            @RequestParam(required = false) Long branchId) {
        try {
            List<Transportation> vehicles = transportationService.getAvailableVehicles(branchId);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countTransportationByBranch(@PathVariable Long branchId) {
        try {
            long count = transportationService.countTransportationByBranch(branchId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/active/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countActiveTransportationByBranch(@PathVariable Long branchId) {
        try {
            long count = transportationService.countActiveTransportationByBranch(branchId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
