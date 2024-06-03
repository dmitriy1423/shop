'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Input from '@/app/components/inputs/Input'
import ProductsGrid from '@/app/components/product/ProductsGrid'
import Container from '@/app/components/ui/Container'

import Pagination from '@/app/components/ui/Pagination'

import { ExtendedCategory, SafeUser } from '@/types'
import { Product, Property } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import {
	FieldValue,
	FieldValues,
	SubmitHandler,
	useFieldArray,
	useForm
} from 'react-hook-form'
import { MdIcecream } from 'react-icons/md'
import Skeleton from 'react-loading-skeleton'

interface CategoryClientProps {
	category: ExtendedCategory
	products: Product[]
	totalPages: number
	user: SafeUser | null
}

const CategoryClient: FC<CategoryClientProps> = ({
	category,
	products,
	totalPages,
	user
}) => {
	const [properties, setProperties] = useState<Property[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	/* const initialValues = category.properties?.map(prop => ({
		name: prop.name,
		value: searchParams.get(prop.name) || 'all'
	})) */

	const createPageURL = (
		properties: any[],
		sort: string,
		minPrice: string,
		maxPrice: string
	) => {
		const params = new URLSearchParams(searchParams)
		properties.forEach(prop => {
			if (prop.value === 'all') {
				params.delete(prop.name)
			} else {
				params.set(prop.name, prop.value)
			}
		})
		if (sort === 'all') {
			params.delete('sort')
		} else {
			params.set('sort', sort)
		}
		if (minPrice) {
			params.set('minPrice', minPrice)
		} else {
			params.delete('minPrice')
		}
		if (maxPrice) {
			params.set('maxPrice', maxPrice)
		} else {
			params.delete('maxPrice')
		}
		return `${pathname}?${params.toString()}`
	}

	const {
		setValue,
		getValues,
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		control
	} = useForm<FieldValues>({
		defaultValues: {
			properties:
				category.properties?.map(prop => ({
					name: prop.name,
					value: searchParams.get(prop.name) || 'all'
				})) || [],
			sort: searchParams.get('sort') || 'all',
			minPrice: searchParams.get('minPrice') || '',
			maxPrice: searchParams.get('maxPrice') || ''
		}
	})

	const { fields } = useFieldArray({
		control,
		name: 'properties'
	})

	useEffect(() => {
		/* axios.get(`/api/properties?categoryId=${category.id}`).then(response => {
			setProperties(response.data)
			setValue('properties', response.data)
		}) */
		setIsLoading(true)
		axios
			.get(`/api/properties?categoryId=${category.id}`)
			.then(response => {
				const urlParams = new URLSearchParams(window.location.search)
				setProperties(response.data)
				setValue(
					'properties',
					response.data.map((prop: Property) => ({
						name: prop.name,
						value: searchParams.get(prop.name) || 'all'
					}))
				)
				setValue('sort', urlParams.get('sort') || 'all')
				setValue('minPrice', urlParams.get('minPrice') || '')
				setValue('maxPrice', urlParams.get('maxPrice') || '')
			})
			.finally(() => setIsLoading(false))
	}, [category.id, setValue, searchParams])

	const setFilters: SubmitHandler<FieldValues> = async data => {
		router.push(
			createPageURL(data.properties, data.sort, data.minPrice, data.maxPrice)
		)
	}

	/* useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		fields.forEach((field, index) => {
			const value = urlParams.get(field.name) || 'all'
			setValue(`properties.${index}.value`, value)
		})
		setValue('sort', urlParams.get('sort') || 'all')
		setValue('minPrice', urlParams.get('minPrice') || '')
		setValue('maxPrice', urlParams.get('maxPrice') || '')
	}, [searchParams, fields, setValue]) */

	const resetFilters = () => {
		reset({
			properties:
				category.properties?.map(prop => ({
					name: prop.name,
					value: 'all'
				})) || [],
			sort: 'all',
			minPrice: '',
			maxPrice: ''
		})
		router.push(pathname)
		router.refresh()
	}

	if (!category.products) return null

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title={category.name} />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 mb-10">
					{category.products && category.products[0].images.length > 0 ? (
						<div className="bg-white relative sm:w-3/4 xl:w-1/2 h-65 mb-4 aspect-square rounded-md">
							<Image
								fill
								src={category?.products[0]?.images[0].toString()}
								alt={category.name}
								className="object-contain"
							/>
						</div>
					) : (
						<MdIcecream size={210} />
					)}
					<div className="flex flex-col items-start justify-center">
						{category.description}
					</div>
				</div>

				<div className="mb-4">
					<SubHeading title="Фильтры" />
				</div>

				<form
					onSubmit={handleSubmit(setFilters)}
					className="space-y-5 mb-5 bg-white p-5 rounded-lg shadow-md"
				>
					<div className="flex flex-col gap-5">
						<fieldset className="space-y-3">
							<legend className="text-lg font-semibold">Свойства</legend>
							{isLoading ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
									<Skeleton height={48} />
									<Skeleton height={48} />
								</div>
							) : (
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
									{fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-center gap-2 bg-gray-100 py-2 px-3 rounded-md"
										>
											<label
												className="text-gray-700"
												htmlFor={`property - ${index}`}
											>
												{field.name}:
											</label>
											<select
												id={`property - ${index}`}
												{...register(`properties.${index}.value`)}
												className="bg-white border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="all">Все</option>
												{properties
													.find(prop => prop.name === field.name)
													?.values.map((val, idx) => (
														<option key={idx} value={val}>
															{val}
														</option>
													))}
											</select>
										</div>
									))}
								</div>
							)}
						</fieldset>

						<fieldset className="space-y-3">
							<legend className="text-lg font-semibold">Сортировка</legend>
							{isLoading ? (
								<div className="flex flex-col gap-2 bg-gray-100 py-2 px-3 rounded-md">
									<Skeleton count={1} height={70} />
								</div>
							) : (
								<div className="flex flex-col gap-2 bg-gray-100 py-2 px-3 rounded-md">
									<label htmlFor="sort">Параметр сортировки:</label>
									<select
										id="sort"
										{...register('sort')}
										className="bg-white border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="all">Показать все</option>
										<option value="cheap">Сначала дешевые</option>
										<option value="expensive">Сначала дорогие</option>
										<option value="new">Сначала новые</option>
										<option value="old">Сначала старые</option>
									</select>
								</div>
							)}
						</fieldset>
					</div>

					<fieldset className="space-y-3">
						<legend className="text-lg font-semibold">Цена</legend>
						{isLoading ? (
							<div className="max-w-[300px] flex gap-3 md:grid-cols-2">
								<Skeleton count={1} height={80} baseColor="red" />
								<Skeleton count={1} height={80} />
							</div>
						) : (
							<div className="max-w-[300px] flex gap-3 md:grid-cols-2">
								<Input
									id="minPrice"
									register={register('minPrice', {
										min: {
											value: 0,
											message: 'Введите неотрицательное значение '
										}
									})}
									errors={errors}
									label="От"
									type="number"
								/>

								<Input
									id="maxPrice"
									register={register('maxPrice', {
										min: {
											value: getValues('minPrice'),
											message: 'Введите значение, большее минимальной цены'
										}
									})}
									errors={errors}
									label="До"
									type="number"
								/>
							</div>
						)}
					</fieldset>

					<div className="max-w-[350px] flex gap-3">
						<Button label="Применить" small type="submit" />
						<Button
							label="Сбросить фильтры"
							small
							type="button"
							outline
							onClick={resetFilters}
						/>
					</div>
				</form>

				{products.length > 0 ? (
					<>
						<ProductsGrid products={products} user={user} type="default" />
						{totalPages > 1 && (
							<div className="mt-5 flex w-full justify-center">
								<Pagination totalPages={totalPages} />
							</div>
						)}
					</>
				) : (
					<div className="flex items-center justify-center text-center text-2xl font-semibold">
						Товары не найдены
					</div>
				)}
			</Container>
		</div>
	)
}

export default CategoryClient
