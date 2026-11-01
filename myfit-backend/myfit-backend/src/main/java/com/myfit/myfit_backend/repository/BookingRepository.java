
package com.myfit.myfit_backend.repository;

import com.myfit.myfit_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByProductIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Long productId,
        LocalDate requestedEnd,
        LocalDate requestedStart
    );

    List<Booking> findAllByUserIdOrderByIdDesc(Long userId);
}
