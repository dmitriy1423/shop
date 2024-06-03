import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import prisma from '@/libs/prisma'

export async function getSession() {
	return await getServerSession(authOptions)
}

export async function getCurrentUser() {
	try {
		const session = await getSession()

		if (!session?.user?.email) {
			return null
		}

		const currentUser = await prisma.user.findUnique({
			where: {
				email: session.user.email
			},
			include: {
				cart: {
					include: {
						product: true
					}
				},
				favorites: {
					include: {
						product: true
					}
				},
				orders: {
					include: {
						items: {
							include: {
								product: true
							}
						},
						user: true
					}
				},
				reviews: {
					include: {
						user: true,
						product: true
					}
				}
			}
		})

		if (!currentUser) {
			return null
		}

		return {
			...currentUser,
			createdAt: currentUser.createdAt.toISOString(),
			updatedAt: currentUser.updatedAt.toISOString(),
			emailVerified: currentUser.emailVerified?.toString() || null
		}
	} catch (error) {
		return null
	}
}
