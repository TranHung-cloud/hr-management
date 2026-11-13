import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Xóa toàn bộ cookie liên quan đến phiên đăng nhập
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    cookieStore.set(cookie.name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  // Đảm bảo xóa đích danh các cookie phổ biến nếu dùng tên cố định
  cookieStore.delete("session");
  cookieStore.delete("auth_token");
  cookieStore.delete("access_token");

  return NextResponse.json({ message: "Đăng xuất thành công" }, { status: 200 });
}