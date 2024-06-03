'use client'

import CategoryProducts from '@/app/components/category/CategoryProducts'
import Heading from '@/app/components/heading/Heading'
import Container from '@/app/components/ui/Container'
import { ExtendedCategory, SafeUser } from '@/types'
import { FC } from 'react'

interface CategoriesClientProps {
	categories: ExtendedCategory[]
	user: SafeUser | null
}

const CategoriesClient: FC<CategoriesClientProps> = ({ categories, user }) => {
	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Категории" />
				</div>
				{categories.length > 0 &&
					categories.map(category => (
						<CategoryProducts
							category={category}
							key={category.id}
							user={user}
						/>
					))}
			</Container>
		</div>
	)
}

export default CategoriesClient
