package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Subscription;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUser(User user);

    List<Subscription> findByUserAndActive(User user, boolean active);

    Optional<Subscription> findByIdAndUser(Long id, User user);

    boolean existsByUserAndServiceNameIgnoreCase(User user, String serviceName);
}
