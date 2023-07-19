import React, { useState } from 'react'
import axios from 'axios'

// react-ootstrap
import { Form, Row, Col } from 'react-bootstrap'

//react-router-dom
import { Link,useNavigate } from 'react-router-dom'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//function based component
function ForgetPasswordPage() {

	//states
	const [email, setEmail] = useState('')
	const [emailError, setEmailError] = useState('')
	const [showAlert, setShowAlert] = useState(false)

	//object to navigate to different pages
	const navigate = useNavigate()

	const handleSubmit = async(e) => {
		e.preventDefault()
		// Perform login logic here

		try {
			const res = await axios.post(`${process.env.REACT_APP_DEV_BACKEND_URL}/users/verify-mail`, {
				email: email
			})

			if(res.data.status===200){
				setShowAlert(true)
			}			
			// navigate('/new-pass')
		} catch (error) {
			//console.log(error)
		}

		//clear all fields
		setEmail('')
	}

	const validateEmail = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError('Enter a valid email address')
		} else {
			setEmailError('')
		}
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
	}

	return (
		<FormContainer heading="Forgot Password">
			<Form onSubmit={handleSubmit}>
				<Row>
					<FormField
						controlId="email"
						label="Enter email address"
						type="text"
						placeholder="Please enter your email"
						value={email}
						onChange={handleEmailChange}
						onBlur={validateEmail}
					/>
					{emailError && <p className="text-danger">{emailError}</p>}

				</Row>
                
				<Row className='m-0 mt-4'>
					<CustomButton variant="primary" type="submit" className="w-100" isDisabled={emailError!=='' || email==''}>
                        Forgot Password
					</CustomButton>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-0 text-styles">No, I remember my password! <Link to='/' className="text-decoration-none">Login</Link></p>
					</Col>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp variant="success" text="Your account has been created. Instruction sent to your email id." onClose={() => setShowAlert(false)}/>
			)}

		</FormContainer>
	)
}

export default ForgetPasswordPage
