// src/app/api/user/route.ts
import { NextResponse } from "next/server";

// Định nghĩa kiểu dữ liệu cho user
interface Response {
  code: number;
  message: string;
  data: User[];
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  username: string;
}

export async function GET(req: Request) {
  try {
    // Kiểm tra token từ header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Lấy token từ header
    const token = authHeader.split(" ")[1];

    // Gọi API backend thực
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Kiểm tra response từ backend
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        {
          error: errorData,
        },
        { status: backendResponse.status }
      );
    }
    console.log(backendResponse);

    // Parse dữ liệu từ backend
    const backendUsers: Response = await backendResponse.json();
    // Format dữ liệu để trả về client (loại bỏ thông tin nhạy cảm)
    const users = backendUsers?.data.map((user: User) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      image:
        user.avatarUrl ||
        "https://greenscapehub-media.s3.ap-southeast-1.amazonaws.com/hacofpt/504c1e5a-bc1f-4fe7-8905-d3bbbb12cabd_smiling-young-man-illustration_1308-174669.avif",
      username: user.username,
    }));

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error fetching users: " + error,
        errorCode: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
