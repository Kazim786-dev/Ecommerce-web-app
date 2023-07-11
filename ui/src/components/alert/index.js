/* eslint-disable react/prop-types */
import React from 'react'
import { Alert } from 'react-bootstrap'


const AlertComp = ({
	variant, 
	onClose,
	text}) => {
	// () => setOrderPlaced(false)
	return(
		<Alert variant={variant} className="position-fixed top-0 end-0 m-4" onClose={onClose} dismissible>
			{text}
		</Alert>
	)

}

export default AlertComp