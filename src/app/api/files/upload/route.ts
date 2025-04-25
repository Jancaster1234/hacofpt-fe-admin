import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

        // Lấy form data từ request
        const formData = await req.formData();

        // Gọi API backend thực
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/files/upload`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
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

        // Parse dữ liệu từ backend
        const data = await backendResponse.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error uploading file: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
} 