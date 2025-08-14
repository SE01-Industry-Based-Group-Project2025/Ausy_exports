package com.ausyexpo.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ausyexpo.model.Command;
import com.ausyexpo.service.CommandService;

@RestController
@RequestMapping("/api/commands")
@CrossOrigin(origins = "*")
public class CommandController {

    @Autowired
    private CommandService commandService;

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Command API is working!");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getAllCommands() {
        try {
            List<Command> commands = commandService.getAllCommands();
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Command> getCommandById(@PathVariable Long id) {
        try {
            Optional<Command> command = commandService.getCommandById(id);
            if (command.isPresent()) {
                return ResponseEntity.ok(command.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/issued-by/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsByIssuedBy(@PathVariable Long userId) {
        try {
            List<Command> commands = commandService.getCommandsByIssuedBy(userId);
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assigned-to/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('BUYER') or hasRole('SUPPLIER')")
    public ResponseEntity<List<Command>> getCommandsByAssignedTo(@PathVariable Long userId) {
        try {
            List<Command> commands = commandService.getCommandsByAssignedTo(userId);
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsByBranch(@PathVariable Long branchId) {
        try {
            List<Command> commands = commandService.getCommandsByBranch(branchId);
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsByStatus(@PathVariable String status) {
        try {
            Command.Status commandStatus = Command.Status.valueOf(status.toUpperCase());
            List<Command> commands = commandService.getCommandsByStatus(commandStatus);
            return ResponseEntity.ok(commands);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/priority/{priority}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsByPriority(@PathVariable String priority) {
        try {
            Command.Priority commandPriority = Command.Priority.valueOf(priority.toUpperCase());
            List<Command> commands = commandService.getCommandsByPriority(commandPriority);
            return ResponseEntity.ok(commands);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsByType(@PathVariable String type) {
        try {
            Command.CommandType commandType = Command.CommandType.valueOf(type.toUpperCase());
            List<Command> commands = commandService.getCommandsByType(commandType);
            return ResponseEntity.ok(commands);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getOverdueCommands() {
        try {
            List<Command> commands = commandService.getOverdueCommands();
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/due-between")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> getCommandsDueBetween(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<Command> commands = commandService.getCommandsDueBetween(start, end);
            return ResponseEntity.ok(commands);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<?> createCommand(@RequestBody Command command) {
        try {
            Command createdCommand = commandService.createCommand(command);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCommand);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating command");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<?> updateCommand(@PathVariable Long id, @RequestBody Command commandDetails) {
        try {
            Command updatedCommand = commandService.updateCommand(id, commandDetails);
            return ResponseEntity.ok(updatedCommand);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating command");
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('BUYER') or hasRole('SUPPLIER')")
    public ResponseEntity<?> updateCommandStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Command.Status commandStatus = Command.Status.valueOf(status.toUpperCase());
            Command updatedCommand = commandService.updateCommandStatus(id, commandStatus);
            return ResponseEntity.ok(updatedCommand);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating command status");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    public ResponseEntity<?> deleteCommand(@PathVariable Long id) {
        try {
            commandService.deleteCommand(id);
            return ResponseEntity.ok().body("Command deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting command");
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Command>> searchCommands(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long assignedToId) {
        try {
            Command.Status commandStatus = status != null ? Command.Status.valueOf(status.toUpperCase()) : null;
            Command.Priority commandPriority = priority != null ? Command.Priority.valueOf(priority.toUpperCase()) : null;
            Command.CommandType commandType = type != null ? Command.CommandType.valueOf(type.toUpperCase()) : null;
            
            List<Command> commands = commandService.searchCommands(branchId, commandStatus, commandPriority, commandType, assignedToId);
            return ResponseEntity.ok(commands);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/analytics/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Object[]>> getCommandStatusStatistics() {
        try {
            List<Object[]> analytics = commandService.getCommandStatusStatistics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/analytics/priority")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<List<Object[]>> getCommandPriorityStatistics() {
        try {
            List<Object[]> analytics = commandService.getCommandPriorityStatistics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countCommandsByStatus(@PathVariable String status) {
        try {
            Command.Status commandStatus = Command.Status.valueOf(status.toUpperCase());
            long count = commandService.countCommandsByStatus(commandStatus);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/user/{userId}/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<Long> countCommandsByUserAndStatus(@PathVariable Long userId, @PathVariable String status) {
        try {
            Command.Status commandStatus = Command.Status.valueOf(status.toUpperCase());
            long count = commandService.countCommandsByUserAndStatus(userId, commandStatus);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
