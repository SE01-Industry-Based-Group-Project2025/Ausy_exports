package com.ausyexpo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ausyexpo.model.User;
import com.ausyexpo.service.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userService.getUserByEmail("admin@ausyexpo.com").isPresent()) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@ausyexpo.com");
            admin.setPassword("admin123");
            admin.setPhone("+1234567890");
            admin.setAddress("AUSY EXPO Head Office");
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);

            userService.createUser(admin);
            System.out.println("Default admin user created successfully!");
            System.out.println("Email: admin@ausyexpo.com");
            System.out.println("Password: admin123");
        }
    }
}
