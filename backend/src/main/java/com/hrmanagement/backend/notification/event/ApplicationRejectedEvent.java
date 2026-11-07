package com.hrmanagement.backend.notification.event;

public record ApplicationRejectedEvent(
        String email,
        String candidateName,
        String jobTitle) {
}