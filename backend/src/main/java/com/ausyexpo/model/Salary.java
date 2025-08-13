package com.ausyexpo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "salaries")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(precision = 10, scale = 2)
    private BigDecimal basicSalary;

    @Column(precision = 10, scale = 2)
    private BigDecimal increments = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal decrements = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal finalSalary;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // Constructors
    public Salary() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Salary(BigDecimal basicSalary, Employee employee) {
        this();
        this.basicSalary = basicSalary;
        this.employee = employee;
        calculateFinalSalary();
    }

    // Calculate final salary
    public void calculateFinalSalary() {
        this.finalSalary = basicSalary.add(increments).subtract(decrements);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(BigDecimal basicSalary) {
        this.basicSalary = basicSalary;
        calculateFinalSalary();
    }

    public BigDecimal getIncrements() {
        return increments;
    }

    public void setIncrements(BigDecimal increments) {
        this.increments = increments;
        calculateFinalSalary();
    }

    public BigDecimal getDecrements() {
        return decrements;
    }

    public void setDecrements(BigDecimal decrements) {
        this.decrements = decrements;
        calculateFinalSalary();
    }

    public BigDecimal getFinalSalary() {
        return finalSalary;
    }

    public void setFinalSalary(BigDecimal finalSalary) {
        this.finalSalary = finalSalary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateFinalSalary();
    }

    @PrePersist
    public void prePersist() {
        calculateFinalSalary();
    }
}
