import ProductForm from '@/app/components/admin/ProductForm'
import Heading from '@/app/components/heading/Heading'
import Container from '@/app/components/ui/Container'

const NewProduct = () => {
	return (
		<div className="mt-10">
			<Container>
				<Heading title="Добавить новый товар" />
				<ProductForm />
			</Container>
		</div>
	)
}

export default NewProduct
