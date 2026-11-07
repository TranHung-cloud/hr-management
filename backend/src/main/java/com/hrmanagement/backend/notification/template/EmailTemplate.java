package com.hrmanagement.backend.notification.template;

import org.springframework.stereotype.Component;

@Component
public class EmailTemplate {

    public String buildAdminAccountCreatedEmail(String email, String rawPassword, String roleName) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                        .header { background: #1e40af; color: #ffffff; padding: 24px; text-align: center; }
                        .header h2 { margin: 0; font-size: 22px; font-weight: 600; }
                        .content { padding: 30px; line-height: 1.6; }
                        .welcome { font-size: 16px; margin-bottom: 20px; }
                        .account-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 20px 0; }
                        .info-row { display: flex; margin-bottom: 10px; font-size: 15px; }
                        .info-row:last-child { margin-bottom: 0; }
                        .label { font-weight: 600; width: 140px; color: #475569; }
                        .value { color: #0f172a; word-break: break-all; }
                        .password-highlight { font-family: monospace; background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 15px; }
                        .notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; font-size: 14px; color: #92400e; margin-top: 20px; border-radius: 0 4px 4px 0; }
                        .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 13px; color: #64748b; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Hệ Thống Quản Trị Nhân Sự (HR Management)</h2>
                        </div>
                        <div class="content">
                            <p class="welcome">Xin chào,</p>
                            <p>Tài khoản quản trị của bạn trên hệ thống HR Management đã được khởi tạo thành công bởi Trưởng phòng nhân sự. Dưới đây là thông tin đăng nhập của bạn:</p>

                            <div class="account-box">
                                <div class="info-row">
                                    <span class="label">Tài khoản (Email):</span>
                                    <span class="value"><strong>%s</strong></span>
                                </div>
                                <div class="info-row" style="margin-top: 8px;">
                                    <span class="label">Mật khẩu tạm thời:</span>
                                    <span class="value"><span class="password-highlight">%s</span></span>
                                </div>
                                <div class="info-row" style="margin-top: 8px;">
                                    <span class="label">Vai trò (Role):</span>
                                    <span class="value"><strong>%s</strong></span>
                                </div>
                            </div>

                            <div class="notice">
                                <strong>Lưu ý bảo mật:</strong> Đây là mật khẩu tự động được hệ thống cấp. Để bảo đảm an toàn, vui lòng đăng nhập và đổi mật khẩu mới ngay trong lần truy cập đầu tiên.
                            </div>
                        </div>
                        <div class="footer">
                            <p>Email này được gửi tự động từ hệ thống HR Management. Vui lòng không phản hồi lại email này.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(email, rawPassword, roleName != null ? roleName : "Admin");
    }

    public String buildAdminPasswordResetEmail(String email, String rawPassword) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f6f9;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                        }
                        .header {
                            background: #b45309;
                            color: #ffffff;
                            padding: 24px;
                            text-align: center;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 30px;
                            line-height: 1.6;
                        }
                        .account-box {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 20px;
                            margin: 20px 0;
                        }
                        .info-row {
                            display: flex;
                            margin-bottom: 12px;
                            font-size: 15px;
                        }
                        .info-row:last-child {
                            margin-bottom: 0;
                        }
                        .label {
                            font-weight: 600;
                            width: 140px;
                            color: #475569;
                        }
                        .value {
                            color: #0f172a;
                            word-break: break-all;
                        }
                        .password-highlight {
                            font-family: monospace;
                            background: #fef3c7;
                            color: #92400e;
                            padding: 3px 8px;
                            border-radius: 4px;
                            font-weight: bold;
                            font-size: 15px;
                        }
                        .notice {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 12px 16px;
                            font-size: 14px;
                            color: #92400e;
                            margin-top: 20px;
                            border-radius: 0 4px 4px 0;
                        }
                        .footer {
                            background: #f1f5f9;
                            padding: 16px;
                            text-align: center;
                            font-size: 13px;
                            color: #64748b;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Thông Báo Cấp Lại Mật Khẩu</h2>
                        </div>
                        <div class="content">
                            <p>Xin chào,</p>

                            <p>
                                Mật khẩu tài khoản quản trị của bạn trên hệ thống
                                HR Management đã được Trưởng phòng nhân sự cấp lại.
                                Dưới đây là thông tin đăng nhập mới:
                            </p>

                            <div class="account-box">
                                <div class="info-row">
                                    <span class="label">Tài khoản (Email):</span>
                                    <span class="value"><strong>%s</strong></span>
                                </div>
                                <div class="info-row">
                                    <span class="label">Mật khẩu mới:</span>
                                    <span class="value">
                                        <span class="password-highlight">%s</span>
                                    </span>
                                </div>
                            </div>

                            <div class="notice">
                                <strong>Lưu ý bảo mật:</strong>
                                Mật khẩu cũ của bạn đã không còn hiệu lực.
                                Vui lòng sử dụng mật khẩu mới để đăng nhập và
                                thay đổi mật khẩu ngay sau khi đăng nhập thành công.
                                Nếu bạn không yêu cầu cấp lại mật khẩu, vui lòng
                                liên hệ ngay với bộ phận nhân sự.
                            </div>
                        </div>
                        <div class="footer">
                            <p>
                                Email này được gửi tự động từ hệ thống HR Management.
                                Vui lòng không phản hồi lại email này.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(email, rawPassword);
    }

