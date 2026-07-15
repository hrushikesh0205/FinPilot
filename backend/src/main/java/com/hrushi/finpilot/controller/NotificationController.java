package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.entity.Notification;
import com.hrushi.finpilot.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notification", description = "Notification management APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // GET /api/notifications — all notifications for the logged-in user
    @GetMapping
    @Operation(summary = "Get all notifications for the logged-in user")
    public ResponseEntity<List<Notification>> getAllNotifications(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.getAllNotifications(email));
    }

    // GET /api/notifications/unread-count — badge count for navbar
    @GetMapping("/unread-count")
    @Operation(summary = "Get the unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        long count = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PATCH /api/notifications/{id}/read — mark one as read
    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a specific notification as read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id,
                                                    Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.markAsRead(id, email));
    }

    // PATCH /api/notifications/read-all — mark all as read
    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.markAllAsRead(email));
    }

    // DELETE /api/notifications/{id} — delete a single notification
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id,
                                                      Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.deleteNotification(id, email));
    }
}
