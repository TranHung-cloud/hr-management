package com.hrmanagement.backend.notification.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.hrmanagement.backend.notification.dto.EmailMessageDTO;
import com.hrmanagement.backend.notification.template.EmailTemplate;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplate emailTemplate;

    public void sendEmail(EmailMessageDTO message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage, true, "UTF-8");

            helper.setTo(message.getTo());
            helper.setSubject(message.getSubject());
            helper.setText(message.getBody(), message.isHtml());

            mailSender.send(mimeMessage);

            log.info("Email sent successfully to: {}", message.getTo());

        } catch (Exception ex) {
            log.error("Failed to send email to {}. Error: {}",
                    message.getTo(), ex.getMessage());
        }
    }

    @Async
    public void sendAdminAccountCredentials(
            String recipientEmail,
            String rawPassword,
            String roleName) {
        String htmlBody = emailTemplate.buildAdminAccountCreatedEmail(
                recipientEmail, rawPassword, roleName);

        EmailMessageDTO message = EmailMessageDTO.builder()
                .to(recipientEmail)
                .subject("[HR Management] Thông tin tài khoản quản trị hệ thống")
                .body(htmlBody)
                .isHtml(true)
                .build();

        sendEmail(message);
    }
}
