import { NextResponse } from "next/server";

interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
}

export async function PUT(request: Request) {

    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const updatedUser = body as UpdateUserRequest;

        // Validate phone number format if provided
        if (updatedUser.phone && !/^\d{10}$/.test(updatedUser.phone)) {
            return NextResponse.json(
                { message: 'Phone number must be exactly 10 digits' },
                { status: 400 }
            );
        }

        // Validate skills if provided
        if (updatedUser.skills && updatedUser.skills.length === 0) {
            return NextResponse.json(
                { message: 'At least one skill is required' },
                { status: 400 }
            );
        }


        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/my-info`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        phone: updatedUser.phone,
                        bio: updatedUser.bio,
                        skills: updatedUser.skills
                    }
                }),
            }
        );
        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: error.message || 'Failed to update user' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { message: 'Failed to update user' },
            { status: 500 }
        );
    }
} 