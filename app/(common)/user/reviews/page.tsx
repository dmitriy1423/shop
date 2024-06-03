import { getCurrentUser } from '@/actions/getCurrentUser'
import ReviewsClient from './ReviewsClient'
import { getFilteredReviewsByUser } from '@/actions/getFilteredReviewsByUser'
import { Metadata } from 'next'

export async function generateMetadata(
	{ params, searchParams }: any,
	parent: any
): Promise<Metadata> {
	const user = await getCurrentUser()

	return {
		title: `ElectroShop | Отзывы пользователя ${user?.name}`,
		description: 'Магазин товаров цифровой техники'
	}
}

const ReviewsPage = async ({ searchParams }: any) => {
	const user = await getCurrentUser()
	if (!user) return null

	const currentPage = Number(searchParams?.page) || 1
	const { reviews, totalPages } = await getFilteredReviewsByUser(
		currentPage,
		user.id,
		searchParams
	)

	return (
		<>
			<ReviewsClient reviews={reviews} totalPages={totalPages} />
		</>
	)
}

export default ReviewsPage
