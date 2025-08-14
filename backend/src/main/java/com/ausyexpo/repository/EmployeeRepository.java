package com.ausyexpo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByBranchId(Long branchId);
    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findByBranchIdAndDepartmentId(Long branchId, Long departmentId);
    
    // Report queries
    @Query("SELECT d.name, COUNT(e) FROM Employee e JOIN e.department d GROUP BY d.id, d.name")
    List<Object[]> getEmployeeCountByDepartment();
    
    @Query("SELECT e.gender, COUNT(e) FROM Employee e GROUP BY e.gender")
    List<Object[]> getEmployeeCountByGender();
}
