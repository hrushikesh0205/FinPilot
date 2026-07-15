package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.LoginRequest;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.repository.UserRepository;
import com.hrushi.finpilot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register User
    public User registerUser(User user) {

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("This email is already registered. Please sign in instead.");
        }

        // Encrypt Password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save User
        return userRepository.save(user);
    }

    // Login User
    public String loginUser(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }

    // Get current user profile
    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Update profile details
    @Transactional
    public User updateProfile(String email, String newName, String newPhone) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(newName.trim());
        if (newPhone != null) {
            user.setPhoneNumber(newPhone.trim());
        }
        return userRepository.save(user);
    }

    // Upload profile image
    @Transactional
    public User uploadProfileImage(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        try {
            // Use an absolute path for safety during development
            String uploadDir = System.getProperty("user.dir") + "/uploads/profile_images/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") ? 
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String newFilename = UUID.randomUUID().toString() + extension;

            Path targetLocation = Paths.get(uploadDir + newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Save the relative URL path in DB
            String fileUrl = "/uploads/profile_images/" + newFilename;
            user.setProfileImage(fileUrl);
            return userRepository.save(user);
            
        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }

    // Change password — verifies current password before updating
    @Transactional
    public String changePassword(String email, String currentPassword, String newPassword) {
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password changed successfully";
    }
}