    public String buildAcceptedApplicationEmail(String candidateName, String jobTitle) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f6f9;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                        }
                        .header {
                            background: #15803d;
                            color: #ffffff;
                            padding: 24px;
                            text-align: center;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 30px;
                            line-height: 1.6;
                        }
                        .highlight-box {
                            background: #f0fdf4;
                            border: 1px solid #bbf7d0;
                            border-radius: 6px;
                            padding: 20px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .job-title {
                            color: #15803d;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .notice {
                            background: #dcfce7;
                            border-left: 4px solid #16a34a;
                            padding: 12px 16px;
                            font-size: 14px;
                            color: #166534;
                            margin-top: 20px;
                            border-radius: 0 4px 4px 0;
                        }
                        .footer {
                            background: #f1f5f9;
                            padding: 16px;
                            text-align: center;
                            font-size: 13px;
                            color: #64748b;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Chúc Mừng! Hồ Sơ Ứng Tuyển Được Chấp Nhận</h2>
                        </div>
                        <div class="content">
                            <p>Xin chào <strong>%s</strong>,</p>

                            <p>
                                Chúng tôi vui mừng thông báo rằng hồ sơ ứng tuyển của bạn
                                đã được xem xét và <strong>chấp nhận</strong>.
                            </p>

                            <div class="highlight-box">
                                <p>Vị trí ứng tuyển của bạn:</p>
                                <div class="job-title">%s</div>
                            </div>

                            <div class="notice">
                                <strong>Thông báo:</strong>
                                Bộ phận nhân sự sẽ liên hệ với bạn trong thời gian tới
                                để trao đổi về các bước tiếp theo trong quy trình tuyển dụng.
                                Vui lòng chú ý email và điện thoại của bạn.
                            </div>

                            <p>
                                Cảm ơn bạn đã quan tâm và lựa chọn ứng tuyển tại công ty chúng tôi.
                                Chúng tôi rất mong được đồng hành cùng bạn!
                            </p>
                        </div>
                        <div class="footer">
                            <p>Email này được gửi tự động từ hệ thống HR Management.
                            Vui lòng không phản hồi lại email này.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(candidateName, jobTitle);
    }

    public String buildRejectedApplicationEmail(String candidateName, String jobTitle) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f6f9;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                        }
                        .header {
                            background: #475569;
                            color: #ffffff;
                            padding: 24px;
                            text-align: center;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 30px;
                            line-height: 1.6;
                        }
                        .highlight-box {
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 20px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .job-title {
                            color: #334155;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .notice {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 12px 16px;
                            font-size: 14px;
                            color: #92400e;
                            margin-top: 20px;
                            border-radius: 0 4px 4px 0;
                        }
                        .footer {
                            background: #f1f5f9;
                            padding: 16px;
                            text-align: center;
                            font-size: 13px;
                            color: #64748b;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Thông Báo Kết Quả Ứng Tuyển</h2>
                        </div>
                        <div class="content">
                            <p>Xin chào <strong>%s</strong>,</p>

                            <p>
                                Cảm ơn bạn đã dành thời gian quan tâm và gửi hồ sơ ứng tuyển
                                đến công ty chúng tôi.
                            </p>

                            <div class="highlight-box">
                                <p>Vị trí ứng tuyển:</p>
                                <div class="job-title">%s</div>
                            </div>

                            <p>
                                Sau khi xem xét và đánh giá hồ sơ, chúng tôi rất tiếc phải
                                thông báo rằng bạn chưa phù hợp với yêu cầu của vị trí
                                tuyển dụng trong đợt này.
                            </p>

                            <div class="notice">
                                <strong>Lời nhắn:</strong>
                                Quyết định này không đồng nghĩa với việc đánh giá thấp năng lực
                                của bạn. Chúng tôi hy vọng sẽ có cơ hội hợp tác với bạn
                                trong những đợt tuyển dụng tiếp theo.
                            </div>

                            <p>
                                Chúc bạn luôn thành công trên con đường sự nghiệp
                                và sớm tìm được công việc phù hợp!
                            </p>
                        </div>
                        <div class="footer">
                            <p>Email này được gửi tự động từ hệ thống HR Management.
                            Vui lòng không phản hồi lại email này.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(candidateName, jobTitle);
    }

}
