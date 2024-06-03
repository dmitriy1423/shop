import { FC } from 'react'

interface SubHeadingProps {
	title: string
	center?: boolean
	class?: string
}

const SubHeading: FC<SubHeadingProps> = ({ title, center }) => {
	return (
		<div className={center ? 'text-center' : 'text-start'}>
			<h2 className="font-bold text-2xl">{title}</h2>
		</div>
	)
}

export default SubHeading
