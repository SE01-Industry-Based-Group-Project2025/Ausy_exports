package com.ausyexpo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.ausyexpo.model.Employee;
import com.ausyexpo.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(employee -> ResponseEntity.ok().body(employee))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Employee>> getEmployeesByBranch(@PathVariable Long branchId) {
        List<Employee> employees = employeeService.getEmployeesByBranch(branchId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Employee>> getEmployeesByBranchAndDepartment(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long departmentId) {
        
        if (branchId != null && departmentId != null) {
            List<Employee> employees = employeeService.getEmployeesByBranchAndDepartment(branchId, departmentId);
            return ResponseEntity.ok(employees);
        } else if (branchId != null) {
            List<Employee> employees = employeeService.getEmployeesByBranch(branchId);
            return ResponseEntity.ok(employees);
        } else if (departmentId != null) {
            List<Employee> employees = employeeService.getEmployeesByDepartment(departmentId);
            return ResponseEntity.ok(employees);
        } else {
            List<Employee> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(employees);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        try {
            Employee savedEmployee = employeeService.createEmployee(employee);
            return ResponseEntity.ok(savedEmployee);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getEmployeeCount() {
        long count = employeeService.countEmployees();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/branch/{branchId}")
    public ResponseEntity<Long> getEmployeeCountByBranch(@PathVariable Long branchId) {
        long count = employeeService.countEmployeesByBranch(branchId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/department/{departmentId}")
    public ResponseEntity<Long> getEmployeeCountByDepartment(@PathVariable Long departmentId) {
        long count = employeeService.countEmployeesByDepartment(departmentId);
        return ResponseEntity.ok(count);
    }
}
