export const generatePagination = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	if (currentPage <= 3) {
		return [1, 2, 3, '...', totalPages - 1, totalPages]
	}

	if (currentPage >= totalPages - 2) {
		return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
	}

	return [
		1,
		'...',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'...',
		totalPages
	]
}

export const truncateText = (str: string) => {
	if (str.length < 25) return str

	return str.substring(0, 25) + '...'
}

export const truncateTextDesc = (str: string) => {
	if (str.length < 200) return str

	return str.substring(0, 200) + '...'
}

export const pluralizeRu = (
	number: number,
	one: string,
	few: string,
	many: string
) => {
	if (number % 10 === 1 && number % 100 !== 11) {
		return one
	} else if (
		number % 10 >= 2 &&
		number % 10 <= 4 &&
		(number % 100 < 10 || number % 100 >= 20)
	) {
		return few
	} else {
		return many
	}
}
