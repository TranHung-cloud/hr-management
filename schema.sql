-- SETUP HR: chạy toàn bộ file trên database mới trống.
-- Gồm schema, danh mục và dữ liệu mẫu; không cần chạy file schema/sample khác.
-- PostgreSQL tự sinh UUID. Mật khẩu 16 tài khoản mẫu: 123456789 (BCrypt).
-- Có 4 role; 10 tài khoản ứng viên được gán role Ứng viên.
-- acc_is_male: TRUE = nam, FALSE = nữ; acc_status mặc định ACTIVE.
-- Hồ sơ đang xét dùng SUBMITTED; không còn PENDING.
-- File không xóa dữ liệu đã có.

BEGIN;

-- PostgreSQL schema following the revised HR CDM.
-- For an empty database; not a migration for existing tables.
-- app_expcted_sal preserves the spelling in the CDM.
-- acc_status defaults to ACTIVE and accepts ACTIVE/INACTIVE.


CREATE TABLE role (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE department (
    dep_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dep_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE skill (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE degree_type (
    dt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dt_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE campaign (
    cp_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cp_medium VARCHAR(255) NOT NULL,
    cp_source VARCHAR(255) NOT NULL
);

CREATE TABLE interview_stage (
    is_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_name VARCHAR(255) NOT NULL UNIQUE,
    is_order INTEGER NOT NULL UNIQUE
);

CREATE TABLE interview_method (
    im_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    im_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE account (
    acc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    acc_name VARCHAR(255),
    acc_email VARCHAR(255) NOT NULL UNIQUE,
    acc_password VARCHAR(255) NOT NULL,
    acc_is_male BOOLEAN NOT NULL,
    acc_dob DATE,
    acc_phone VARCHAR(255),
    acc_status VARCHAR(255) NOT NULL DEFAULT 'ACTIVE' CHECK (acc_status IN ('ACTIVE', 'INACTIVE')),
    role_id UUID REFERENCES role(role_id) NOT NULL,
    dep_id UUID REFERENCES department(dep_id)
);

CREATE TABLE job_description (
    jd_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jd_title VARCHAR(255) NOT NULL,
    jd_desc TEXT NOT NULL,
    jd_sal_min INTEGER,
    jd_sal_max INTEGER,
    jd_status VARCHAR(255) NOT NULL,
    jd_target INTEGER NOT NULL CHECK (jd_target > 0),
    jd_major VARCHAR(255),
    dep_id UUID REFERENCES department(dep_id) NOT NULL,
    recruiter_id UUID REFERENCES account(acc_id) NOT NULL,
    dt_id UUID REFERENCES degree_type(dt_id),
    CONSTRAINT chk_job_status CHECK (jd_status IN ('DRAFT', 'PUBLISHED'))
);

CREATE TABLE candidate (
    cand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cand_cv_path VARCHAR(255),
    cand_exp_year INTEGER,
    cand_major VARCHAR(255),
    acc_id UUID NOT NULL UNIQUE REFERENCES account(acc_id),
    dt_id UUID REFERENCES degree_type(dt_id)
);

CREATE TABLE application (
    app_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cand_id UUID NOT NULL REFERENCES candidate(cand_id),
    jd_id UUID NOT NULL REFERENCES job_description(jd_id),
    app_expcted_sal INTEGER,
    app_proposal_sal INTEGER,
    app_created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    app_status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    CONSTRAINT chk_application_status CHECK (
        app_status IN ('SUBMITTED', 'ACCEPTED', 'REJECTED')
    )
);

CREATE TABLE skill_candidate (
    cand_id UUID NOT NULL REFERENCES candidate(cand_id),
    skill_id UUID NOT NULL REFERENCES skill(skill_id),
    PRIMARY KEY (cand_id, skill_id)
);

CREATE TABLE skill_job_description (
    jd_id UUID NOT NULL REFERENCES job_description(jd_id),
    skill_id UUID NOT NULL REFERENCES skill(skill_id),
    PRIMARY KEY (jd_id, skill_id)
);

CREATE TABLE campaign_job_description (
    jd_id UUID NOT NULL REFERENCES job_description(jd_id),
    cp_id UUID NOT NULL REFERENCES campaign(cp_id),
    PRIMARY KEY (jd_id, cp_id)
);

CREATE TABLE interview_process (
    app_id UUID NOT NULL REFERENCES application(app_id),
    is_id UUID NOT NULL REFERENCES interview_stage(is_id),
    ip_created_at TIMESTAMP(6) WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_scheduled_at TIMESTAMP(6) WITHOUT TIME ZONE,
    ip_feedback TEXT,
    ip_status VARCHAR(50) NOT NULL DEFAULT 'UNSCHEDULED',
    acc_id UUID REFERENCES account(acc_id),
    im_id UUID REFERENCES interview_method(im_id),
    PRIMARY KEY (app_id, is_id),
    CONSTRAINT chk_interview_process_status CHECK (
        ip_status IN ('SCHEDULED', 'UNSCHEDULED', 'COMPLETED', 'REJECTED')
    )
);

-- Reference/sample data from the supplied script follows below.

-- 1. DEPARTMENT

INSERT INTO department (dep_name) VALUES
('Nhân sự'),
('Công nghệ thông tin'),
('Tài chính'),
('Tiếp thị'),
('Kinh doanh'),
('Kế toán'),
('Chăm sóc khách hàng'),
('Nghiên cứu và phát triển'),
('Vận hành'),
('Pháp chế');

-- 2. CAMPAIGN

INSERT INTO campaign (cp_medium, cp_source) VALUES
('Mạng xã hội', 'Facebook'),
('Mạng xã hội', 'LinkedIn'),
('Trang tuyển dụng', 'TopCV'),
('Trang tuyển dụng', 'VietnamWorks'),
('Trang tuyển dụng', 'ITviec'),
('Giới thiệu', 'Nhân viên giới thiệu'),
('Trường đại học', 'Ngày hội việc làm'),
('Email', 'Bản tin tuyển dụng'),
('Website', 'Website công ty'),
('Quảng cáo', 'Google Ads');

-- 3. DEGREE TYPE

INSERT INTO degree_type (dt_name) VALUES
('Trung học phổ thông'),
('Chứng chỉ nghề'),
('Cao đẳng'),
('Đại học'),
('Thạc sĩ'),
('Tiến sĩ'),
('Chứng chỉ chuyên môn'),
('Văn bằng nghề');

-- 4. SKILL

INSERT INTO skill (skill_name) VALUES
('Lập trình Java'),
('Lập trình Python'),
('Lập trình JavaScript'),
('Lập trình TypeScript'),
('Lập trình C#'),
('Lập trình C++'),
('Lập trình PHP'),
('SQL'),
('PostgreSQL'),
('MySQL'),
('React'),
('Angular'),
('Vue.js'),
('Node.js'),
('Spring Boot'),
('.NET'),
('Laravel'),
('HTML/CSS'),
('Git'),
('Docker'),
('Giao tiếp'),
('Làm việc nhóm'),
('Giải quyết vấn đề'),
('Quản lý dự án'),
('Phân tích dữ liệu'),
('Lãnh đạo'),
('Quản lý thời gian'),
('Tư duy phản biện'),
('Phương pháp Agile/Scrum'),
('REST API');

-- 5. ROLE

INSERT INTO role (role_name) VALUES
('Trưởng phòng nhân sự'),
('Nhân viên tuyển dụng'),
('Người phỏng vấn'),
('Ứng viên');

-- 6. INTERVIEW STAGE

INSERT INTO interview_stage (is_name, is_order) VALUES
('Sàng lọc hồ sơ', 1),
('Phỏng vấn nhân sự', 2),
('Phỏng vấn kỹ thuật', 3),
('Đề nghị tuyển dụng', 4),
('Đã tuyển dụng', 5),
('Từ chối', 6);

-- 7. INTERVIEW METHOD

INSERT INTO interview_method (im_name) VALUES
('Trực tiếp'),
('Điện thoại'),
('Gọi video');

-- 1. ACCOUNT: 6 nhân sự, 10 ứng viên.
INSERT INTO account (acc_name, acc_email, acc_password, acc_is_male, acc_dob, acc_phone, role_id, dep_id) VALUES
    ('Nguyễn Thị Lan', 'lan.nguyen@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '1985-03-12', '0901000001', (SELECT role_id FROM role WHERE role_name = 'Trưởng phòng nhân sự'), (SELECT dep_id FROM department WHERE dep_name = 'Nhân sự')),
    ('Trần Minh Quân', 'quan.tran@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1992-07-25', '0901000002', (SELECT role_id FROM role WHERE role_name = 'Nhân viên tuyển dụng'), (SELECT dep_id FROM department WHERE dep_name = 'Nhân sự')),
    ('Lê Thu Hà', 'ha.le@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '1994-11-02', '0901000003', (SELECT role_id FROM role WHERE role_name = 'Nhân viên tuyển dụng'), (SELECT dep_id FROM department WHERE dep_name = 'Nhân sự')),
    ('Phạm Văn Đức', 'duc.pham@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1988-05-18', '0901000004', (SELECT role_id FROM role WHERE role_name = 'Người phỏng vấn'), (SELECT dep_id FROM department WHERE dep_name = 'Công nghệ thông tin')),
    ('Hoàng Thị Mai', 'mai.hoang@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '1987-09-30', '0901000005', (SELECT role_id FROM role WHERE role_name = 'Người phỏng vấn'), (SELECT dep_id FROM department WHERE dep_name = 'Kế toán')),
    ('Vũ Quốc Bảo', 'bao.vu@congty.vn', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1986-01-08', '0901000006', (SELECT role_id FROM role WHERE role_name = 'Người phỏng vấn'), (SELECT dep_id FROM department WHERE dep_name = 'Tiếp thị')),
    ('Nguyễn Văn An', 'an.nguyen@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1999-02-14', '0912000011', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Trần Thị Bích', 'bich.tran@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '2000-06-21', '0912000012', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Lê Hoàng Nam', 'nam.le@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1996-10-05', '0912000013', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Phạm Thị Cúc', 'cuc.pham@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '1994-04-17', '0912000014', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Đỗ Minh Khôi', 'khoi.do@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '2001-12-09', '0912000015', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Vũ Thanh Tùng', 'tung.vu@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1997-08-23', '0912000016', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Bùi Ngọc Anh', 'anh.bui@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '2002-03-30', '0912000017', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Đặng Quang Huy', 'huy.dang@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1994-01-11', '0912000018', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Ngô Thị Lan Anh', 'lananh.ngo@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', FALSE, '1998-07-07', '0912000019', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL),
    ('Phan Văn Long', 'long.phan@gmail.com', '$2a$10$fnqOuSflUrpM52vm285lhOa3E65/oeOzNweUVrhMxm93FM5eGDW9a', TRUE, '1998-11-26', '0912000020', (SELECT role_id FROM role WHERE role_name = 'Ứng viên'), NULL);

-- 2. JOB_DESCRIPTION
INSERT INTO job_description (jd_title, jd_desc, jd_sal_min, jd_sal_max, jd_status, jd_target, jd_major, dep_id, recruiter_id, dt_id) VALUES
    ('Lập trình viên Java Backend', 'Phát triển và bảo trì các dịch vụ backend bằng Java, Spring Boot, PostgreSQL.', 15000000, 30000000, 'PUBLISHED', 2, 'Công nghệ thông tin', (SELECT dep_id FROM department WHERE dep_name = 'Công nghệ thông tin'), (SELECT acc_id FROM account WHERE acc_email = 'quan.tran@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    ('Lập trình viên Frontend React', 'Xây dựng giao diện web với React, TypeScript, phối hợp cùng đội backend và thiết kế.', 14000000, 28000000, 'PUBLISHED', 2, 'Công nghệ thông tin', (SELECT dep_id FROM department WHERE dep_name = 'Công nghệ thông tin'), (SELECT acc_id FROM account WHERE acc_email = 'quan.tran@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    ('Chuyên viên phân tích dữ liệu', 'Thu thập, làm sạch và phân tích dữ liệu bằng SQL, Python; xây dựng báo cáo cho ban lãnh đạo.', 16000000, 32000000, 'PUBLISHED', 1, 'Khoa học dữ liệu', (SELECT dep_id FROM department WHERE dep_name = 'Công nghệ thông tin'), (SELECT acc_id FROM account WHERE acc_email = 'ha.le@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    ('Kế toán tổng hợp', 'Hạch toán, lập báo cáo tài chính, quyết toán thuế và đối chiếu số liệu định kỳ.', 12000000, 20000000, 'PUBLISHED', 1, 'Kế toán', (SELECT dep_id FROM department WHERE dep_name = 'Kế toán'), (SELECT acc_id FROM account WHERE acc_email = 'ha.le@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    ('Chuyên viên Marketing Digital', 'Lập kế hoạch và triển khai chiến dịch quảng cáo trên Facebook, Google; theo dõi hiệu quả chiến dịch.', 10000000, 18000000, 'PUBLISHED', 3, 'Marketing', (SELECT dep_id FROM department WHERE dep_name = 'Tiếp thị'), (SELECT acc_id FROM account WHERE acc_email = 'ha.le@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Cao đẳng')),
    ('Nhân viên chăm sóc khách hàng', 'Tiếp nhận và xử lý yêu cầu của khách hàng qua điện thoại, email và mạng xã hội.', 8000000, 12000000, 'DRAFT', 5, 'Quản trị kinh doanh', (SELECT dep_id FROM department WHERE dep_name = 'Chăm sóc khách hàng'), (SELECT acc_id FROM account WHERE acc_email = 'quan.tran@congty.vn'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Cao đẳng'));

-- 3. SKILL_JOB_DESCRIPTION
INSERT INTO skill_job_description (jd_id, skill_id)
SELECT j.jd_id, s.skill_id
FROM (VALUES
    ('Lập trình viên Java Backend', 'Lập trình Java'),
    ('Lập trình viên Java Backend', 'Spring Boot'),
    ('Lập trình viên Java Backend', 'PostgreSQL'),
    ('Lập trình viên Java Backend', 'REST API'),
    ('Lập trình viên Java Backend', 'Git'),
    ('Lập trình viên Frontend React', 'React'),
    ('Lập trình viên Frontend React', 'Lập trình TypeScript'),
    ('Lập trình viên Frontend React', 'HTML/CSS'),
    ('Lập trình viên Frontend React', 'Git'),
    ('Chuyên viên phân tích dữ liệu', 'SQL'),
    ('Chuyên viên phân tích dữ liệu', 'Lập trình Python'),
    ('Chuyên viên phân tích dữ liệu', 'Phân tích dữ liệu'),
    ('Chuyên viên phân tích dữ liệu', 'Tư duy phản biện'),
    ('Kế toán tổng hợp', 'Quản lý thời gian'),
    ('Kế toán tổng hợp', 'Giải quyết vấn đề'),
    ('Chuyên viên Marketing Digital', 'Giao tiếp'),
    ('Chuyên viên Marketing Digital', 'Phân tích dữ liệu'),
    ('Chuyên viên Marketing Digital', 'Làm việc nhóm'),
    ('Nhân viên chăm sóc khách hàng', 'Giao tiếp'),
    ('Nhân viên chăm sóc khách hàng', 'Giải quyết vấn đề')
) AS v(jd_title, skill_name)
JOIN job_description j ON j.jd_title = v.jd_title
JOIN skill s ON s.skill_name = v.skill_name;

-- 4. CAMPAIGN_JOB_DESCRIPTION
INSERT INTO campaign_job_description (jd_id, cp_id)
SELECT j.jd_id, c.cp_id
FROM (VALUES
    ('Lập trình viên Java Backend', 'ITviec'),
    ('Lập trình viên Java Backend', 'LinkedIn'),
    ('Lập trình viên Java Backend', 'Website công ty'),
    ('Lập trình viên Frontend React', 'ITviec'),
    ('Lập trình viên Frontend React', 'Facebook'),
    ('Chuyên viên phân tích dữ liệu', 'TopCV'),
    ('Chuyên viên phân tích dữ liệu', 'LinkedIn'),
    ('Kế toán tổng hợp', 'VietnamWorks'),
    ('Kế toán tổng hợp', 'TopCV'),
    ('Chuyên viên Marketing Digital', 'Facebook'),
    ('Chuyên viên Marketing Digital', 'Google Ads'),
    ('Chuyên viên Marketing Digital', 'Ngày hội việc làm')
) AS v(jd_title, cp_source)
JOIN job_description j ON j.jd_title = v.jd_title
JOIN campaign c ON c.cp_source = v.cp_source;

-- 5. CANDIDATE
INSERT INTO candidate (cand_exp_year, cand_major, cand_cv_path, acc_id, dt_id) VALUES
    (3, 'Công nghệ thông tin', '/uploads/cv/nguyen-van-an.pdf', (SELECT acc_id FROM account WHERE acc_email = 'an.nguyen@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (2, 'Công nghệ thông tin', '/uploads/cv/tran-thi-bich.pdf', (SELECT acc_id FROM account WHERE acc_email = 'bich.tran@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (4, 'Khoa học dữ liệu', '/uploads/cv/le-hoang-nam.pdf', (SELECT acc_id FROM account WHERE acc_email = 'nam.le@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Thạc sĩ')),
    (5, 'Kế toán', '/uploads/cv/pham-thi-cuc.pdf', (SELECT acc_id FROM account WHERE acc_email = 'cuc.pham@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (1, 'Công nghệ thông tin', '/uploads/cv/do-minh-khoi.pdf', (SELECT acc_id FROM account WHERE acc_email = 'khoi.do@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (3, 'Marketing', '/uploads/cv/vu-thanh-tung.pdf', (SELECT acc_id FROM account WHERE acc_email = 'tung.vu@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (1, 'Quản trị kinh doanh', '/uploads/cv/bui-ngoc-anh.pdf', (SELECT acc_id FROM account WHERE acc_email = 'anh.bui@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Cao đẳng')),
    (5, 'Công nghệ thông tin', '/uploads/cv/dang-quang-huy.pdf', (SELECT acc_id FROM account WHERE acc_email = 'huy.dang@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (2, 'Khoa học dữ liệu', '/uploads/cv/ngo-thi-lan-anh.pdf', (SELECT acc_id FROM account WHERE acc_email = 'lananh.ngo@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học')),
    (2, 'Kế toán', '/uploads/cv/phan-van-long.pdf', (SELECT acc_id FROM account WHERE acc_email = 'long.phan@gmail.com'), (SELECT dt_id FROM degree_type WHERE dt_name = 'Đại học'));

-- 6. SKILL_CANDIDATE
INSERT INTO skill_candidate (cand_id, skill_id)
SELECT c.cand_id, s.skill_id
FROM (VALUES
    ('an.nguyen@gmail.com', 'Lập trình Java'),
    ('an.nguyen@gmail.com', 'Spring Boot'),
    ('an.nguyen@gmail.com', 'PostgreSQL'),
    ('an.nguyen@gmail.com', 'REST API'),
    ('an.nguyen@gmail.com', 'Git'),
    ('bich.tran@gmail.com', 'React'),
    ('bich.tran@gmail.com', 'Lập trình TypeScript'),
    ('bich.tran@gmail.com', 'HTML/CSS'),
    ('nam.le@gmail.com', 'SQL'),
    ('nam.le@gmail.com', 'Lập trình Python'),
    ('nam.le@gmail.com', 'Phân tích dữ liệu'),
    ('nam.le@gmail.com', 'Tư duy phản biện'),
    ('cuc.pham@gmail.com', 'Quản lý thời gian'),
    ('cuc.pham@gmail.com', 'Giải quyết vấn đề'),
    ('khoi.do@gmail.com', 'Lập trình Java'),
    ('khoi.do@gmail.com', 'MySQL'),
    ('khoi.do@gmail.com', 'Git'),
    ('tung.vu@gmail.com', 'Giao tiếp'),
    ('tung.vu@gmail.com', 'Phân tích dữ liệu'),
    ('tung.vu@gmail.com', 'Làm việc nhóm'),
    ('anh.bui@gmail.com', 'Giao tiếp'),
    ('anh.bui@gmail.com', 'Làm việc nhóm'),
    ('huy.dang@gmail.com', 'Lập trình Java'),
    ('huy.dang@gmail.com', 'Spring Boot'),
    ('huy.dang@gmail.com', 'React'),
    ('huy.dang@gmail.com', 'Docker'),
    ('huy.dang@gmail.com', 'Git'),
    ('lananh.ngo@gmail.com', 'SQL'),
    ('lananh.ngo@gmail.com', 'Lập trình Python'),
    ('lananh.ngo@gmail.com', 'Phân tích dữ liệu'),
    ('long.phan@gmail.com', 'Quản lý thời gian'),
    ('long.phan@gmail.com', 'Làm việc nhóm')
) AS v(acc_email, skill_name)
JOIN account a ON a.acc_email = v.acc_email
JOIN candidate c ON c.acc_id = a.acc_id
JOIN skill s ON s.skill_name = v.skill_name;

-- 7. APPLICATION
-- Chuyển lương và ngày nộp từ dữ liệu candidate cũ sang từng hồ sơ.
-- app_expcted_sal giữ đúng cách viết trong schema/CDM.
INSERT INTO application (cand_id, jd_id, app_expcted_sal, app_proposal_sal, app_created_at, app_status) VALUES
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'an.nguyen@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Lập trình viên Java Backend'), 25000000, 22000000, '2026-09-20 09:15:00', 'ACCEPTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'an.nguyen@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Chuyên viên phân tích dữ liệu'), 25000000, 22000000, '2026-09-20 09:15:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'bich.tran@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Lập trình viên Frontend React'), 20000000, NULL, '2026-09-22 14:30:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'nam.le@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Chuyên viên phân tích dữ liệu'), 30000000, 28000000, '2026-09-25 10:00:00', 'ACCEPTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'cuc.pham@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Kế toán tổng hợp'), 18000000, 17000000, '2026-09-27 08:45:00', 'ACCEPTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'khoi.do@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Lập trình viên Java Backend'), 15000000, NULL, '2026-10-01 16:20:00', 'REJECTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'tung.vu@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Chuyên viên Marketing Digital'), 16000000, NULL, '2026-10-03 11:10:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'anh.bui@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Chuyên viên Marketing Digital'), 10000000, NULL, '2026-10-05 13:00:00', 'REJECTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'huy.dang@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Lập trình viên Java Backend'), 32000000, NULL, '2026-10-08 09:40:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'huy.dang@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Lập trình viên Frontend React'), 32000000, NULL, '2026-10-08 09:40:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'lananh.ngo@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Chuyên viên phân tích dữ liệu'), 20000000, NULL, '2026-10-10 15:25:00', 'SUBMITTED'),
    ((SELECT c.cand_id FROM candidate c JOIN account a ON a.acc_id = c.acc_id WHERE a.acc_email = 'long.phan@gmail.com'), (SELECT jd_id FROM job_description WHERE jd_title = 'Kế toán tổng hợp'), 14000000, NULL, '2026-10-12 10:30:00', 'SUBMITTED');

-- 8. INTERVIEW_PROCESS: lấy app_id do PostgreSQL tạo.
INSERT INTO interview_process (app_id, is_id, ip_created_at, ip_status, ip_scheduled_at, ip_feedback, acc_id, im_id)
SELECT app.app_id, s.is_id, v.created_at::timestamp, v.status,
       v.scheduled_at::timestamp, v.feedback, interviewer.acc_id, m.im_id
FROM (VALUES
    ('an.nguyen@gmail.com', 'Lập trình viên Java Backend', 'Sàng lọc hồ sơ', '2026-09-21 08:00', 'COMPLETED', '2026-09-21 09:00', 'Hồ sơ phù hợp yêu cầu.', 'quan.tran@congty.vn', 'Điện thoại'),
    ('an.nguyen@gmail.com', 'Lập trình viên Java Backend', 'Phỏng vấn nhân sự', '2026-09-22 08:00', 'COMPLETED', '2026-09-24 10:00', 'Thái độ tốt, mong muốn gắn bó lâu dài.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('an.nguyen@gmail.com', 'Lập trình viên Java Backend', 'Phỏng vấn kỹ thuật', '2026-09-25 08:00', 'COMPLETED', '2026-09-28 14:00', 'Nắm chắc Spring Boot, thiết kế API tốt.', 'duc.pham@congty.vn', 'Gọi video'),
    ('an.nguyen@gmail.com', 'Lập trình viên Java Backend', 'Đề nghị tuyển dụng', '2026-09-30 08:00', 'COMPLETED', '2026-10-02 09:00', 'Ứng viên đồng ý mức lương đề xuất.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('khoi.do@gmail.com', 'Lập trình viên Java Backend', 'Sàng lọc hồ sơ', '2026-10-02 08:00', 'COMPLETED', '2026-10-02 10:00', 'Đạt yêu cầu tối thiểu.', 'quan.tran@congty.vn', 'Điện thoại'),
    ('khoi.do@gmail.com', 'Lập trình viên Java Backend', 'Phỏng vấn nhân sự', '2026-10-03 08:00', 'COMPLETED', '2026-10-05 15:00', 'Giao tiếp ổn.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('khoi.do@gmail.com', 'Lập trình viên Java Backend', 'Phỏng vấn kỹ thuật', '2026-10-06 08:00', 'REJECTED', '2026-10-08 14:00', 'Chưa nắm vững OOP và SQL, chưa đáp ứng yêu cầu.', 'duc.pham@congty.vn', 'Gọi video'),
    ('huy.dang@gmail.com', 'Lập trình viên Java Backend', 'Sàng lọc hồ sơ', '2026-10-09 08:00', 'COMPLETED', '2026-10-09 09:30', 'Kinh nghiệm tốt, ưu tiên phỏng vấn.', 'quan.tran@congty.vn', 'Điện thoại'),
    ('huy.dang@gmail.com', 'Lập trình viên Java Backend', 'Phỏng vấn nhân sự', '2026-10-10 08:00', 'SCHEDULED', '2026-11-05 10:00', NULL, 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('bich.tran@gmail.com', 'Lập trình viên Frontend React', 'Sàng lọc hồ sơ', '2026-09-23 08:00', 'COMPLETED', '2026-09-23 10:00', 'Portfolio ấn tượng.', 'quan.tran@congty.vn', 'Điện thoại'),
    ('bich.tran@gmail.com', 'Lập trình viên Frontend React', 'Phỏng vấn nhân sự', '2026-09-24 08:00', 'SCHEDULED', '2026-11-06 14:00', NULL, 'lan.nguyen@congty.vn', 'Gọi video'),
    ('nam.le@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Sàng lọc hồ sơ', '2026-09-26 08:00', 'COMPLETED', '2026-09-26 09:00', 'Hồ sơ rất phù hợp.', 'ha.le@congty.vn', 'Điện thoại'),
    ('nam.le@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Phỏng vấn nhân sự', '2026-09-27 08:00', 'COMPLETED', '2026-09-29 10:00', 'Phong cách làm việc phù hợp văn hoá công ty.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('nam.le@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Phỏng vấn kỹ thuật', '2026-09-30 08:00', 'COMPLETED', '2026-10-02 14:00', 'Xử lý bài test SQL và Python xuất sắc.', 'duc.pham@congty.vn', 'Gọi video'),
    ('nam.le@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Đề nghị tuyển dụng', '2026-10-03 08:00', 'COMPLETED', '2026-10-05 09:00', 'Hai bên đã thống nhất lương và ngày nhận việc.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('lananh.ngo@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Sàng lọc hồ sơ', '2026-10-11 08:00', 'COMPLETED', '2026-10-11 10:00', 'Có chứng chỉ phù hợp.', 'ha.le@congty.vn', 'Điện thoại'),
    ('lananh.ngo@gmail.com', 'Chuyên viên phân tích dữ liệu', 'Phỏng vấn nhân sự', '2026-10-12 08:00', 'UNSCHEDULED', NULL, NULL, 'lan.nguyen@congty.vn', NULL),
    ('cuc.pham@gmail.com', 'Kế toán tổng hợp', 'Sàng lọc hồ sơ', '2026-09-28 08:00', 'COMPLETED', '2026-09-28 09:00', 'Kinh nghiệm phù hợp vị trí.', 'ha.le@congty.vn', 'Điện thoại'),
    ('cuc.pham@gmail.com', 'Kế toán tổng hợp', 'Phỏng vấn nhân sự', '2026-09-29 08:00', 'COMPLETED', '2026-10-01 10:00', 'Chuyên nghiệp, cẩn thận.', 'lan.nguyen@congty.vn', 'Trực tiếp'),
    ('cuc.pham@gmail.com', 'Kế toán tổng hợp', 'Đề nghị tuyển dụng', '2026-10-02 08:00', 'COMPLETED', '2026-10-04 09:00', 'Ứng viên chấp nhận đề nghị.', 'mai.hoang@congty.vn', 'Trực tiếp'),
    ('tung.vu@gmail.com', 'Chuyên viên Marketing Digital', 'Sàng lọc hồ sơ', '2026-10-04 08:00', 'COMPLETED', '2026-10-04 10:00', 'Kinh nghiệm chạy quảng cáo tốt.', 'ha.le@congty.vn', 'Điện thoại'),
    ('tung.vu@gmail.com', 'Chuyên viên Marketing Digital', 'Phỏng vấn nhân sự', '2026-10-05 08:00', 'SCHEDULED', '2026-11-07 09:00', NULL, 'bao.vu@congty.vn', 'Trực tiếp'),
    ('anh.bui@gmail.com', 'Chuyên viên Marketing Digital', 'Sàng lọc hồ sơ', '2026-10-06 08:00', 'REJECTED', '2026-10-06 10:00', 'Chưa đủ kinh nghiệm về digital marketing.', 'ha.le@congty.vn', 'Điện thoại')
) AS v(candidate_email, jd_title, stage, created_at, status, scheduled_at, feedback, interviewer_email, method)
JOIN account a ON a.acc_email = v.candidate_email
JOIN candidate c ON c.acc_id = a.acc_id
JOIN job_description j ON j.jd_title = v.jd_title
JOIN application app ON app.cand_id = c.cand_id AND app.jd_id = j.jd_id
JOIN interview_stage s ON s.is_name = v.stage
JOIN account interviewer ON interviewer.acc_email = v.interviewer_email
LEFT JOIN interview_method m ON m.im_name = v.method;

-- Dừng và rollback nếu danh mục thiếu/trùng làm sai số lượng khi JOIN.
DO $seed_check$
DECLARE
    seeded_candidates UUID[];
    seeded_jobs UUID[];
BEGIN
    SELECT array_agg(c.cand_id) INTO seeded_candidates
    FROM candidate c JOIN account a ON a.acc_id = c.acc_id
    WHERE a.acc_email IN ('an.nguyen@gmail.com', 'bich.tran@gmail.com', 'nam.le@gmail.com', 'cuc.pham@gmail.com', 'khoi.do@gmail.com', 'tung.vu@gmail.com', 'anh.bui@gmail.com', 'huy.dang@gmail.com', 'lananh.ngo@gmail.com', 'long.phan@gmail.com');
    SELECT array_agg(jd_id) INTO seeded_jobs FROM job_description
    WHERE jd_title IN ('Lập trình viên Java Backend', 'Lập trình viên Frontend React', 'Chuyên viên phân tích dữ liệu', 'Kế toán tổng hợp', 'Chuyên viên Marketing Digital', 'Nhân viên chăm sóc khách hàng');
    IF (SELECT count(*) FROM account WHERE acc_email IN ('lan.nguyen@congty.vn', 'quan.tran@congty.vn', 'ha.le@congty.vn', 'duc.pham@congty.vn', 'mai.hoang@congty.vn', 'bao.vu@congty.vn', 'an.nguyen@gmail.com', 'bich.tran@gmail.com', 'nam.le@gmail.com', 'cuc.pham@gmail.com', 'khoi.do@gmail.com', 'tung.vu@gmail.com', 'anh.bui@gmail.com', 'huy.dang@gmail.com', 'lananh.ngo@gmail.com', 'long.phan@gmail.com')) <> 16
       OR cardinality(seeded_candidates) IS DISTINCT FROM 10
       OR cardinality(seeded_jobs) IS DISTINCT FROM 6
       OR (SELECT count(*) FROM skill_job_description WHERE jd_id = ANY(seeded_jobs)) <> 20
       OR (SELECT count(*) FROM campaign_job_description WHERE jd_id = ANY(seeded_jobs)) <> 12
       OR (SELECT count(*) FROM skill_candidate WHERE cand_id = ANY(seeded_candidates)) <> 32
       OR (SELECT count(*) FROM application WHERE cand_id = ANY(seeded_candidates)) <> 12
       OR (SELECT count(*) FROM interview_process ip JOIN application app ON app.app_id = ip.app_id
           WHERE app.cand_id = ANY(seeded_candidates)) <> 23
    THEN
        RAISE EXCEPTION 'Số lượng dữ liệu mẫu không đúng. Kiểm tra danh mục thiếu/trùng; lần nạp bị rollback.';
    END IF;
END;
$seed_check$;

COMMIT;

-- Số dòng mong đợi: role 4, account 16, job 6, candidate 10, application 12, interview 23.
SELECT 'role' AS bang, COUNT(*) AS so_dong FROM role
UNION ALL SELECT 'account', COUNT(*) FROM account
UNION ALL SELECT 'job_description', COUNT(*) FROM job_description
UNION ALL SELECT 'candidate', COUNT(*) FROM candidate
UNION ALL SELECT 'application', COUNT(*) FROM application
UNION ALL SELECT 'interview_process', COUNT(*) FROM interview_process;
