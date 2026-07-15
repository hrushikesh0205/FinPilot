package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.LoginRequest;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /auth/login — returns JWT string
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = userService.loginUser(request);
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // GET /auth/profile — returns profile data for logged-in user
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            User user = userService.getProfile(authentication.getName());
            Map<String, Object> response = new HashMap<>();
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("profileImage", user.getProfileImage());
            response.put("createdAt", user.getCreatedAt());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /auth/profile — body: { name, phone }
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            String newName = body.get("name");
            String newPhone = body.get("phone");
            User updated = userService.updateProfile(authentication.getName(), newName, newPhone);
            Map<String, Object> response = new HashMap<>();
            response.put("name", updated.getName());
            response.put("email", updated.getEmail());
            response.put("phoneNumber", updated.getPhoneNumber());
            response.put("profileImage", updated.getProfileImage());
            response.put("createdAt", updated.getCreatedAt());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // POST /auth/profile/image — form-data: file
    @PostMapping("/profile/image")
    public ResponseEntity<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            User updated = userService.uploadProfileImage(authentication.getName(), file);
            Map<String, Object> response = new HashMap<>();
            response.put("name", updated.getName());
            response.put("email", updated.getEmail());
            response.put("phoneNumber", updated.getPhoneNumber());
            response.put("profileImage", updated.getProfileImage());
            response.put("createdAt", updated.getCreatedAt());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // PUT /auth/profile/password — body: { currentPassword, newPassword }
    @PutMapping("/profile/password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        try {
            String result = userService.changePassword(
                    authentication.getName(),
                    body.get("currentPassword"),
                    body.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("message", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}