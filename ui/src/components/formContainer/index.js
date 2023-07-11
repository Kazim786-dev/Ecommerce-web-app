/* eslint-disable react/prop-types */
import React from 'react'
import { Container, Card } from 'react-bootstrap'

const FormContainer = ({ 
	children, 
	heading }) => {
    
	return (
		<Container className='auth-form-container'>
			<div className="text-center text-primary">
				<h2>{heading}</h2>
			</div>
			<div className="d-flex justify-content-center align-items-center">
				<Card className="w-50 p-4 pt-3 mt-3">
					{/* <Card className='form-card p-4 pt-3'> */}
					{children}
				</Card>
			</div>
		</Container>
	)
}

export default FormContainer
