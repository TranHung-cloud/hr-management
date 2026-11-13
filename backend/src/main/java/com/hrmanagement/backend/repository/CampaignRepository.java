package com.hrmanagement.backend.repository;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hrmanagement.backend.entity.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
}