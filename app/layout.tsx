import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import Loader from './components/ui/Loader'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
	title: 'ElectroShop',
	description: 'Магазин товаров цифровой техники'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} bg-white`}>
				<Loader />
				<Toaster />
				<main>{children}</main>
			</body>
		</html>
	)
}
