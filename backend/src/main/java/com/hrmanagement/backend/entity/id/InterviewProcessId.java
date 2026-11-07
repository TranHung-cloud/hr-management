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
    @Column(name = "app_id")
    private UUID appId;
    @Column(name = "is_id")
    private UUID isId;
}
