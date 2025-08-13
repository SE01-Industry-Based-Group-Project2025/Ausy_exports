package com.ausyexpo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ausyexpo.dto.JwtAuthenticationResponse;
import com.ausyexpo.dto.LoginRequest;
import com.ausyexpo.dto.SignUpRequest;
import com.ausyexpo.dto.UserDto;
import com.ausyexpo.model.User;
import com.ausyexpo.security.JwtTokenProvider;
import com.ausyexpo.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userService.getUserByEmail(loginRequest.getEmail()).orElse(null);
            
            if (user != null && !user.getIsActive() && 
                (user.getRole() == User.Role.MANAGER || user.getRole() == User.Role.SUPPLIER || user.getRole() == User.Role.BUYER)) {
                return ResponseEntity.badRequest()
                        .body("Your account is not activated yet. Please contact the owner.");
            }

            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            if (userService.getUserByEmail(signUpRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email is already taken!");
            }

            // Create new user
            User user = new User();
            user.setFirstName(signUpRequest.getFirstName());
            user.setLastName(signUpRequest.getLastName());
            user.setEmail(signUpRequest.getEmail());
            user.setPassword(signUpRequest.getPassword());
            user.setPhone(signUpRequest.getPhone());
            user.setAddress(signUpRequest.getAddress());
            user.setRole(signUpRequest.getRole());
            
            // Only these roles can self-register, but need activation
            if (signUpRequest.getRole() == User.Role.MANAGER || 
                signUpRequest.getRole() == User.Role.SUPPLIER || 
                signUpRequest.getRole() == User.Role.BUYER) {
                user.setIsActive(false);
            }

            UserDto result = userService.createUser(user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }
}
