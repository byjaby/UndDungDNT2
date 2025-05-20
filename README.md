Có 3 loại người dùng để đăng nhập:
1.Admin: Quản trị hệ thống
2.Khách thuê trọ
3.Chủ trọ
Tài khoản đăng nhập Admin: quocthaiv4@gmail.com
Mật khẩu: 123456
Có thể tạo thêm trong file MoApp.js:
const adminData = {
            hoTen: 'Võ Quốc Thái',
            email: adminEmail,
            sDT: '0375030925',
            diaChi: 'Bình Dương',
            id_loaiNguoiDung: idLoaiAdmin,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };
Đổi thành dữ liệu khác ở đoạn này