package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Account;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Get all accounts for a user
    List<Account> findByUser(User user);

    // Ownership check
    Optional<Account> findByIdAndUser(Long id, User user);

    // Find the current default account for a user
    Optional<Account> findByUserAndIsDefaultTrue(User user);

    // Reset all accounts' default flag for a user (used before setting a new default)
    @Modifying
    @Transactional
    @Query("UPDATE Account a SET a.isDefault = false WHERE a.user = :user")
    void clearDefaultForUser(User user);
}
