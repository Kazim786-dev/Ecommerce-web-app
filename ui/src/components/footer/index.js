import React from 'react'

//component
import PaginationComp from '../../components/pagination'

const Footer = ({className, text, pageSize, url}) => {
	return (<div className = {className} >
		<p className='text-styles'>{text}</p>
		<PaginationComp pageSize={pageSize} url={url} />
	</div>)
}

export default Footer