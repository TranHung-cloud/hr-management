package com.hrmanagement.backend.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Clock;
import java.time.ZoneId;
@Configuration
public class ApiConfig {
    @Bean
    Clock recruitmentClock(@Value("${app.time-zone:Asia/Bangkok}") String zone) {
        return Clock.system(ZoneId.of(zone));
    }
}
