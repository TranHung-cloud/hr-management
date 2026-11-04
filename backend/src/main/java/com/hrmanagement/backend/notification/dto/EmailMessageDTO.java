package com.hrmanagement.backend.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmailMessageDTO {
    private String to;
    private String subject;
    private String body;
    @Builder.Default
    private boolean isHtml = true;
}
