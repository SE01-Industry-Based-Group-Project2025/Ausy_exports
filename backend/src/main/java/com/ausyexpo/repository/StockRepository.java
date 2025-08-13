package com.ausyexpo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    // Find stock by branch
    List<Stock> findByBranchId(Long branchId);
    
    // Find stock by material type
    List<Stock> findByMaterialTypeContainingIgnoreCase(String materialType);
    
    // Find stock by stock type
    List<Stock> findByStockTypeContainingIgnoreCase(String stockType);
    
    // Find stock that has not been released yet (releaseDate is null)
    List<Stock> findByReleaseDateIsNull();
    
    // Find released stock
    List<Stock> findByReleaseDateIsNotNull();
    
    // Find stock by branch and unreleased
    List<Stock> findByBranchIdAndReleaseDateIsNull(Long branchId);
    
    // Search stock by multiple criteria
    @Query("SELECT s FROM Stock s WHERE " +
           "(:branchId IS NULL OR s.branch.id = :branchId) AND " +
           "(:stockType IS NULL OR LOWER(s.stockType) LIKE LOWER(CONCAT('%', :stockType, '%'))) AND " +
           "(:materialType IS NULL OR LOWER(s.materialType) LIKE LOWER(CONCAT('%', :materialType, '%'))) AND " +
           "(:isReleased IS NULL OR " +
           "  (:isReleased = true AND s.releaseDate IS NOT NULL) OR " +
           "  (:isReleased = false AND s.releaseDate IS NULL))")
    List<Stock> findBySearchCriteria(@Param("branchId") Long branchId,
                                   @Param("stockType") String stockType,
                                   @Param("materialType") String materialType,
                                   @Param("isReleased") Boolean isReleased);
    
    // Get stock summary by branch
    @Query("SELECT s.materialType, SUM(s.quantity), COUNT(s) FROM Stock s " +
           "WHERE s.branch.id = :branchId AND s.releaseDate IS NULL " +
           "GROUP BY s.materialType")
    List<Object[]> getStockSummaryByBranch(@Param("branchId") Long branchId);
    
    // Get low stock items (quantity below threshold)
    @Query("SELECT s FROM Stock s WHERE s.quantity <= :threshold AND s.releaseDate IS NULL")
    List<Stock> findLowStockItems(@Param("threshold") Integer threshold);
}
