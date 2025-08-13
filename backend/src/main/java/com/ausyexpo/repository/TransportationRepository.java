package com.ausyexpo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Transportation;

@Repository
public interface TransportationRepository extends JpaRepository<Transportation, Long> {

    List<Transportation> findByBranchId(Long branchId);
    
    List<Transportation> findByBranchIdAndIsActiveTrue(Long branchId);
    
    List<Transportation> findByIsActiveTrue();
    
    List<Transportation> findByDriverName(String driverName);
    
    List<Transportation> findByVehicleType(String vehicleType);
    
    @Query("SELECT t FROM Transportation t WHERE " +
           "(:branchId IS NULL OR t.branch.id = :branchId) AND " +
           "(:vehicleType IS NULL OR LOWER(t.vehicleType) LIKE LOWER(CONCAT('%', :vehicleType, '%'))) AND " +
           "(:driverName IS NULL OR LOWER(t.driverName) LIKE LOWER(CONCAT('%', :driverName, '%'))) AND " +
           "(:vehicleNumber IS NULL OR LOWER(t.vehicleNumber) LIKE LOWER(CONCAT('%', :vehicleNumber, '%'))) AND " +
           "(:isActive IS NULL OR t.isActive = :isActive)")
    List<Transportation> searchTransportation(@Param("branchId") Long branchId,
                                            @Param("vehicleType") String vehicleType,
                                            @Param("driverName") String driverName,
                                            @Param("vehicleNumber") String vehicleNumber,
                                            @Param("isActive") Boolean isActive);

    @Query("SELECT COUNT(t) FROM Transportation t WHERE t.branch.id = :branchId")
    long countByBranchId(@Param("branchId") Long branchId);
    
    @Query("SELECT COUNT(t) FROM Transportation t WHERE t.branch.id = :branchId AND t.isActive = true")
    long countActiveByBranchId(@Param("branchId") Long branchId);
    
    boolean existsByVehicleNumber(String vehicleNumber);
    
    boolean existsByVehicleNumberAndIdNot(String vehicleNumber, Long id);
    
    @Query("SELECT t FROM Transportation t WHERE t.isActive = true AND " +
           "(:branchId IS NULL OR t.branch.id = :branchId)")
    List<Transportation> findAvailableVehicles(@Param("branchId") Long branchId);
}
