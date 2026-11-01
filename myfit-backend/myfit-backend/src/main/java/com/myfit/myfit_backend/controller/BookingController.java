
package com.myfit.myfit_backend.controller;

import com.myfit.myfit_backend.entity.Booking;
import com.myfit.myfit_backend.entity.Product;
import com.myfit.myfit_backend.repository.BookingRepository;
import com.myfit.myfit_backend.repository.UserRepository;
import com.myfit.myfit_backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public BookingController(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request) {

        if (request.userId() == null
                || request.productId() == null
                || request.startDate() == null
                || request.endDate() == null) {
            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "User, product, and rental dates are required.")
            );
        }

        if (!request.endDate().isAfter(request.startDate())
                || request.startDate().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(
                Map.of("message",
                    "Please select valid rental dates.")
            );
        }

        if (userRepository.findById(request.userId()).isEmpty()) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "User not found.")
            );
        }

        var productOpt =
            productRepository.findById(request.productId());

        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Product not found.")
            );
        }

        boolean alreadyBooked =
            bookingRepository
                .existsByProductIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                    request.productId(),
                    request.endDate(),
                    request.startDate()
                );

        if (alreadyBooked) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message",
                    "This item is already booked for those dates.")
            );
        }

        Product product = productOpt.get();

        long days = ChronoUnit.DAYS.between(
            request.startDate(),
            request.endDate()
        );

        double total = days * product.getPricePerDay();

        Booking booking = new Booking(
            request.userId(),
            request.productId(),
            request.startDate(),
            request.endDate(),
            total
        );

        Booking saved = bookingRepository.save(booking);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of(
                "message", "Booking created successfully.",
                "bookingId", saved.getId(),
                "totalPrice", total,
                "status", saved.getStatus()
            )
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(
            @PathVariable Long userId) {

        if (userRepository.findById(userId).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "User not found.")
            );
        }

        List<Map<String, Object>> result =
            bookingRepository.findAllByUserIdOrderByIdDesc(userId)
                .stream()
                .map(booking -> {
                    Product product = productRepository
                        .findById(booking.getProductId())
                        .orElse(null);

                    return Map.<String, Object>of(
                        "bookingId", booking.getId(),
                        "productId", booking.getProductId(),
                        "productName",
                            product == null
                                ? "Product unavailable"
                                : product.getName(),
                        "startDate", booking.getStartDate().toString(),
                        "endDate", booking.getEndDate().toString(),
                        "totalPrice", booking.getTotalPrice(),
                        "status", booking.getStatus()
                    );
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    public record BookingRequest(
        Long userId,
        Long productId,
        LocalDate startDate,
        LocalDate endDate
    ) {}
}
