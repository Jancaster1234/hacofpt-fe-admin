// src/app/api/auth/upload-avatar/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { message: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "Only image files are allowed" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { message: "File size must be less than 5MB" },
                { status: 400 }
            );
        }

        // Create form data for external API
        const externalFormData = new FormData();
        externalFormData.append("file", file);

        // Call external API
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/upload-avatar`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: externalFormData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: error.message || "Failed to upload avatar" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Upload avatar error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
} 