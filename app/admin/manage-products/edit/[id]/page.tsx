'use client'

import ProductForm from '@/app/components/admin/ProductForm'
import Heading from '@/app/components/heading/Heading'
import Container from '@/app/components/ui/Container'
import { Product } from '@prisma/client'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

const EditProduct = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [productInfo, setProductInfo] = useState<Product>()
	const params = usePathname()
	const id = params.split('/').at(-1)

	useEffect(() => {
		if (!id) return

		setIsLoading(true)
		axios
			.get(`/api/products/${id}`)
			.then(response => {
				setProductInfo(response.data)
			})
			.finally(() => setIsLoading(false))
	}, [id])

	return (
		<div className="mt-10">
			<Container>
				<Heading title="Редактировать товар" />
				{isLoading && <Skeleton count={10} height={50} />}
				{productInfo && <ProductForm {...productInfo} />}
			</Container>
		</div>
	)
}

export default EditProduct
