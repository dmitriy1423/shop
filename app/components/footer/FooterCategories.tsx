import { ExtendedCategory } from '@/types'
import Link from 'next/link'
import { FC } from 'react'

interface FooterCategoriesProps {
	categories: ExtendedCategory[]
}

const FooterCategories: FC<FooterCategoriesProps> = ({ categories }) => {
	return (
		<div className="flex flex-col items-start gap-2">
			{categories.length > 0 &&
				categories.map(category => (
					<Link key={category.id} href={`/category/${category.id}`}>
						{category.name}
					</Link>
				))}
		</div>
	)
}

export default FooterCategories
