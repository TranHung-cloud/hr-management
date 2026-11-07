package com.hrmanagement.backend.notification.event;

public record AdminAccountCreatedEvent(
        String email,
        String rawPassword,
        String roleName) {
}