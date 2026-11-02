# RecruitHR — bản thiết kế giao diện

Chạy giao diện:

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Các màn hình

- `/`: tổng quan số liệu, lịch hẹn sắp tới và phân bố hồ sơ theo giai đoạn.
- `/interviews`: Kanban 5 giai đoạn, tìm kiếm, lọc vị trí, kéo thả hoặc chọn giai đoạn bằng dropdown.
- `/interviews/schedule`: lịch phỏng vấn dạng danh sách, lọc ngày, tìm kiếm, nhóm sắp tới/hôm nay/hoàn tất.
- `/interviews/PV-001`: ví dụ chi tiết, thông tin ứng viên, lịch hẹn, nhận xét, kết quả và lịch sử hoạt động.

Có thể lên lịch hoặc chỉnh lịch từ các màn hình. Form kiểm tra giờ kết thúc và trùng lịch người phỏng vấn.

## Phạm vi bản xem trước

Giao diện tiếng Việt, tông kem–xanh theo ảnh tham khảo. Dữ liệu minh họa nằm trong `lib/recruitment-data.ts`; ngày tham chiếu cố định là 02/11/2026. Số liệu dashboard tính từ dữ liệu mẫu. Email dùng miền example.com dành cho ví dụ.

State dùng React Context trong `components/recruitment/provider.tsx`: điều hướng bằng liên kết nội bộ giữ thay đổi; tải lại trang đặt lại dữ liệu. Chưa kết nối backend, chưa xác thực, chưa gửi email hoặc tạo cuộc họp trực tuyến. Các mục chưa thiết kế được đánh dấu “Sau”.

Các kiểu TypeScript trong `types/recruitment.ts` là view model giao diện, không thay đổi CDM đã chốt. Backend và database chưa được sửa.

## Kiểm tra

```bash
npm run lint
npx tsc --noEmit
npm run build
```
