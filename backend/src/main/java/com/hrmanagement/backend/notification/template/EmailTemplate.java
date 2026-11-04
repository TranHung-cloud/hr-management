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
}
