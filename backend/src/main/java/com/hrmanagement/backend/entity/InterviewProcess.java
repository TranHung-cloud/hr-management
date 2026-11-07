package com.hrmanagement.backend.entity;

import com.hrmanagement.backend.entity.id.InterviewProcessId;
import com.hrmanagement.backend.entity.enums.InterviewProcessStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Setter
public class InterviewProcess {
    @EmbeddedId
    private InterviewProcessId ipId;

    @CreationTimestamp
    private LocalDateTime ipCreatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewProcessStatus ipStatus = InterviewProcessStatus.UNSCHEDULED;

    private LocalDateTime ipScheduledAt;
    @Column(columnDefinition = "text")
    private String ipFeedback;

    @ManyToOne()
    @MapsId("appId")
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
    @JoinColumn(name = "im_id")
    private InterviewMethod interviewMethod;
}
