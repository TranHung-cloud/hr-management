package com.hrmanagement.backend.notification.event;

public record ApplicationAcceptedEvent(
        String email,
        String candidateName,
        String jobTitle) {
}