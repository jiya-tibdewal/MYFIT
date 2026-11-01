package com.myfit.myfit_backend.controller;

import com.myfit.myfit_backend.entity.ClosetItem;
import com.myfit.myfit_backend.repository.ClosetItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/closet")
@CrossOrigin(origins = "http://localhost:5173")
public class ClosetItemController {

    private final ClosetItemRepository closetItemRepository;

    public ClosetItemController(ClosetItemRepository closetItemRepository) {
        this.closetItemRepository = closetItemRepository;
    }

    @PostMapping
    public ResponseEntity<?> addClosetItem(@RequestBody ClosetItem item) {

        if (item.getUserId() == null ||
            item.getUserId() <= 0 ||
            item.getItemName() == null ||
            item.getItemName().isBlank() ||
            item.getCategory() == null ||
            item.getCategory().isBlank() ||
            item.getSize() == null ||
            item.getSize().isBlank() ||
            item.getPrice() == null ||
            item.getPrice() <= 0) {

            return ResponseEntity.badRequest().body(
                Map.of("message", "Please provide valid item details.")
            );
        }

        ClosetItem savedItem = closetItemRepository.save(item);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserClosetItems(@PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Invalid user ID.")
            );
        }

        List<ClosetItem> items =
            closetItemRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return ResponseEntity.ok(items);
    }
}