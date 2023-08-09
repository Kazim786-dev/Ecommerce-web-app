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
	const [alertText, setAlertText] = useState('')
	const [variant, setVariant] = useState()
	const [showAlert, setShowAlert] = useState(false)

	const handleSubmit = async(e) => {
		e.preventDefault()
		// Perform login logic here
		if(validateEmail()==false){
			return
		}
		try {
			const res = await axios.post(`${process.env.REACT_APP_DEV_BACKEND_URL}/users/verify-mail`, {
				email: email
			})

			if(res.status && res.status===200){
				setAlertText('Reset Password Instructions has been sent to your email address.')
				setShowAlert(true)
				setVariant('success')
			}
		} catch (error) {
			setVariant('danger')
			if(error.response?.status && error.response.status===404){
				setAlertText('User not found')
			}
			else{
				setAlertText('Error occured')
			}
			setShowAlert(true)
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
			return true
		}
		return false
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
		setEmailError('')
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
					/>
					{emailError && <p className="text-danger">{emailError}</p>}

				</Row>
                
				<Row className='m-0 mt-4'>
					<CustomButton variant="primary" type="submit" className="w-100" 
						// isDisabled={emailError!=='' || email==''}
					>
                        Forgot Password
					</CustomButton>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-0 text-styles">No, I remember my password! <Link to='/login' className="text-decoration-none">Login</Link></p>
					</Col>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp 
					variant={variant} 
					text={alertText}
					onClose={() => setShowAlert(false)}
				/>
			)}

		</FormContainer>
	)
}

export default ForgetPasswordPage
