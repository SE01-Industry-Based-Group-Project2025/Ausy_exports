package com.ausyexpo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    // Find departments by branch
    List<Department> findByBranchId(Long branchId);
    
    // Find department by name and branch (for uniqueness check)
    Optional<Department> findByNameAndBranchId(String name, Long branchId);
    
    // Find departments by name containing (case insensitive)
    List<Department> findByNameContainingIgnoreCase(String name);
    
    // Check if department name exists in a specific branch
    boolean existsByNameAndBranchId(String name, Long branchId);
    
    // Search departments by multiple criteria
    @Query("SELECT d FROM Department d WHERE " +
           "(:branchId IS NULL OR d.branch.id = :branchId) AND " +
           "(:name IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<Department> findBySearchCriteria(@Param("branchId") Long branchId,
                                        @Param("name") String name);
    
    // Get departments with employee count
    @Query("SELECT d, COUNT(e) FROM Department d LEFT JOIN d.employees e " +
           "WHERE (:branchId IS NULL OR d.branch.id = :branchId) " +
           "GROUP BY d.id ORDER BY d.name")
    List<Object[]> findDepartmentsWithEmployeeCount(@Param("branchId") Long branchId);
    
    // Count departments by branch
    long countByBranchId(Long branchId);
}
