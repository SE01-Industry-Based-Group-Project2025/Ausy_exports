package com.ausyexpo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ausyexpo.model.Agreement;
import com.ausyexpo.model.Branch;
import com.ausyexpo.model.User;
import com.ausyexpo.repository.AgreementRepository;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.UserRepository;

@Service
public class AgreementService {

    @Autowired
    private AgreementRepository agreementRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Agreement> getAllAgreements() {
        return agreementRepository.findAll();
    }

    public List<Agreement> getAgreementsByBranch(Long branchId) {
        return agreementRepository.findByBranchIdOrderByCreatedAtDesc(branchId);
    }

    public Optional<Agreement> getAgreementById(Long id) {
        return agreementRepository.findById(id);
    }

    public Agreement createAgreement(Agreement agreement) {
        validateAgreement(agreement);
        
        // Set branch to null since we removed branch selection from frontend
        agreement.setBranch(null);
        
        // Calculate duration in months if dates are provided
        if (agreement.getStartDate() != null && agreement.getEndDate() != null) {
            long months = java.time.temporal.ChronoUnit.MONTHS.between(
                agreement.getStartDate(), agreement.getEndDate());
            agreement.setDurationMonths((int) months);
        }
        
        // Set default status if not provided
        if (agreement.getStatus() == null || agreement.getStatus().isEmpty()) {
            agreement.setStatus("Draft");
        }
        
        // Set default priority if not provided
        if (agreement.getPriority() == null || agreement.getPriority().isEmpty()) {
            agreement.setPriority("Medium");
        }
        
        return agreementRepository.save(agreement);
    }

    public Agreement updateAgreement(Long id, Agreement agreementDetails) {
        Optional<Agreement> optionalAgreement = agreementRepository.findById(id);
        if (optionalAgreement.isPresent()) {
            Agreement agreement = optionalAgreement.get();
            
            validateAgreement(agreementDetails);
            
            agreement.setTitle(agreementDetails.getTitle());
            agreement.setAgreementType(agreementDetails.getAgreementType());
            agreement.setClientName(agreementDetails.getClientName());
            agreement.setClientContact(agreementDetails.getClientContact());
            agreement.setClientEmail(agreementDetails.getClientEmail());
            agreement.setDescription(agreementDetails.getDescription());
            agreement.setContractValue(agreementDetails.getContractValue());
            agreement.setStartDate(agreementDetails.getStartDate());
            agreement.setEndDate(agreementDetails.getEndDate());
            agreement.setStatus(agreementDetails.getStatus());
            agreement.setTerms(agreementDetails.getTerms());
            agreement.setDeliverables(agreementDetails.getDeliverables());
            agreement.setPaymentTerms(agreementDetails.getPaymentTerms());
            agreement.setIsActive(agreementDetails.getIsActive());
            agreement.setDocumentPath(agreementDetails.getDocumentPath());
            agreement.setPriority(agreementDetails.getPriority());
            
            // Set branch to null since we removed branch selection from frontend
            agreement.setBranch(null);
            
            // Recalculate duration if dates changed
            if (agreement.getStartDate() != null && agreement.getEndDate() != null) {
                long months = java.time.temporal.ChronoUnit.MONTHS.between(
                    agreement.getStartDate(), agreement.getEndDate());
                agreement.setDurationMonths((int) months);
            }
            
            return agreementRepository.save(agreement);
        } else {
            throw new RuntimeException("Agreement not found with id: " + id);
        }
    }

    public void deleteAgreement(Long id) {
        if (agreementRepository.existsById(id)) {
            agreementRepository.deleteById(id);
        } else {
            throw new RuntimeException("Agreement not found with id: " + id);
        }
    }

    public List<Agreement> searchAgreements(Long branchId, String searchTerm) {
        if (branchId != null) {
            return agreementRepository.searchAgreements(branchId, searchTerm);
        } else {
            return agreementRepository.searchAllAgreements(searchTerm);
        }
    }

    public List<Agreement> getAgreementsByStatus(String status) {
        return agreementRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Agreement> getAgreementsByType(String type) {
        return agreementRepository.findByAgreementTypeOrderByCreatedAtDesc(type);
    }

    public List<Agreement> getActiveAgreements() {
        return agreementRepository.findByIsActiveOrderByCreatedAtDesc(true);
    }

    public List<Agreement> getExpiringAgreements(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);
        return agreementRepository.findAgreementsExpiringBetween(today, futureDate);
    }

    public List<Agreement> getBranchExpiringAgreements(Long branchId, int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(daysAhead);
        return agreementRepository.findBranchAgreementsExpiringBetween(branchId, today, futureDate);
    }

    public Long getActiveAgreementsCount(Long branchId) {
        if (branchId != null) {
            return agreementRepository.countActiveAgreementsByBranch(branchId);
        } else {
            return agreementRepository.countAllActiveAgreements();
        }
    }

    public Double getTotalContractValue(Long branchId) {
        if (branchId != null) {
            Double value = agreementRepository.getTotalContractValueByBranch(branchId);
            return value != null ? value : 0.0;
        } else {
            Double value = agreementRepository.getTotalContractValue();
            return value != null ? value : 0.0;
        }
    }

    private void validateAgreement(Agreement agreement) {
        if (agreement.getTitle() == null || agreement.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Agreement title is required");
        }
        
        if (agreement.getAgreementType() == null || agreement.getAgreementType().trim().isEmpty()) {
            throw new RuntimeException("Agreement type is required");
        }
        
        if (agreement.getClientName() == null || agreement.getClientName().trim().isEmpty()) {
            throw new RuntimeException("Client name is required");
        }
        
        if (agreement.getContractValue() == null || agreement.getContractValue().doubleValue() <= 0) {
            throw new RuntimeException("Contract value must be greater than 0");
        }
        
        if (agreement.getStartDate() == null) {
            throw new RuntimeException("Start date is required");
        }
        
        if (agreement.getEndDate() == null) {
            throw new RuntimeException("End date is required");
        }
        
        if (agreement.getStartDate() != null && agreement.getEndDate() != null && 
            agreement.getStartDate().isAfter(agreement.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }
        
        // Validate agreement type
        String[] validTypes = {"Export Contract", "Import Contract", "Partnership Agreement", 
                              "Service Agreement", "Supply Agreement", "Distribution Agreement", 
                              "Manufacturing Agreement", "Licensing Agreement"};
        boolean validType = false;
        for (String type : validTypes) {
            if (type.equals(agreement.getAgreementType())) {
                validType = true;
                break;
            }
        }
        if (!validType) {
            throw new RuntimeException("Invalid agreement type");
        }
        
        // Validate status
        if (agreement.getStatus() != null) {
            String[] validStatuses = {"Draft", "Under Review", "Approved", "Active", 
                                    "Completed", "Cancelled", "Expired", "Suspended"};
            boolean validStatus = false;
            for (String status : validStatuses) {
                if (status.equals(agreement.getStatus())) {
                    validStatus = true;
                    break;
                }
            }
            if (!validStatus) {
                throw new RuntimeException("Invalid agreement status");
            }
        }
        
        // Validate priority
        if (agreement.getPriority() != null) {
            String[] validPriorities = {"Low", "Medium", "High", "Critical"};
            boolean validPriority = false;
            for (String priority : validPriorities) {
                if (priority.equals(agreement.getPriority())) {
                    validPriority = true;
                    break;
                }
            }
            if (!validPriority) {
                throw new RuntimeException("Invalid priority level");
            }
        }
    }
}
