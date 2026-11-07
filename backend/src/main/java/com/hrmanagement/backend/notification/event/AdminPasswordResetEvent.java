package com.hrmanagement.backend.notification.event;

public record AdminPasswordResetEvent(
        String email,
        String rawPassword) {
}