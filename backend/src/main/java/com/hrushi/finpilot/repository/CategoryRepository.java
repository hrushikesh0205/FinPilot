package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Category;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Get all categories of the logged-in user
    List<Category> findByUser(User user);

    // Find category by id and logged-in user (ownership check)
    Optional<Category> findByIdAndUser(Long id, User user);
}
