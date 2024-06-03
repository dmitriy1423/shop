import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret })
	const { pathname } = req.nextUrl

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	if (pathname.startsWith('/admin')) {
		if (token.role !== 'ADMIN') {
			return NextResponse.redirect(new URL('/login', req.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/admin/:path*',
		'/cart',
		'/favorites',
		'/create-order',
		'/user/:path*'
	]
}
