import React from 'react'

const SummaryElement = ({title, count, className}) => {
	return (
		<div className={className}>
			<p className='m-0'>{title}</p>
			<h4 className='m-0 cart-heading'>{count}</h4>
		</div>
	)
}

export default SummaryElement
