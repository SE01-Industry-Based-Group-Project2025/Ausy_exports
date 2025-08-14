package com.ausyexpo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ausyexpo.model.Employee;
import com.ausyexpo.repository.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public List<Employee> getEmployeesByBranch(Long branchId) {
        return employeeRepository.findByBranchId(branchId);
    }

    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    public List<Employee> getEmployeesByBranchAndDepartment(Long branchId, Long departmentId) {
        return employeeRepository.findByBranchIdAndDepartmentId(branchId, departmentId);
    }

    public Employee createEmployee(Employee employee) {
        // Set branch to null for now (as per your requirement to remove branch dependencies)
        employee.setBranch(null);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setDateOfBirth(employeeDetails.getDateOfBirth());
        employee.setGender(employeeDetails.getGender());
        employee.setContactInformation(employeeDetails.getContactInformation());
        employee.setDepartment(employeeDetails.getDepartment());
        // Set branch to null for now (as per your requirement to remove branch dependencies)
        employee.setBranch(null);

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    public long countEmployees() {
        return employeeRepository.count();
    }

    public long countEmployeesByBranch(Long branchId) {
        return employeeRepository.findByBranchId(branchId).size();
    }

    public long countEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).size();
    }
}
