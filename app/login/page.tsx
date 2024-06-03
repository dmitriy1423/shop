import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '../components/ui/Container'
import FormWrapper from '../components/ui/FormWrapper'
import LoginForm from './LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'ElectroShop | Вход',
	description: 'Магазин товаров цифровой техники'
}

const Login = async () => {
	const user = await getCurrentUser()

	return (
		<Container>
			<FormWrapper>
				<LoginForm user={user} />
			</FormWrapper>
		</Container>
	)
}

export default Login
