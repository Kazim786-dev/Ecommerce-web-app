/* eslint-disable react/prop-types */
import React from 'react'
import { Button } from 'react-bootstrap'

const CustomButton = ({
	variant,
	type,
	className,
	children,
	onClick }) => {
    
	return (
		<Button variant={variant} type={type} className={className} onClick={onClick}>
			{children}
		</Button>
	)
}

export default CustomButton
