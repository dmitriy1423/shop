import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '../components/ui/Container'
import FormWrapper from '../components/ui/FormWrapper'
import RegisterForm from './RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Регистрация',
	description: 'Магазин товаров цифровой техники'
}

const Register = async () => {
	const user = await getCurrentUser()

	return (
		<Container>
			<FormWrapper>
				<RegisterForm user={user} />
			</FormWrapper>
		</Container>
	)
}

export default Register
