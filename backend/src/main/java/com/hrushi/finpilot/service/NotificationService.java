package com.hrushi.finpilot.service;

import com.hrushi.finpilot.entity.Notification;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.NotificationRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // ── Internal helper — called by other services ──────────────────────────
    // Propagation.REQUIRES_NEW → runs in its own independent transaction.
    // If notification insert fails, it ONLY rolls back the notification
    // and never rolls back the caller's expense/category/budget transaction.
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createNotification(User user, String type, String title, String message) {
        try {
            Notification notification = new Notification(type, title, message, user);
            notificationRepository.save(notification);
        } catch (Exception e) {
            // Log the error but do NOT rethrow — notification failure must
            // never cause expense, budget, or category operations to fail.
            log.error("Failed to create notification for user={} type={}: {}",
                    user.getEmail(), type, e.getMessage());
        }
    }

    // ── Get all notifications for logged-in user (newest first) ─────────────
    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications(String email) {
        User user = getUser(email);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // ── Get unread count for navbar badge ────────────────────────────────────
    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = getUser(email);
        return notificationRepository.countByUserAndReadFalse(user);
    }

    // ── Mark a single notification as read ───────────────────────────────────
    @Transactional
    public Notification markAsRead(Long id, String email) {
        User user = getUser(email);
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // ── Mark ALL notifications as read ───────────────────────────────────────
    @Transactional
    public String markAllAsRead(String email) {
        User user = getUser(email);
        int updated = notificationRepository.markAllReadByUser(user);
        return updated + " notification(s) marked as read";
    }

    // ── Delete a single notification ─────────────────────────────────────────
    @Transactional
    public String deleteNotification(Long id, String email) {
        User user = getUser(email);
        Notification notification = notificationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notificationRepository.delete(notification);
        return "Notification deleted";
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
