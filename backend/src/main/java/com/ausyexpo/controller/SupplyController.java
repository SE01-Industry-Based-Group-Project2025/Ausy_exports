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

import com.ausyexpo.model.Supply;
import com.ausyexpo.service.SupplyService;

@RestController
@RequestMapping("/api/supplies")
@CrossOrigin(origins = "*")
public class SupplyController {

    @Autowired
    private SupplyService supplyService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<List<Supply>> getAllSupplies() {
        try {
            List<Supply> supplies = supplyService.getAllSupplies();
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<Supply> getSupplyById(@PathVariable Long id) {
        try {
            Optional<Supply> supply = supplyService.getSupplyById(id);
            if (supply.isPresent()) {
                return ResponseEntity.ok(supply.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Supply>> getSuppliesByBranch(@PathVariable Long branchId) {
        try {
            List<Supply> supplies = supplyService.getSuppliesByBranch(branchId);
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/supplier/{supplierName}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<List<Supply>> getSuppliesBySupplier(@PathVariable String supplierName) {
        try {
            List<Supply> supplies = supplyService.getSuppliesBySupplier(supplierName);
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Supply>> getSuppliesByStatus(@PathVariable String status) {
        try {
            List<Supply> supplies = supplyService.getSuppliesByStatus(status);
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Supply>> getPendingSupplies() {
        try {
            List<Supply> supplies = supplyService.getPendingSupplies();
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Supply>> getLowStockSupplies() {
        try {
            List<Supply> supplies = supplyService.getLowStockSupplies();
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<?> createSupply(@RequestBody Supply supply) {
        try {
            Supply createdSupply = supplyService.createSupply(supply);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSupply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating supply");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<?> updateSupply(@PathVariable Long id, @RequestBody Supply supplyDetails) {
        try {
            Supply updatedSupply = supplyService.updateSupply(id, supplyDetails);
            return ResponseEntity.ok(updatedSupply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating supply");
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> updateSupplyStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Supply updatedSupply = supplyService.updateSupplyStatus(id, status);
            return ResponseEntity.ok(updatedSupply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating supply status");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteSupply(@PathVariable Long id) {
        try {
            supplyService.deleteSupply(id);
            return ResponseEntity.ok().body("Supply deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting supply");
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('SUPPLIER')")
    public ResponseEntity<List<Supply>> searchSupplies(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String supplierName,
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        try {
            List<Supply> supplies = supplyService.searchSupplies(branchId, supplierName, itemName, status, category);
            return ResponseEntity.ok(supplies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/analytics/category")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Object[]>> getSuppliesByCategory() {
        try {
            List<Object[]> analytics = supplyService.getSuppliesByCategory();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/analytics/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Object[]>> getSuppliesByStatus() {
        try {
            List<Object[]> analytics = supplyService.getSuppliesByStatus();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countSuppliesByBranch(@PathVariable Long branchId) {
        try {
            long count = supplyService.countSuppliesByBranch(branchId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/branch/{branchId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countSuppliesByBranchAndStatus(@PathVariable Long branchId, @PathVariable String status) {
        try {
            long count = supplyService.countSuppliesByBranchAndStatus(branchId, status);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
