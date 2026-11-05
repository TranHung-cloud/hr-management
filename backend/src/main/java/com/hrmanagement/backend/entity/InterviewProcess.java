package com.hrmanagement.backend.entity;

import com.hrmanagement.backend.entity.id.InterviewProcessId;
import com.hrmanagement.backend.entity.enums.InterviewProcessStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class InterviewProcess {
    @EmbeddedId
    private InterviewProcessId ipId;

    @CreationTimestamp
    private LocalDateTime ipCreatedAt;

    @Enumerated(EnumType.STRING)
    private InterviewProcessStatus status = InterviewProcessStatus.UNSCHEDULED;

    private LocalDateTime scheduledAt;
    private String feedback;

    @ManyToOne()
    @JoinColumn(name = "app_id", nullable = false)
    private Application application;

    @ManyToOne()
    @MapsId("isId")
    @JoinColumn(name = "is_id", nullable = false)
    private InterviewStage interviewStage;

    @ManyToOne
    @JoinColumn(name = "acc_id")
    private Account interviewer;

    @ManyToOne
    @JoinColumn(name = "im_id", nullable = false)
    private InterviewMethod interviewMethod;
}
