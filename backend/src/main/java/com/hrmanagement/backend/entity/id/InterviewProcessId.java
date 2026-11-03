package com.hrmanagement.backend.entity.id;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class InterviewProcessId implements Serializable {
    @Column(name = "cand_id")
    private UUID candId;
    @Column(name = "job_id")
    private UUID jobId;
    @Column(name = "is_id")
    private UUID isId;
}
