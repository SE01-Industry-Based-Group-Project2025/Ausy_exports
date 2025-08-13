package com.ausyexpo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByBranchId(Long branchId);
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStatus(String status);
    
    List<Order> findByPriority(String priority);
    
    List<Order> findByCustomerName(String customerName);
    
    boolean existsByOrderNumber(String orderNumber);
    
    boolean existsByOrderNumberAndIdNot(String orderNumber, Long id);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(:branchId IS NULL OR o.branch.id = :branchId) AND " +
           "(:status IS NULL OR LOWER(o.status) = LOWER(:status)) AND " +
           "(:priority IS NULL OR LOWER(o.priority) = LOWER(:priority)) AND " +
           "(:customerName IS NULL OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :customerName, '%'))) AND " +
           "(:productName IS NULL OR LOWER(o.productName) LIKE LOWER(CONCAT('%', :productName, '%'))) AND " +
           "(:orderNumber IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :orderNumber, '%')))")
    List<Order> searchOrders(@Param("branchId") Long branchId,
                            @Param("status") String status,
                            @Param("priority") String priority,
                            @Param("customerName") String customerName,
                            @Param("productName") String productName,
                            @Param("orderNumber") String orderNumber);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.branch.id = :branchId")
    long countByBranchId(@Param("branchId") Long branchId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.branch.id = :branchId AND o.status = :status")
    long countByBranchIdAndStatus(@Param("branchId") Long branchId, @Param("status") String status);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'CONFIRMED') ORDER BY o.orderDate ASC")
    List<Order> findActiveOrders();
    
    @Query("SELECT o FROM Order o WHERE o.expectedDeliveryDate < :date AND o.status NOT IN ('DELIVERED', 'CANCELLED')")
    List<Order> findOverdueOrders(@Param("date") LocalDateTime date);
    
    @Query("SELECT o FROM Order o WHERE o.expectedDeliveryDate BETWEEN :startDate AND :endDate")
    List<Order> findOrdersByDeliveryDateRange(@Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrdersByStatus();
    
    @Query("SELECT o.priority, COUNT(o) FROM Order o GROUP BY o.priority")
    List<Object[]> getOrdersByPriority();
    
    @Query("SELECT o.productCategory, COUNT(o) FROM Order o GROUP BY o.productCategory")
    List<Object[]> getOrdersByCategory();
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED' AND o.branch.id = :branchId")
    Double getTotalRevenueByBranch(@Param("branchId") Long branchId);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate ORDER BY o.orderDate DESC")
    List<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
}
