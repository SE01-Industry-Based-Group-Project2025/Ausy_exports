package com.ausyexpo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByBranchId(Long branchId);
    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findByBranchIdAndDepartmentId(Long branchId, Long departmentId);
}
