import {
	CartItem,
	Category,
	FavoriteItem,
	Order,
	OrderItem,
	Product,
	Property,
	Review,
	User
} from '@prisma/client'

export type SafeUser = Omit<
	User,
	'createdAt' | 'updatedAt' | 'emailVerified'
> & {
	createdAt: string
	updatedAt: string
	emailVerified: string | null
	orders?: ExtendedOrder[]
	reviews?: ExtendedReview[]
	cart?: ExtendedCart[]
	favorites?: ExtendedFavorites[]
}

export type ExtendedProduct = Product & {
	category?: Category
	reviews?: ExtendedReview[]
}

export type ExtendedCategory = Category & {
	properties?: Property[]
	products?: Product[]
}

export type ExtendedOrder = Order & {
	user: User
	items: ExtendedOrderItem[]
}

export type ExtendedOrderItem = OrderItem & {
	product: Product
}

export type ExtendedCart = CartItem & {
	product: Product
}

export type ExtendedFavorites = FavoriteItem & {
	product: Product
}

export type ExtendedReview = Review & {
	user: User
	product: Product
}
