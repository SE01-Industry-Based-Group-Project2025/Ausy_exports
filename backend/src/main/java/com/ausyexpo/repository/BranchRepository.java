package com.ausyexpo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByNameContaining(String name);
    List<Branch> findByLocationContaining(String location);
    boolean existsByName(String name);
    
    // Additional methods for Branch Management
    Optional<Branch> findByEmail(String email);
    
    List<Branch> findByIsActive(Boolean isActive);
    
    @Query("SELECT b FROM Branch b WHERE " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.manager) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Branch> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT b FROM Branch b WHERE b.isActive = :isActive AND (" +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.manager) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Branch> findByIsActiveAndSearchTerm(@Param("isActive") Boolean isActive, @Param("searchTerm") String searchTerm);
    
    // Report queries
    @Query("SELECT b.name, COUNT(e) FROM Branch b LEFT JOIN Employee e ON e.branch.id = b.id GROUP BY b.id, b.name")
    List<Object[]> getBranchEmployeeCounts();
}
