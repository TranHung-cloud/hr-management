package com.hrmanagement.backend.mapper;

import com.hrmanagement.backend.dto.RecruitmentDtos.*;
import com.hrmanagement.backend.entity.*;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class RecruitmentMapper {
    public Stage stage(InterviewStage s) { return new Stage(s.getIsId(), s.getIsName(), s.getIsOrder()); }
    public Job job(JobDescription j) { return new Job(j.getJdId(), j.getJdTitle(), j.getDepartment() == null ? null : j.getDepartment().getDepName(), j.getJdStatus()); }
    public Option account(Account a) { return a == null ? null : new Option(a.getAccId(), a.getAccName()); }
    public CandidateInfo candidate(Candidate c) {
        Account a = c.getAccount();
        return new CandidateInfo(c.getCandId(), a == null ? null : a.getAccName(), a == null ? null : a.getAccEmail(),
                a == null ? null : a.getAccPhone(), c.getCandCvPath(), c.getCandExpYear(),
                c.getDt() == null ? null : c.getDt().getDtName(), c.getCandMajor(),
                c.getSkills() == null ? List.of() : c.getSkills().stream().map(Skill::getSkillName).filter(Objects::nonNull).sorted().toList());
    }
    public InterviewView interview(InterviewProcess i) {
        Application a = i.getApplication();
        return new InterviewView(new InterviewKey(i.getIpId().getAppId(), i.getIpId().getIsId()),
                candidate(a.getCandidate()), job(a.getJobDescription()), stage(i.getInterviewStage()), i.getIpStatus(),
                i.getIpCreatedAt(), i.getIpScheduledAt(), i.getIpFeedback(), account(i.getInterviewer()),
                i.getInterviewMethod() == null ? null : new Option(i.getInterviewMethod().getImId(), i.getInterviewMethod().getImName()), a.getAppStatus());
    }
    public ApplicationView application(Application a, InterviewProcess current) {
        return new ApplicationView(a.getAppId(), a.getCandidate().getCandId(), a.getJobDescription().getJdId(), candidate(a.getCandidate()),
                job(a.getJobDescription()), a.getAppStatus(), current == null ? null : interview(current));
    }
}
