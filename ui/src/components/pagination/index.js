/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react'

//react-bootstrap
import Pagination from 'react-bootstrap/Pagination'

const PaginationComp = ({totalPages, currentPage, setCurrentPage }) => {

	const goToPage = (page) => {
		setCurrentPage(page)
	}

	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	const previousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	const renderItems = () => {
		const items = []
		let startPage = 1
		let endPage = totalPages

		if (totalPages > 6) {
			if (currentPage <= 4) {
				endPage = 6
			} else if (currentPage >= totalPages - 3) {
				startPage = totalPages - 5
			} else {
				startPage = currentPage - 3
				endPage = currentPage + 2
			}
		}

		for (let number = startPage; number <= endPage; number++) {
			items.push(
				<Pagination.Item
					key={number}
					active={number === currentPage}
					onClick={() => goToPage(number)}
				>
					{number}
				</Pagination.Item>
			)
		}

		return items
	}

	return (

		<Pagination size="md" className="m-0">
			<Pagination.Item onClick={() => previousPage()}>Previous</Pagination.Item>
			{renderItems()}
			<Pagination.Item onClick={() => nextPage()}>Next</Pagination.Item>
		</Pagination>
	)
}

export default PaginationComp