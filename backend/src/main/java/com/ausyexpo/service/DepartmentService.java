package com.ausyexpo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ausyexpo.model.Branch;
import com.ausyexpo.model.Department;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.DepartmentRepository;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private BranchRepository branchRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public List<Department> getDepartmentsByBranch(Long branchId) {
        return departmentRepository.findByBranchId(branchId);
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(Department department) {
        // Validate branch exists
        if (department.getBranch() != null && department.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(department.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + department.getBranch().getId());
            }
            department.setBranch(branch.get());
        } else {
            throw new RuntimeException("Branch is required");
        }
        
        // Check if department name already exists in the same branch
        if (departmentRepository.existsByNameAndBranchId(department.getName(), department.getBranch().getId())) {
            throw new RuntimeException("Department with name '" + department.getName() + "' already exists in this branch");
        }
        
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department departmentDetails) {
        Optional<Department> optionalDepartment = departmentRepository.findById(id);
        if (!optionalDepartment.isPresent()) {
            throw new RuntimeException("Department not found with id: " + id);
        }

        Department department = optionalDepartment.get();

        // Validate branch exists if provided
        if (departmentDetails.getBranch() != null && departmentDetails.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(departmentDetails.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + departmentDetails.getBranch().getId());
            }
            
            // Check if department name already exists in the target branch (excluding current department)
            Optional<Department> existingDept = departmentRepository.findByNameAndBranchId(
                departmentDetails.getName(), departmentDetails.getBranch().getId());
            if (existingDept.isPresent() && !existingDept.get().getId().equals(id)) {
                throw new RuntimeException("Department with name '" + departmentDetails.getName() + "' already exists in this branch");
            }
            
            department.setBranch(branch.get());
        }

        // Update fields
        department.setName(departmentDetails.getName());

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        Optional<Department> optionalDepartment = departmentRepository.findById(id);
        if (!optionalDepartment.isPresent()) {
            throw new RuntimeException("Department not found with id: " + id);
        }
        
        Department department = optionalDepartment.get();
        
        // Check if department has employees
        if (department.getEmployees() != null && !department.getEmployees().isEmpty()) {
            throw new RuntimeException("Cannot delete department. It has " + department.getEmployees().size() + " employees assigned to it.");
        }
        
        departmentRepository.deleteById(id);
    }

    public List<Department> searchDepartments(Long branchId, String name) {
        return departmentRepository.findBySearchCriteria(branchId, name);
    }

    public List<Object[]> getDepartmentsWithEmployeeCount(Long branchId) {
        return departmentRepository.findDepartmentsWithEmployeeCount(branchId);
    }

    public long countDepartmentsByBranch(Long branchId) {
        return departmentRepository.countByBranchId(branchId);
    }
}
