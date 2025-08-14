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

import com.ausyexpo.model.Agreement;
import com.ausyexpo.service.AgreementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/agreements")
@CrossOrigin(origins = "*")
public class AgreementController {

    @Autowired
    private AgreementService agreementService;

    @GetMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> getAllAgreements(@RequestParam(required = false) Long branchId) {
        try {
            List<Agreement> agreements;
            if (branchId != null) {
                agreements = agreementService.getAgreementsByBranch(branchId);
            } else {
                agreements = agreementService.getAllAgreements();
            }
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Agreement> getAgreementById(@PathVariable Long id) {
        try {
            Optional<Agreement> agreement = agreementService.getAgreementById(id);
            if (agreement.isPresent()) {
                return ResponseEntity.ok(agreement.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createAgreement(@Valid @RequestBody Agreement agreement) {
        try {
            Agreement createdAgreement = agreementService.createAgreement(agreement);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAgreement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the agreement");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateAgreement(@PathVariable Long id, @Valid @RequestBody Agreement agreementDetails) {
        try {
            Agreement updatedAgreement = agreementService.updateAgreement(id, agreementDetails);
            return ResponseEntity.ok(updatedAgreement);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the agreement");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAgreement(@PathVariable Long id) {
        try {
            agreementService.deleteAgreement(id);
            return ResponseEntity.ok().body("Agreement deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the agreement");
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> searchAgreements(
            @RequestParam String searchTerm,
            @RequestParam(required = false) Long branchId) {
        try {
            List<Agreement> agreements = agreementService.searchAgreements(branchId, searchTerm);
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> getAgreementsByStatus(@PathVariable String status) {
        try {
            List<Agreement> agreements = agreementService.getAgreementsByStatus(status);
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> getAgreementsByType(@PathVariable String type) {
        try {
            List<Agreement> agreements = agreementService.getAgreementsByType(type);
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> getActiveAgreements() {
        try {
            List<Agreement> agreements = agreementService.getActiveAgreements();
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/expiring")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<Agreement>> getExpiringAgreements(
            @RequestParam(defaultValue = "30") int daysAhead,
            @RequestParam(required = false) Long branchId) {
        try {
            List<Agreement> agreements;
            if (branchId != null) {
                agreements = agreementService.getBranchExpiringAgreements(branchId, daysAhead);
            } else {
                agreements = agreementService.getExpiringAgreements(daysAhead);
            }
            return ResponseEntity.ok(agreements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/active")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getActiveAgreementsCount(@RequestParam(required = false) Long branchId) {
        try {
            Long count = agreementService.getActiveAgreementsCount(branchId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/value/total")
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Double> getTotalContractValue(@RequestParam(required = false) Long branchId) {
        try {
            Double totalValue = agreementService.getTotalContractValue(branchId);
            return ResponseEntity.ok(totalValue);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
