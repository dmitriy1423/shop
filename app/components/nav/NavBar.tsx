import { getCurrentUser } from '@/actions/getCurrentUser'
import Link from 'next/link'
import Container from '../ui/Container'
import CartCount from './CartCount'
import NavMenu from './NavMenu'
import UserMenu from './UserMenu'
import FavoritesCount from './FavoritesCount'
import { MdSearch } from 'react-icons/md'

const NavBar = async () => {
	const currentUser = await getCurrentUser()

	return (
		<div className="sticky top-0 w-full z-50 bg-white py-2 sm:py-4">
			<Container>
				<div className="flex items-center justify-between">
					<Link
						href={'/'}
						className="font-bold text-sm sm:text-xl lg:text-2xl order-0 sm:-order-1"
					>
						<span className="">
							Electro<span className="text-blue-600">Shop</span>
						</span>
					</Link>
					<div className="relative -order-1 sm:order-0">
						<NavMenu />
					</div>
					<div className="flex items-center gap-1 sm:gap-3 justify-between">
						<Link href={'/search'} aria-label="Поиск">
							<MdSearch size={24} />
						</Link>
						{currentUser && (
							<>
								<CartCount />
								<FavoritesCount />
							</>
						)}
						<UserMenu currentUser={currentUser} />
					</div>
				</div>
			</Container>
		</div>
	)
}

export default NavBar
