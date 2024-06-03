'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import ProductsGrid from '@/app/components/product/ProductsGrid'
import Container from '@/app/components/ui/Container'
import { useFavoritesStore } from '@/store/favoritesStore'
import { SafeUser } from '@/types'
import Link from 'next/link'
import { FC, useEffect } from 'react'
import { MdArrowBack } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

interface FavoritesClientProps {
	user: SafeUser | null
}

const FavoritesClient: FC<FavoritesClientProps> = ({ user }) => {
	const { favorites, isLoading, getFavorites, clearFavorites } =
		useFavoritesStore()

	useEffect(() => {
		getFavorites()
	}, [getFavorites])

	if (isLoading && (!favorites || favorites.length === 0)) {
		return <Skeleton count={5} height={15} />
	}

	if (!isLoading && favorites.length === 0) {
		return (
			<div className="flex flex-col items-center">
				<div className="text-2xl">Избранных товаров нет</div>
				<div>
					<Link
						href={'/'}
						className="text-slate-500 flex items-center gap-1 mt-2"
					>
						<MdArrowBack />
						<span>Вернуться на главную</span>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Избранное" />
				</div>
				<div className="mb-5">
					{favorites.length > 0 && (
						<ProductsGrid
							products={favorites.map(f => f.product)}
							type="default"
							user={user}
						/>
					)}
				</div>
				<Button
					label="Очистить список избраннх"
					outline
					onClick={clearFavorites}
					maxWidth={300}
				/>
			</Container>
		</div>
	)
}

export default FavoritesClient
