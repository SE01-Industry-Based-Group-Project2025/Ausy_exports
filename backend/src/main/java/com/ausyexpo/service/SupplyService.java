package com.ausyexpo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ausyexpo.model.Branch;
import com.ausyexpo.model.Supply;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.SupplyRepository;

@Service
public class SupplyService {

    @Autowired
    private SupplyRepository supplyRepository;

    @Autowired
    private BranchRepository branchRepository;

    public List<Supply> getAllSupplies() {
        return supplyRepository.findAll();
    }

    public Optional<Supply> getSupplyById(Long id) {
        return supplyRepository.findById(id);
    }

    public List<Supply> getSuppliesByBranch(Long branchId) {
        return supplyRepository.findByBranchId(branchId);
    }

    public List<Supply> getSuppliesBySupplier(String supplierName) {
        return supplyRepository.findBySupplierName(supplierName);
    }

    public List<Supply> getSuppliesByItem(String itemName) {
        return supplyRepository.findByItemName(itemName);
    }

    public List<Supply> getSuppliesByStatus(String status) {
        return supplyRepository.findByStatus(status);
    }

    public Supply createSupply(Supply supply) {
        // Validate required fields
        if (supply.getItemName() == null || supply.getItemName().trim().isEmpty()) {
            throw new RuntimeException("Item name is required");
        }
        
        if (supply.getSupplierName() == null || supply.getSupplierName().trim().isEmpty()) {
            throw new RuntimeException("Supplier name is required");
        }
        
        if (supply.getQuantity() == null || supply.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        if (supply.getUnitPrice() == null || supply.getUnitPrice() < 0) {
            throw new RuntimeException("Unit price must be 0 or greater");
        }

        // Validate branch exists
        if (supply.getBranch() == null || supply.getBranch().getId() == null) {
            throw new RuntimeException("Branch is required");
        }

        Optional<Branch> branch = branchRepository.findById(supply.getBranch().getId());
        if (!branch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + supply.getBranch().getId());
        }

        // Set the branch
        supply.setBranch(branch.get());
        
        // Set default values
        if (supply.getStatus() == null || supply.getStatus().trim().isEmpty()) {
            supply.setStatus("PENDING");
        }
        
        if (supply.getCategory() == null || supply.getCategory().trim().isEmpty()) {
            supply.setCategory("GENERAL");
        }
        
        if (supply.getMinimumQuantity() == null) {
            supply.setMinimumQuantity(0);
        }
        
        if (supply.getRequestDate() == null) {
            supply.setRequestDate(LocalDateTime.now());
        }

        // Trim string fields
        supply.setItemName(supply.getItemName().trim());
        supply.setSupplierName(supply.getSupplierName().trim());
        supply.setStatus(supply.getStatus().trim().toUpperCase());
        supply.setCategory(supply.getCategory().trim().toUpperCase());
        
        if (supply.getDescription() != null) {
            supply.setDescription(supply.getDescription().trim());
        }
        
        if (supply.getSupplierContact() != null) {
            supply.setSupplierContact(supply.getSupplierContact().trim());
        }
        
        if (supply.getUnit() != null) {
            supply.setUnit(supply.getUnit().trim());
        }

        // Calculate total cost
        double totalCost = supply.getQuantity() * supply.getUnitPrice();
        supply.setTotalCost(totalCost);

        return supplyRepository.save(supply);
    }

