package com.ausyexpo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Supply;

@Repository
public interface SupplyRepository extends JpaRepository<Supply, Long> {

    List<Supply> findByBranchId(Long branchId);
    
    List<Supply> findBySupplierName(String supplierName);
    
    List<Supply> findByItemName(String itemName);
    
    List<Supply> findByStatus(String status);
    
    @Query("SELECT s FROM Supply s WHERE " +
           "(:branchId IS NULL OR s.branch.id = :branchId) AND " +
           "(:supplierName IS NULL OR LOWER(s.supplierName) LIKE LOWER(CONCAT('%', :supplierName, '%'))) AND " +
           "(:itemName IS NULL OR LOWER(s.itemName) LIKE LOWER(CONCAT('%', :itemName, '%'))) AND " +
           "(:status IS NULL OR LOWER(s.status) = LOWER(:status)) AND " +
           "(:category IS NULL OR LOWER(s.category) LIKE LOWER(CONCAT('%', :category, '%')))")
    List<Supply> searchSupplies(@Param("branchId") Long branchId,
                               @Param("supplierName") String supplierName,
                               @Param("itemName") String itemName,
                               @Param("status") String status,
                               @Param("category") String category);

    @Query("SELECT COUNT(s) FROM Supply s WHERE s.branch.id = :branchId")
    long countByBranchId(@Param("branchId") Long branchId);
    
    @Query("SELECT COUNT(s) FROM Supply s WHERE s.branch.id = :branchId AND s.status = :status")
    long countByBranchIdAndStatus(@Param("branchId") Long branchId, @Param("status") String status);
    
    @Query("SELECT s FROM Supply s WHERE s.status = 'PENDING' ORDER BY s.requestDate ASC")
    List<Supply> findPendingSupplies();
    
    @Query("SELECT s FROM Supply s WHERE s.quantity < s.minimumQuantity")
    List<Supply> findLowStockSupplies();
    
    @Query("SELECT s.category, COUNT(s) FROM Supply s GROUP BY s.category")
    List<Object[]> getSuppliesByCategory();
    
    @Query("SELECT s.status, COUNT(s) FROM Supply s GROUP BY s.status")
    List<Object[]> getSuppliesByStatus();
}
