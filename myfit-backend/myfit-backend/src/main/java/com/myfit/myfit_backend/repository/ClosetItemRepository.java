package com.myfit.myfit_backend.repository;

import com.myfit.myfit_backend.entity.ClosetItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClosetItemRepository extends JpaRepository<ClosetItem, Long> {

    List<ClosetItem> findByUserIdOrderByCreatedAtDesc(Long userId);

}