import { getCurrentUser } from '@/actions/getCurrentUser'
import Container from '../components/ui/Container'
import FormWrapper from '../components/ui/FormWrapper'
import RegisterForm from './RegisterForm'

const Register = async () => {
	const currentUser = await getCurrentUser()

	return (
		<Container>
			<FormWrapper>
				<RegisterForm currentUser={currentUser} />
			</FormWrapper>
		</Container>
	)
}

export default Register
