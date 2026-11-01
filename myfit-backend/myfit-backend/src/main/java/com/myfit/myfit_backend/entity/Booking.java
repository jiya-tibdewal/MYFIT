package com.myfit.myfit_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long productId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;

    @Column(nullable = false)
    private String status = "CONFIRMED";

    public Booking() {}

    public Booking(Long userId, Long productId,
                   LocalDate startDate, LocalDate endDate,
                   Double totalPrice) {
        this.userId = userId;
        this.productId = productId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalPrice = totalPrice;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getProductId() { return productId; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
}