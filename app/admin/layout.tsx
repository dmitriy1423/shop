import { Metadata } from 'next'
import { ReactNode } from 'react'
import AdminNav from '../components/admin/AdminNav'
import Link from 'next/link'
import Heading from '../components/heading/Heading'
import { MdArrowBack } from 'react-icons/md'

export const metadata: Metadata = {
	title: 'ElectroShop | Панель администратора',
	description: 'Панель администратора'
}

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="bg-white">
			<div className="py-4 flex flex-col items-center">
				<Heading title="Панель администратора" center />
				<Link href={'/'} className="mt-2 flex items-center gap-1">
					<MdArrowBack /> Вернуться в магазин
				</Link>
			</div>
			<AdminNav />
			{children}
		</div>
	)
}
