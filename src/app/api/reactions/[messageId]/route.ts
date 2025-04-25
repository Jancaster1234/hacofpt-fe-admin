import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { messageId: string } }
) {
    try {

        const { messageId } = params;

        // 1. Lấy token từ header
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Proxy request đến backend thực
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/reactions/${messageId}`, // 👈 Endpoint backend
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader, // Giữ nguyên token
                },
                body: JSON.stringify(await req.json()), // Forward body
            }
        );

        // 3. Trả về kết quả từ backend
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error: " + error },
            { status: 500 }
        );
    }
}
