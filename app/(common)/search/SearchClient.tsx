'use client'

import Button from '@/app/components/buttons/Button'
import Heading from '@/app/components/heading/Heading'
import SubHeading from '@/app/components/heading/SubHeading'
import Input from '@/app/components/inputs/Input'
import ProductsGrid from '@/app/components/product/ProductsGrid'
import Container from '@/app/components/ui/Container'
import Pagination from '@/app/components/ui/Pagination'
import { ExtendedProduct, SafeUser } from '@/types'
import { pluralizeRu } from '@/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface SearchClientProps {
	products: ExtendedProduct[]
	totalPages: number
	user: SafeUser | null
}

const SearchClient: FC<SearchClientProps> = ({
	products,
	totalPages,
	user
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const [query, setQuery] = useState<string>(searchParams.get('query') || '')

	const {
		register,
		getValues,
		setValue,
		handleSubmit,
		formState: { errors }
	} = useForm<FieldValues>({
		defaultValues: {
			query: searchParams.get('query') || ''
		}
	})

	useEffect(() => {
		setValue('query', query)
	}, [setValue, query])

	const createPageURL = (query: string) => {
		const params = new URLSearchParams(searchParams)
		if (query.length > 0) {
			params.set('query', query)
		} else {
			params.delete('query')
		}

		return `${pathname}?${params.toString()}`
	}

	const searchProducts: SubmitHandler<FieldValues> = async data => {
		const query = getValues('query') || ''
		router.push(createPageURL(query))
	}

	return (
		<div className="py-10">
			<Container>
				<div className="mb-5">
					<Heading title="Поиск товаров" />
				</div>
				<form onSubmit={handleSubmit(searchProducts)} className="flex mb-5">
					<Input
						id="query"
						register={register('query', {
							required: { value: true, message: 'Заполните поле' }
						})}
						label="Поиск..."
						/* onChange={e => setQuery(e.target.value)} */
						type="text"
						errors={errors}
					/>
					<div className="flex max-w-[100px]">
						<Button label="Поиск" type="submit" />
					</div>
				</form>
				{getValues('query') && products.length > 0 ? (
					<>
						<div className="mb-5">
							<SubHeading
								title={`По запросу "${getValues('query')}" найдено ${
									products.length
								} ${pluralizeRu(
									products.length,
									'товар',
									'товара',
									'товаров'
								)}`}
							/>
						</div>
						<ProductsGrid products={products} user={user} type="default" />
						{totalPages > 1 && (
							<div className="mt-5 flex w-full justify-center">
								<Pagination totalPages={totalPages} />
							</div>
						)}
					</>
				) : (
					getValues('query') && (
						<div className="mb-5">
							<SubHeading
								title={`По запросу "${getValues('query')}" товаров не найдено `}
							/>
						</div>
					)
				)}
			</Container>
		</div>
	)
}

export default SearchClient