    public Supply updateSupply(Long id, Supply supplyDetails) {
        Optional<Supply> optionalSupply = supplyRepository.findById(id);
        
        if (!optionalSupply.isPresent()) {
            throw new RuntimeException("Supply not found with id: " + id);
        }

        Supply supply = optionalSupply.get();

        // Validate required fields
        if (supplyDetails.getItemName() == null || supplyDetails.getItemName().trim().isEmpty()) {
            throw new RuntimeException("Item name is required");
        }
        
        if (supplyDetails.getSupplierName() == null || supplyDetails.getSupplierName().trim().isEmpty()) {
            throw new RuntimeException("Supplier name is required");
        }
        
        if (supplyDetails.getQuantity() == null || supplyDetails.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        if (supplyDetails.getUnitPrice() == null || supplyDetails.getUnitPrice() < 0) {
            throw new RuntimeException("Unit price must be 0 or greater");
        }

        // Validate branch exists
        if (supplyDetails.getBranch() == null || supplyDetails.getBranch().getId() == null) {
            throw new RuntimeException("Branch is required");
        }

        Optional<Branch> branch = branchRepository.findById(supplyDetails.getBranch().getId());
        if (!branch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + supplyDetails.getBranch().getId());
        }

        // Update fields
        supply.setItemName(supplyDetails.getItemName().trim());
        supply.setSupplierName(supplyDetails.getSupplierName().trim());
        supply.setQuantity(supplyDetails.getQuantity());
        supply.setUnitPrice(supplyDetails.getUnitPrice());
        supply.setBranch(branch.get());
        
        if (supplyDetails.getStatus() != null && !supplyDetails.getStatus().trim().isEmpty()) {
            supply.setStatus(supplyDetails.getStatus().trim().toUpperCase());
        }
        
        if (supplyDetails.getCategory() != null && !supplyDetails.getCategory().trim().isEmpty()) {
            supply.setCategory(supplyDetails.getCategory().trim().toUpperCase());
        }
        
        if (supplyDetails.getDescription() != null) {
            supply.setDescription(supplyDetails.getDescription().trim());
        }
        
        if (supplyDetails.getSupplierContact() != null) {
            supply.setSupplierContact(supplyDetails.getSupplierContact().trim());
        }
        
        if (supplyDetails.getUnit() != null) {
            supply.setUnit(supplyDetails.getUnit().trim());
        }
        
        if (supplyDetails.getMinimumQuantity() != null) {
            supply.setMinimumQuantity(supplyDetails.getMinimumQuantity());
        }
        
        if (supplyDetails.getRequestDate() != null) {
            supply.setRequestDate(supplyDetails.getRequestDate());
        }
        
        if (supplyDetails.getDeliveryDate() != null) {
            supply.setDeliveryDate(supplyDetails.getDeliveryDate());
        }

        // Recalculate total cost
        double totalCost = supply.getQuantity() * supply.getUnitPrice();
        supply.setTotalCost(totalCost);

        return supplyRepository.save(supply);
    }

    public void deleteSupply(Long id) {
        Optional<Supply> optionalSupply = supplyRepository.findById(id);
        
        if (!optionalSupply.isPresent()) {
            throw new RuntimeException("Supply not found with id: " + id);
        }

        supplyRepository.deleteById(id);
    }

    public List<Supply> searchSupplies(Long branchId, String supplierName, String itemName, String status, String category) {
        return supplyRepository.searchSupplies(branchId, supplierName, itemName, status, category);
    }

    public long countSuppliesByBranch(Long branchId) {
        return supplyRepository.countByBranchId(branchId);
    }

    public long countSuppliesByBranchAndStatus(Long branchId, String status) {
        return supplyRepository.countByBranchIdAndStatus(branchId, status);
    }

    public List<Supply> getPendingSupplies() {
        return supplyRepository.findPendingSupplies();
    }

    public List<Supply> getLowStockSupplies() {
        return supplyRepository.findLowStockSupplies();
    }

    public List<Object[]> getSuppliesByCategory() {
        return supplyRepository.getSuppliesByCategory();
    }

    public List<Object[]> getSuppliesByStatus() {
        return supplyRepository.getSuppliesByStatus();
    }

    public Supply updateSupplyStatus(Long id, String status) {
        Optional<Supply> optionalSupply = supplyRepository.findById(id);
        
        if (!optionalSupply.isPresent()) {
            throw new RuntimeException("Supply not found with id: " + id);
        }

        Supply supply = optionalSupply.get();
        supply.setStatus(status.toUpperCase());
        
        // Set delivery date if status is completed
        if ("COMPLETED".equalsIgnoreCase(status) && supply.getDeliveryDate() == null) {
            supply.setDeliveryDate(LocalDateTime.now());
        }

        return supplyRepository.save(supply);
    }
}
