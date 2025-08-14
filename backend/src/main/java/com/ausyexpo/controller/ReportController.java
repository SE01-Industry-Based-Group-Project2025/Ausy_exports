package com.ausyexpo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ausyexpo.service.ReportService;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/system-overview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getSystemOverviewReport() {
        try {
            Map<String, Object> report = reportService.generateSystemOverviewReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/user-analytics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getUserAnalyticsReport() {
        try {
            Map<String, Object> report = reportService.generateUserAnalyticsReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/employee-demographics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getEmployeeDemographicsReport() {
        try {
            Map<String, Object> report = reportService.generateEmployeeReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/available-reports")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Map<String, Object>> getAvailableReports() {
        Map<String, Object> reports = Map.of(
            "reports", new String[]{
                "system-overview",
                "user-analytics", 
                "employee-demographics"
            },
            "descriptions", Map.of(
                "system-overview", "Complete system statistics and overview",
                "user-analytics", "User registration and activity trends",
                "employee-demographics", "Employee distribution and demographics"
            )
        );
        return ResponseEntity.ok(reports);
    }
}
