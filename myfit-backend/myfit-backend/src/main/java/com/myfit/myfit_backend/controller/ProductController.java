
package com.myfit.myfit_backend.controller;

import com.myfit.myfit_backend.entity.Product;
import com.myfit.myfit_backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() ->
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Product not found."))
            );
    }

    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        if (product.getName() == null
                || product.getName().isBlank()
                || product.getPricePerDay() == null
                || product.getPricePerDay() <= 0) {

            return ResponseEntity.badRequest().body(
                Map.of(
                    "message",
                    "Product name and a positive rental price are required."
                )
            );
        }

        product.setName(product.getName().trim());

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(productRepository.save(product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

        Optional<Product> optionalProduct =
            productRepository.findById(id);

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("message", "Product not found.")
            );
        }

        productRepository.delete(optionalProduct.get());

        return ResponseEntity.ok(
            Map.of("message", "Product deleted successfully.")
        );
    }
}
