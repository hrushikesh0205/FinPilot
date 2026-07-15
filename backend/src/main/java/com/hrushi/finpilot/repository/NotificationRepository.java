package com.hrushi.finpilot.repository;

import com.hrushi.finpilot.entity.Notification;
import com.hrushi.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a user, newest first
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Find by id and user (ownership check)
    Optional<Notification> findByIdAndUser(Long id, User user);

    // Count unread notifications for a user
    long countByUserAndReadFalse(User user);

    // Mark all as read for a user
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user AND n.read = false")
    int markAllReadByUser(User user);
}
