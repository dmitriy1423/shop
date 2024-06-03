import {
	MdAdminPanelSettings,
	MdBadge,
	MdCategory,
	MdDashboard,
	MdList,
	MdSettings
} from 'react-icons/md'

export const navLinks = [
	{
		route: '/',
		label: 'Главная'
	},
	{
		route: '/categories',
		label: 'Категории'
	},
	{
		route: '/catalog',
		label: 'Каталог'
	}
]

export const adminNavLinks = [
	{
		route: '/admin',
		label: 'Сводка',
		name: '/',
		icon: MdDashboard
	},
	{
		route: '/admin/manage-products',
		label: 'Товары',
		name: 'manage-products',
		icon: MdBadge
	},
	{
		route: '/admin/manage-categories',
		label: 'Категории',
		name: 'manage-categories',
		icon: MdCategory
	},
	{
		route: '/admin/manage-orders',
		label: 'Заказы',
		name: 'manage-orders',
		icon: MdList
	},
	{
		route: '/admin/manage-users',
		label: 'Пользователи',
		name: 'manage-users',
		icon: MdAdminPanelSettings
	},
	{
		route: '/admin/manage-settings',
		label: 'Настройки',
		name: 'manage-settings',
		icon: MdSettings
	}
]
