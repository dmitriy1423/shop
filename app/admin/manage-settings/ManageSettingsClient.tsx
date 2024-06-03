'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import { Product } from '@prisma/client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
	Controller,
	FieldValues,
	SubmitHandler,
	useForm
} from 'react-hook-form'
import toast from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import Select from 'react-select'

const ManageSettingsClient = () => {
	const [products, setProducts] = useState<Product[]>([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [isLoadingSettings, setIsLoadingSettings] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => setIsMounted(true), [])

	const { setValue, control, handleSubmit } = useForm<FieldValues>({
		defaultValues: {
			featuredProducts: []
		}
	})

	useEffect(() => {
		setIsLoadingProducts(true)
		axios
			.get('/api/products')
			.then(response => {
				setProducts(response.data)
			})
			.finally(() => setIsLoadingProducts(false))

		setIsLoadingSettings(true)

		Promise.all([axios.get('/api/settings?name=featuredProducts')])
			.then(async ([featuredProductsResponse]) => {
				const productIds = featuredProductsResponse.data?.values || []
				const productPromises = productIds.map((productId: string) =>
					axios
						.get(`/api/products/${productId}`)
						.then(response => response.data)
				)

				const fetchedProducts = await Promise.all(productPromises)

				setValue(
					'featuredProducts',
					fetchedProducts.map(p => ({ value: p.id, label: p.name }))
				)
			})
			.finally(() => setIsLoadingSettings(false))
	}, [setValue])

	const saveFeaturedProduct: SubmitHandler<FieldValues> = async data => {
		const featuredProductIds = data.featuredProducts.map(
			(product: { value: string }) => product.value
		)

		Promise.all([
			axios.put('/api/settings', {
				name: 'featuredProducts',
				values: featuredProductIds
			})
		]).then(() => toast.success('Настройки сохранены'))
	}

	return (
		<>
			<div className="mb-4 mt-8">
				<Heading title="Настройки" center />
			</div>
			{isLoadingProducts || isLoadingSettings ? (
				<Skeleton count={1} height={90} />
			) : (
				<form
					onSubmit={handleSubmit(saveFeaturedProduct)}
					className="flex flex-col"
				>
					<span>Задать рекомендуемые товары</span>
					{isMounted && (
						<Controller
							control={control}
							name="featuredProducts"
							render={({ field }) => (
								<Select
									{...field}
									inputId="featured-products-select"
									isMulti
									options={products.map(product => ({
										value: product.id,
										label: product.name
									}))}
									classNamePrefix="select"
									placeholder="Выберите товары"
								/>
							)}
						/>
					)}
					<div className="mt-5">
						<Button type="submit" label="Сохранить настройки" maxWidth={250} />
					</div>
				</form>
			)}
		</>
	)
}

export default ManageSettingsClient
