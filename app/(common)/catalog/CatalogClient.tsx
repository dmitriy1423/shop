'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Checkbox from '@/app/components/inputs/Checkbox'
import Input from '@/app/components/inputs/Input'
import ProductsGrid from '@/app/components/product/ProductsGrid'
import Container from '@/app/components/ui/Container'
import Pagination from '@/app/components/ui/Pagination'
import { SafeUser } from '@/types'
import { Category, Product } from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface CatalogClientProps {
	categories: Category[]
	products: Product[]
	totalPages: number
	user: SafeUser | null
}

const CatalogClient: FC<CatalogClientProps> = ({
	categories,
	products,
	totalPages,
	user
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		searchParams.get('categoryId')?.split(',') || []
	)

	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			categoryIds: selectedCategories,
			sort: searchParams.get('sort') || 'all',
			minPrice: searchParams.get('minPrice') || '',
			maxPrice: searchParams.get('maxPrice') || ''
		}
	})

	useEffect(() => {
		setValue('categoryIds', selectedCategories)
	}, [selectedCategories, setValue])

	const createPageURL = (
		categoryIds: string[],
		sort: string,
		minPrice: string,
		maxPrice: string
	) => {
		const params = new URLSearchParams(searchParams)
		if (params.get('page')) {
			params.delete('page')
		}
		if (categoryIds.length > 0) {
			params.set('categoryId', categoryIds.join(','))
		} else {
			params.delete('categoryId')
		}
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

	const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
		setSelectedCategories(prev =>
			isChecked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
		)
	}

	const searchProducts: SubmitHandler<FieldValues> = async data => {
		const selectedCategories = getValues('categoryIds') || []
		router.push(
			createPageURL(selectedCategories, data.sort, data.minPrice, data.maxPrice)
		)
	}

	const resetFilters = () => {
		setSelectedCategories([])
		reset({
			categoryIds: [],
			sort: 'all',
			minPrice: '',
			maxPrice: ''
		})
		router.push(pathname)
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Каталог товаров" />
				</div>
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
					<div className="flex flex-col col-span-4">
						<div className="mb-4">
							<SubHeading title="Фильтры" />
						</div>
						<form
							onSubmit={handleSubmit(searchProducts)}
							key={selectedCategories.join(',')}
							className="space-y-5 bg-white p-5 rounded-lg shadow-md"
						>
							{categories.length > 0 && (
								<fieldset className="space-y-3">
									<legend className="text-lg font-semibold">Категории</legend>
									<div className="bg-gray-100 py-2 px-3 rounded-md grid gap-2 md:grid-cols-2">
										{categories.map(category => (
											<div key={category.id}>
												<Checkbox
													register={register}
													id={`categoryIds.${category.id}`}
													label={category.name}
													defaultChecked={selectedCategories.includes(
														category.id
													)}
													onChange={e =>
														handleCategoryChange(category.id, e.target.checked)
													}
												/>
											</div>
										))}
									</div>
								</fieldset>
							)}

							<fieldset className="space-y-3">
								<legend className="text-lg font-semibold">Сортировка</legend>
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
							</fieldset>

							<fieldset className="space-y-3">
								<legend className="text-lg font-semibold">Цена</legend>
								<div className="max-w-[300px] flex gap-3 md:grid-cols-2">
									<Input
										id="minPrice"
										register={register('minPrice', {
											min: {
												value: 0,
												message: 'Введите неотрицательное значение'
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
					</div>
					<div className="col-span-8 mt-12">
						{products.length > 0 ? (
							<>
								<ProductsGrid products={products} user={user} type="catalog" />
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
					</div>
				</div>
			</Container>
		</div>
	)
}

export default CatalogClient
