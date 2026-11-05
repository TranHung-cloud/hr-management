package com.hrmanagement.backend.notification.listener;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.hrmanagement.backend.notification.event.AdminAccountCreatedEvent;
import com.hrmanagement.backend.notification.event.AdminPasswordResetEvent;
import com.hrmanagement.backend.notification.event.ApplicationAcceptedEvent;
import com.hrmanagement.backend.notification.event.ApplicationRejectedEvent;
import com.hrmanagement.backend.notification.service.EmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailEventListener {

    private final EmailService emailService;

    @Async("emailExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAdminAccountCreated(AdminAccountCreatedEvent event) {
        emailService.sendAdminAccountCredentials(
                event.email(),
                event.rawPassword(),
                event.roleName());
    }

    @Async("emailExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAdminPasswordReset(AdminPasswordResetEvent event) {
        emailService.sendAdminPasswordResetEmail(
                event.email(),
                event.rawPassword());
    }

    @Async("emailExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleApplicationAccepted(ApplicationAcceptedEvent event) {
        emailService.sendEmailForAcceptedApplications(
                event.email(),
                event.candidateName(),
                event.jobTitle());
    }

    @Async("emailExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleApplicationRejected(ApplicationRejectedEvent event) {
        emailService.sendEmailForRejectedApplications(
                event.email(),
                event.candidateName(),
                event.jobTitle());
    }
}
