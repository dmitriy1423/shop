import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '../components/ui/Container'
import FormWrapper from '../components/ui/FormWrapper'
import LoginForm from './LoginForm'

const Login = async () => {
	const currentUser = await getCurrentUser()

	return (
		<Container>
			<FormWrapper>
				<LoginForm currentUser={currentUser} />
			</FormWrapper>
		</Container>
	)
}

export default Login
