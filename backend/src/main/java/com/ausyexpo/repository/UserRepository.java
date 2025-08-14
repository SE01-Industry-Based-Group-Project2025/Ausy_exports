package com.ausyexpo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ausyexpo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByRoleAndIsActive(User.Role role, Boolean isActive);
    
    @Query("SELECT u FROM User u WHERE u.role IN :roles AND u.isActive = :isActive")
    List<User> findByRolesAndIsActive(@Param("roles") List<User.Role> roles, @Param("isActive") Boolean isActive);
    
    List<User> findByBranchId(Long branchId);
    
    boolean existsByEmail(String email);
    
    // Report queries
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countUsersByRole();
    
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    List<User> findTop5ByOrderByCreatedAtDesc();
}
