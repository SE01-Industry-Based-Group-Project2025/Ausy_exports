package com.ausyexpo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ausyexpo.model.Branch;
import com.ausyexpo.model.Transportation;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.TransportationRepository;

@Service
public class TransportationService {

    @Autowired
    private TransportationRepository transportationRepository;

    @Autowired
    private BranchRepository branchRepository;

    public List<Transportation> getAllTransportation() {
        return transportationRepository.findAll();
    }

    public Optional<Transportation> getTransportationById(Long id) {
        return transportationRepository.findById(id);
    }

    public List<Transportation> getTransportationByBranch(Long branchId) {
        return transportationRepository.findByBranchId(branchId);
    }

    public List<Transportation> getActiveTransportationByBranch(Long branchId) {
        return transportationRepository.findByBranchIdAndIsActiveTrue(branchId);
    }

    public List<Transportation> getActiveTransportation() {
        return transportationRepository.findByIsActiveTrue();
    }

    public Transportation createTransportation(Transportation transportation) {
        // Validate required fields
        if (transportation.getVehicleNumber() == null || transportation.getVehicleNumber().trim().isEmpty()) {
            throw new RuntimeException("Vehicle number is required");
        }
        
        if (transportation.getVehicleType() == null || transportation.getVehicleType().trim().isEmpty()) {
            throw new RuntimeException("Vehicle type is required");
        }
        
        if (transportation.getDriverName() == null || transportation.getDriverName().trim().isEmpty()) {
            throw new RuntimeException("Driver name is required");
        }

        // Validate branch exists
        if (transportation.getBranch() == null || transportation.getBranch().getId() == null) {
            throw new RuntimeException("Branch is required");
        }

        Optional<Branch> branch = branchRepository.findById(transportation.getBranch().getId());
        if (!branch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + transportation.getBranch().getId());
        }

        // Check if vehicle number already exists
        if (transportationRepository.existsByVehicleNumber(transportation.getVehicleNumber().trim())) {
            throw new RuntimeException("Vehicle with number '" + transportation.getVehicleNumber().trim() + "' already exists");
        }

        // Set the branch
        transportation.setBranch(branch.get());
        
        // Set default values
        if (transportation.getIsActive() == null) {
            transportation.setIsActive(true);
        }
        
        if (transportation.getCapacity() == null) {
            transportation.setCapacity(0.0);
        }

        // Trim string fields
        transportation.setVehicleNumber(transportation.getVehicleNumber().trim());
        transportation.setVehicleType(transportation.getVehicleType().trim());
        transportation.setDriverName(transportation.getDriverName().trim());
        
        if (transportation.getDriverContact() != null) {
            transportation.setDriverContact(transportation.getDriverContact().trim());
        }
        
        if (transportation.getDescription() != null) {
            transportation.setDescription(transportation.getDescription().trim());
        }

        return transportationRepository.save(transportation);
    }

    public Transportation updateTransportation(Long id, Transportation transportationDetails) {
        Optional<Transportation> optionalTransportation = transportationRepository.findById(id);
        
        if (!optionalTransportation.isPresent()) {
            throw new RuntimeException("Transportation not found with id: " + id);
        }

        Transportation transportation = optionalTransportation.get();

        // Validate required fields
        if (transportationDetails.getVehicleNumber() == null || transportationDetails.getVehicleNumber().trim().isEmpty()) {
            throw new RuntimeException("Vehicle number is required");
        }
        
        if (transportationDetails.getVehicleType() == null || transportationDetails.getVehicleType().trim().isEmpty()) {
            throw new RuntimeException("Vehicle type is required");
        }
        
        if (transportationDetails.getDriverName() == null || transportationDetails.getDriverName().trim().isEmpty()) {
            throw new RuntimeException("Driver name is required");
        }

        // Validate branch exists
        if (transportationDetails.getBranch() == null || transportationDetails.getBranch().getId() == null) {
            throw new RuntimeException("Branch is required");
        }

        Optional<Branch> branch = branchRepository.findById(transportationDetails.getBranch().getId());
        if (!branch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + transportationDetails.getBranch().getId());
        }

        // Check if vehicle number already exists (excluding current record)
        if (transportationRepository.existsByVehicleNumberAndIdNot(transportationDetails.getVehicleNumber().trim(), id)) {
            throw new RuntimeException("Vehicle with number '" + transportationDetails.getVehicleNumber().trim() + "' already exists");
        }

        // Update fields
        transportation.setVehicleNumber(transportationDetails.getVehicleNumber().trim());
        transportation.setVehicleType(transportationDetails.getVehicleType().trim());
        transportation.setDriverName(transportationDetails.getDriverName().trim());
        transportation.setBranch(branch.get());
        
        if (transportationDetails.getDriverContact() != null) {
            transportation.setDriverContact(transportationDetails.getDriverContact().trim());
        }
        
        if (transportationDetails.getDescription() != null) {
            transportation.setDescription(transportationDetails.getDescription().trim());
        }
        
        if (transportationDetails.getCapacity() != null) {
            transportation.setCapacity(transportationDetails.getCapacity());
        }
        
        if (transportationDetails.getIsActive() != null) {
            transportation.setIsActive(transportationDetails.getIsActive());
        }

        return transportationRepository.save(transportation);
    }

    public void deleteTransportation(Long id) {
        Optional<Transportation> optionalTransportation = transportationRepository.findById(id);
        
        if (!optionalTransportation.isPresent()) {
            throw new RuntimeException("Transportation not found with id: " + id);
        }

        transportationRepository.deleteById(id);
    }

    public List<Transportation> searchTransportation(Long branchId, String vehicleType, String driverName, String vehicleNumber, Boolean isActive) {
        return transportationRepository.searchTransportation(branchId, vehicleType, driverName, vehicleNumber, isActive);
    }

    public long countTransportationByBranch(Long branchId) {
        return transportationRepository.countByBranchId(branchId);
    }

    public long countActiveTransportationByBranch(Long branchId) {
        return transportationRepository.countActiveByBranchId(branchId);
    }

    public List<Transportation> getAvailableVehicles(Long branchId) {
        return transportationRepository.findAvailableVehicles(branchId);
    }
}
