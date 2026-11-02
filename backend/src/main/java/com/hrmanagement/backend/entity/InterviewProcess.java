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
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private InterviewProcessStatus status = InterviewProcessStatus.UNSCHEDULED;

    private LocalDateTime scheduledAt;
    private String feedback;

    @ManyToOne(optional = false)
    @JoinColumns({
            @JoinColumn(name = "cand_id", referencedColumnName = "cand_id", insertable = false, updatable = false),
            @JoinColumn(name = "job_id", referencedColumnName = "job_id", insertable = false, updatable = false)
    })
    private Application application;

    @ManyToOne
    @JoinColumn(name = "acc_id")
    private Account interviewer;

    @ManyToOne(optional = false)
    @MapsId("isId")
    @JoinColumn(name = "is_id", nullable = false)
    private InterviewStage interviewStage;

    @ManyToOne
    @JoinColumn(name = "im_id")
    private InterviewMethod interviewMethod;
}
