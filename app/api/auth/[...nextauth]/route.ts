import bcrypt from 'bcrypt'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/libs/prisma'

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					throw new Error('Неверный email или пароль')
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email
					}
				})

				if (!user || !user?.password) {
					throw new Error('Неверный email или пароль')
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.password
				)

				if (!isCorrectPassword) {
					throw new Error('Неверный email или пароль')
				}

				return user
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string
		})
	],

	pages: {
		signIn: '/login',
		signOut: '/'
	},

	session: {
		strategy: 'jwt',
		maxAge: 86400
	},

	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async redirect({ url, baseUrl }) {
			return baseUrl
		},
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role
			}
			return token
		},
		async session({ session, token }) {
			if (token) {
				session.user.role = token.role
			}
			return session
		}
	}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
