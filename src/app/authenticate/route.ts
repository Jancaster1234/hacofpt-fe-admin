// src/app/authenticate/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/sign-in?error=google_auth_failed', request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/sign-in?error=no_code', request.url));
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error('Failed to authenticate with Google');
        }

        const data = await response.json();

        // Set the token in cookies
        const responseWithCookie = NextResponse.redirect(new URL('/', request.url));
        responseWithCookie.cookies.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return responseWithCookie;
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.redirect(new URL('/sign-in?error=auth_failed', request.url));
    }
} 