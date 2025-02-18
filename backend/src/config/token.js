import jwt from "jsonwebtoken";

export const createAccessToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("jwt", token, {  // lưu token vào cookie có tên là jwt, giá trị của token là jwt vừa tạo
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Cookie chỉ có thể được gửi qua HTTP, không thể truy cập từ JavaScript trên trình duyệt (giúp bảo mật)
        sameSite: "strict", // Chặn cookie nếu request được gửi từ trang web khác (giúp tránh tấn công CSRF).
        secure: process.env.NODE_ENV !== "development", // Nếu chạy ở chế độ production, cookie chỉ được gửi qua HTTPS, Nếu chạy ở development, cookie có thể gửi qua HTTP
    });
    return token;
}