package com.ausyexpo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Agreement;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Long> {
    
    List<Agreement> findByBranchIdOrderByCreatedAtDesc(Long branchId);
    
    List<Agreement> findByStatusOrderByCreatedAtDesc(String status);
    
    List<Agreement> findByAgreementTypeOrderByCreatedAtDesc(String agreementType);
    
    List<Agreement> findByIsActiveOrderByCreatedAtDesc(Boolean isActive);
    
    List<Agreement> findByAssignedManagerIdOrderByCreatedAtDesc(Long managerId);
    
    List<Agreement> findByBranchIdAndStatusOrderByCreatedAtDesc(Long branchId, String status);
    
    List<Agreement> findByBranchIdAndAgreementTypeOrderByCreatedAtDesc(Long branchId, String agreementType);
    
    List<Agreement> findByBranchIdAndIsActiveOrderByCreatedAtDesc(Long branchId, Boolean isActive);
    
    @Query("SELECT a FROM Agreement a WHERE a.branch.id = :branchId AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.clientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.agreementType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.status) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY a.createdAt DESC")
    List<Agreement> searchAgreements(@Param("branchId") Long branchId, @Param("searchTerm") String searchTerm);
    
    @Query("SELECT a FROM Agreement a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.clientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.agreementType) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.status) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY a.createdAt DESC")
    List<Agreement> searchAllAgreements(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT a FROM Agreement a WHERE a.endDate BETWEEN :startDate AND :endDate ORDER BY a.endDate ASC")
    List<Agreement> findAgreementsExpiringBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Agreement a WHERE a.branch.id = :branchId AND a.endDate BETWEEN :startDate AND :endDate ORDER BY a.endDate ASC")
    List<Agreement> findBranchAgreementsExpiringBetween(@Param("branchId") Long branchId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Agreement a WHERE a.branch.id = :branchId AND a.isActive = true")
    Long countActiveAgreementsByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT COUNT(a) FROM Agreement a WHERE a.isActive = true")
    Long countAllActiveAgreements();
    
    @Query("SELECT SUM(a.contractValue) FROM Agreement a WHERE a.branch.id = :branchId AND a.isActive = true")
    Double getTotalContractValueByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT SUM(a.contractValue) FROM Agreement a WHERE a.isActive = true")
    Double getTotalContractValue();
}
