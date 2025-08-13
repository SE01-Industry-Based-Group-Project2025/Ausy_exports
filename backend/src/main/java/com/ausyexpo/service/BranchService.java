package com.ausyexpo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ausyexpo.model.Branch;
import com.ausyexpo.repository.BranchRepository;

@Service
@Transactional
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    public List<Branch> getAllBranches() {
        return branchRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Optional<Branch> getBranchById(Long id) {
        return branchRepository.findById(id);
    }

    public Branch createBranch(Branch branch) {
        // Check if branch with same name already exists
        if (branchRepository.existsByName(branch.getName())) {
            throw new RuntimeException("Branch with name '" + branch.getName() + "' already exists");
        }
        
        // Check if branch with same email already exists
        if (branch.getEmail() != null && !branch.getEmail().trim().isEmpty()) {
            Optional<Branch> existingBranch = branchRepository.findByEmail(branch.getEmail());
            if (existingBranch.isPresent()) {
                throw new RuntimeException("Branch with email '" + branch.getEmail() + "' already exists");
            }
        }
        
        // Set default values
        if (branch.getIsActive() == null) {
            branch.setIsActive(true);
        }
        
        return branchRepository.save(branch);
    }

    public Branch updateBranch(Long id, Branch branchDetails) {
        Optional<Branch> optionalBranch = branchRepository.findById(id);
        if (!optionalBranch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + id);
        }

        Branch branch = optionalBranch.get();

        // Check if another branch with same name exists (excluding current branch)
        if (!branch.getName().equals(branchDetails.getName()) && 
            branchRepository.existsByName(branchDetails.getName())) {
            throw new RuntimeException("Branch with name '" + branchDetails.getName() + "' already exists");
        }

        // Check if another branch with same email exists (excluding current branch)
        if (branchDetails.getEmail() != null && !branchDetails.getEmail().trim().isEmpty() &&
            !branchDetails.getEmail().equals(branch.getEmail())) {
            Optional<Branch> existingBranch = branchRepository.findByEmail(branchDetails.getEmail());
            if (existingBranch.isPresent() && !existingBranch.get().getId().equals(id)) {
                throw new RuntimeException("Branch with email '" + branchDetails.getEmail() + "' already exists");
            }
        }

        // Update all fields
        branch.setName(branchDetails.getName());
        branch.setLocation(branchDetails.getLocation());
        branch.setContactDetails(branchDetails.getContactDetails());
        branch.setAddress(branchDetails.getAddress());
        branch.setPhone(branchDetails.getPhone());
        branch.setEmail(branchDetails.getEmail());
        branch.setManager(branchDetails.getManager());
        branch.setDescription(branchDetails.getDescription());
        branch.setIsActive(branchDetails.getIsActive());

        return branchRepository.save(branch);
    }

    public void deleteBranch(Long id) {
        Optional<Branch> optionalBranch = branchRepository.findById(id);
        if (!optionalBranch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + id);
        }
        branchRepository.deleteById(id);
    }

    public List<Branch> searchBranches(String searchTerm, Boolean isActive) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            if (isActive != null) {
                return branchRepository.findByIsActive(isActive);
            }
            return branchRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
        }
        
        searchTerm = searchTerm.trim();
        
        if (isActive != null) {
            return branchRepository.findByIsActiveAndSearchTerm(isActive, searchTerm);
        }
        
        return branchRepository.findBySearchTerm(searchTerm);
    }

    public List<Branch> getActiveBranches() {
        return branchRepository.findByIsActive(true);
    }

    public List<Branch> getInactiveBranches() {
        return branchRepository.findByIsActive(false);
    }

    public Branch toggleBranchStatus(Long id) {
        Optional<Branch> optionalBranch = branchRepository.findById(id);
        if (!optionalBranch.isPresent()) {
            throw new RuntimeException("Branch not found with id: " + id);
        }

        Branch branch = optionalBranch.get();
        branch.setIsActive(!branch.getIsActive());
        return branchRepository.save(branch);
    }
}
