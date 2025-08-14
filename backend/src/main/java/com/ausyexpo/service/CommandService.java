package com.ausyexpo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ausyexpo.model.Command;
import com.ausyexpo.model.User;
import com.ausyexpo.model.Branch;
import com.ausyexpo.repository.CommandRepository;
import com.ausyexpo.repository.UserRepository;
import com.ausyexpo.repository.BranchRepository;

@Service
@Transactional
public class CommandService {

    @Autowired
    private CommandRepository commandRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchRepository branchRepository;

    public List<Command> getAllCommands() {
        return commandRepository.findAllWithDetails();
    }

    public Optional<Command> getCommandById(Long id) {
        return commandRepository.findById(id);
    }

    public List<Command> getCommandsByIssuedBy(Long issuedById) {
        return commandRepository.findByIssuedByIdOrderByCreatedAtDesc(issuedById);
    }

    public List<Command> getCommandsByAssignedTo(Long assignedToId) {
        return commandRepository.findByAssignedToIdOrderByCreatedAtDesc(assignedToId);
    }

    public List<Command> getCommandsByBranch(Long branchId) {
        return commandRepository.findByBranchIdOrderByCreatedAtDesc(branchId);
    }

    public List<Command> getCommandsByStatus(Command.Status status) {
        return commandRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public List<Command> getCommandsByPriority(Command.Priority priority) {
        return commandRepository.findByPriorityOrderByCreatedAtDesc(priority);
    }

    public List<Command> getCommandsByType(Command.CommandType type) {
        return commandRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    public List<Command> getOverdueCommands() {
        return commandRepository.findOverdueCommands(LocalDateTime.now());
    }

    public List<Command> getCommandsDueBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return commandRepository.findByDueDateBetween(startDate, endDate);
    }

    public Command createCommand(Command command) {
        validateCommand(command);
        
        // Set issued by user
        if (command.getIssuedBy() != null && command.getIssuedBy().getId() != null) {
            User issuedBy = userRepository.findById(command.getIssuedBy().getId())
                .orElseThrow(() -> new RuntimeException("Issued by user not found"));
            command.setIssuedBy(issuedBy);
        }

        // Set assigned to user if provided
        if (command.getAssignedTo() != null && command.getAssignedTo().getId() != null) {
            User assignedTo = userRepository.findById(command.getAssignedTo().getId())
                .orElseThrow(() -> new RuntimeException("Assigned to user not found"));
            command.setAssignedTo(assignedTo);
        }

        // Set branch to null since we removed branch selection from frontend
        command.setBranch(null);

        return commandRepository.save(command);
    }

    public Command updateCommand(Long id, Command commandDetails) {
        Command command = commandRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Command not found with id: " + id));

        validateCommand(commandDetails);

        // Update fields
        command.setTitle(commandDetails.getTitle());
        command.setDescription(commandDetails.getDescription());
        command.setType(commandDetails.getType());
        command.setPriority(commandDetails.getPriority());
        command.setStatus(commandDetails.getStatus());
        command.setDueDate(commandDetails.getDueDate());
        command.setNotes(commandDetails.getNotes());

        // Update assigned to user if provided
        if (commandDetails.getAssignedTo() != null && commandDetails.getAssignedTo().getId() != null) {
            User assignedTo = userRepository.findById(commandDetails.getAssignedTo().getId())
                .orElseThrow(() -> new RuntimeException("Assigned to user not found"));
            command.setAssignedTo(assignedTo);
        } else {
            command.setAssignedTo(null);
        }

        // Set branch to null since we removed branch selection from frontend
        command.setBranch(null);

        return commandRepository.save(command);
    }

    public Command updateCommandStatus(Long id, Command.Status status) {
        Command command = commandRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Command not found with id: " + id));

        command.setStatus(status);
        if (status == Command.Status.COMPLETED && command.getCompletedDate() == null) {
            command.setCompletedDate(LocalDateTime.now());
        }

        return commandRepository.save(command);
    }

    public void deleteCommand(Long id) {
        Command command = commandRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Command not found with id: " + id));
        
        commandRepository.delete(command);
    }

    public List<Command> searchCommands(Long branchId, Command.Status status, 
                                       Command.Priority priority, Command.CommandType type, 
                                       Long assignedToId) {
        return commandRepository.searchCommands(branchId, status, priority, type, assignedToId);
    }

    public long countCommandsByStatus(Command.Status status) {
        return commandRepository.countByStatus(status);
    }

    public long countCommandsByUserAndStatus(Long userId, Command.Status status) {
        return commandRepository.countByAssignedToIdAndStatus(userId, status);
    }

    public List<Object[]> getCommandStatusStatistics() {
        return commandRepository.getCommandStatusStatistics();
    }

    public List<Object[]> getCommandPriorityStatistics() {
        return commandRepository.getCommandPriorityStatistics();
    }

    private void validateCommand(Command command) {
        if (command.getTitle() == null || command.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Command title is required");
        }
        
        if (command.getDescription() == null || command.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Command description is required");
        }
        
        if (command.getType() == null) {
            throw new RuntimeException("Command type is required");
        }
        
        if (command.getIssuedBy() == null || command.getIssuedBy().getId() == null) {
            throw new RuntimeException("Command must have an issuer");
        }

        if (command.getDueDate() != null && command.getDueDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Due date cannot be in the past");
        }
    }
}
