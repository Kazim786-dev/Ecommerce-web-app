import React, { useEffect } from 'react'

//component
import PaginationComp from '../../components/pagination'

const Footer = ({className, text, totalPages, currentPage, setCurrentPage}) => {

	return (<div className = {className} >
		<p className='text-styles'>{text}</p>
		<PaginationComp
			totalPages={totalPages}
			currentPage={currentPage}
			setCurrentPage={setCurrentPage}			
		/>
	</div>)
}

export default Footer