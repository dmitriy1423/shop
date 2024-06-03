import { getCategories } from '@/actions/getCategories'
import Container from '../ui/Container'
import FooterCategories from './FooterCategories'
import FooterSocialList from './FooterSocialList'

const Footer = async () => {
	const categories = await getCategories()

	return (
		<footer className="py-10 bg-blue-900 text-white">
			<Container>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
					<FooterCategories categories={categories} />
					<div>
						<p>
							ElectroShoppe – ваш надежный интернет-магазин цифровой техники. Мы
							предлагаем широкий ассортимент новейших гаджетов и электроники от
							ведущих мировых брендов. Наша миссия – сделать современные
							технологии доступными каждому
						</p>
					</div>
					<FooterSocialList />
				</div>
			</Container>
		</footer>
	)
}

export default Footer
