import { ExtendedCategory } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { MdIcecream } from 'react-icons/md'

interface CategoryProps {
	category: ExtendedCategory
}

const Category: FC<CategoryProps> = ({ category }) => {
	return (
		<Link
			href={`/category/${category.id}`}
			className={`flex flex-col items-center p-4 bg-white shadow-lg rounded-lg`}
		>
			{category?.products && category?.products[0]?.images.length > 0 ? (
				<div className="relative w-full h-48 mb-4 aspect-square">
					<Image
						fill
						src={category?.products[0]?.images[0].toString()}
						alt={category.products[0].name}
						className="object-contain rounded-md"
					/>
				</div>
			) : (
				<MdIcecream size={210} />
			)}
			<h3 className="text-lg font-bold">{category.name}</h3>
		</Link>
	)
}

export default Category
