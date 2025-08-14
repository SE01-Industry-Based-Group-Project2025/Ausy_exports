package com.ausyexpo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.Command;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {
    
    @Query("SELECT c FROM Command c LEFT JOIN FETCH c.issuedBy LEFT JOIN FETCH c.assignedTo LEFT JOIN FETCH c.branch ORDER BY c.createdAt DESC")
    List<Command> findAllWithDetails();
    
    List<Command> findByIssuedByIdOrderByCreatedAtDesc(Long issuedById);
    
    List<Command> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);
    
    List<Command> findByBranchIdOrderByCreatedAtDesc(Long branchId);
    
    List<Command> findByStatusOrderByCreatedAtDesc(Command.Status status);
    
    List<Command> findByPriorityOrderByCreatedAtDesc(Command.Priority priority);
    
    List<Command> findByTypeOrderByCreatedAtDesc(Command.CommandType type);
    
    @Query("SELECT c FROM Command c WHERE c.dueDate BETWEEN :startDate AND :endDate ORDER BY c.dueDate ASC")
    List<Command> findByDueDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT c FROM Command c WHERE c.dueDate < :currentDate AND c.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY c.dueDate ASC")
    List<Command> findOverdueCommands(@Param("currentDate") LocalDateTime currentDate);
    
    @Query("SELECT c FROM Command c WHERE " +
           "(:branchId IS NULL OR c.branch.id = :branchId) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:type IS NULL OR c.type = :type) AND " +
           "(:assignedToId IS NULL OR c.assignedTo.id = :assignedToId) " +
           "ORDER BY c.createdAt DESC")
    List<Command> searchCommands(
        @Param("branchId") Long branchId,
        @Param("status") Command.Status status,
        @Param("priority") Command.Priority priority,
        @Param("type") Command.CommandType type,
        @Param("assignedToId") Long assignedToId
    );
    
    @Query("SELECT COUNT(c) FROM Command c WHERE c.status = :status")
    long countByStatus(@Param("status") Command.Status status);
    
    @Query("SELECT COUNT(c) FROM Command c WHERE c.assignedTo.id = :userId AND c.status = :status")
    long countByAssignedToIdAndStatus(@Param("userId") Long userId, @Param("status") Command.Status status);
    
    @Query("SELECT c.status, COUNT(c) FROM Command c GROUP BY c.status")
    List<Object[]> getCommandStatusStatistics();
    
    @Query("SELECT c.priority, COUNT(c) FROM Command c GROUP BY c.priority")
    List<Object[]> getCommandPriorityStatistics();
}
