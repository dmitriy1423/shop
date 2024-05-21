import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './components/footer/Footer'
import NavBar from './components/nav/NavBar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
	title: 'E-shop',
	description: 'E-shop digit'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster />
				<NavBar />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
