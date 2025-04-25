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
            image: user.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg",
            username: user.username
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
