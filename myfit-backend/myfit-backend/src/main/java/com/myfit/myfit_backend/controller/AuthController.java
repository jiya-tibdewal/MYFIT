package com.myfit.myfit_backend.controller;
import com.myfit.myfit_backend.dto.LoginRequest;
import com.myfit.myfit_backend.dto.SignupRequest;
import com.myfit.myfit_backend.entity.User;
import com.myfit.myfit_backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest request) {

        if (request.name() == null
                || request.name().isBlank()
                || request.email() == null
                || request.email().isBlank()
                || request.password() == null
                || request.password().length() < 8) {

            return ResponseEntity.badRequest().body(
                Map.of(
                    "message",
                    "Enter your name and email; password must be at least 8 characters."
                )
            );
        }

        String email = request.email()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of(
                    "message",
                    "Email is already registered. Please login."
                )
            );
        }

        User user = new User(
                request.name().trim(),
                email,
                encoder.encode(request.password())
        );

        User saved = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "message", "Signup successful.",
                "userId", saved.getId()
            )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        if (request.email() == null
                || request.email().isBlank()
                || request.password() == null
                || request.password().isEmpty()) {

            return ResponseEntity.badRequest().body(
                Map.of(
                    "message",
                    "Email and password are required."
                )
            );
        }

        String email = request.email()
                .trim()
                .toLowerCase();

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message",
                        "Invalid email or password."
                    ));
        }

        User user = optionalUser.get();
        String storedPassword = user.getPassword();
        String enteredPassword = request.password();

        boolean passwordMatches = false;

        if (storedPassword != null) {
            // Current secure password format
            if (storedPassword.startsWith("$2")
                    && encoder.matches(
                        enteredPassword, storedPassword)) {

                passwordMatches = true;

            } else if (storedPassword.equals(enteredPassword)) {

                // Legacy account: upgrade a matching plain-text
                // password to BCrypt after successful verification.
                user.setPassword(encoder.encode(enteredPassword));
                userRepository.save(user);

                passwordMatches = true;
            }
        }

        if (!passwordMatches) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message",
                        "Invalid email or password."
                    ));
        }

        return ResponseEntity.ok(
            Map.of(
                "message", "Login successful.",
                "userId", user.getId(),
                "name", user.getName()
            )
        );
    }
}
