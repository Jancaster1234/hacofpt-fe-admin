import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { conversationId: string } }
) {
    try {
        // 1. Lấy conversationId từ URL params
        const { conversationId } = params;
        console.log(`Sending message to conversation: ${conversationId}`);

        // 2. Lấy token từ header
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        }

        // 3. Parse request body
        const { content, fileUrls } = await request.json();

        // 4. Gửi request đến backend API
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/messages/${conversationId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authHeader,
                },
                body: JSON.stringify({
                    data: {
                        content: content, // Gửi content gốc, không encode
                        fileUrls: fileUrls || [],
                    }
                }),
            }
        );

        // 5. Xử lý response từ backend
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                {
                    error: errorData.message || "Failed to send message",
                    details: errorData,
                },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[SEND_MESSAGE_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}