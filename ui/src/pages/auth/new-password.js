import React, { useState } from 'react'

// react-ootstrap
import { Form, Row } from 'react-bootstrap'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//function based component
function NewPassPage() {

	//states
	const initialState = {
		password: '',
		confirmPassword: '',
	}

	const [formData, setFormData] = useState(initialState)
	const [passwordError, setPasswordError] = useState('')
	const [showAlert, setShowAlert] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()

		// Perform login logic here
		if (validatePassword()) {
			setShowAlert(true)
		}

		// Clear all fields
		setFormData(initialState)
	}

	const validatePassword = () => {
		const { password } = formData
		const hasUppercase = /[A-Z]/.test(password)
		const hasLowercase = /[a-z]/.test(password)
		const hasNumber = /\d/.test(password)
		const hasSymbol = /[!@#$%^&*]/.test(password)

		if (!(hasUppercase && hasLowercase && hasNumber && hasSymbol)) {
			setPasswordError('Password must contain a capital letter, small letter, number, and symbol')
			return false
		} else {
			setPasswordError('')
			return true
		}
	}

	const handleFieldChange = (e) => {
		const { name, value } = e.target
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	return (
		<FormContainer heading="New Password">
			<Form onSubmit={handleSubmit}>
				<Row className="mt-3">
					<FormField
						controlId="password"
						label="Enter new Password"
						type="password"
						placeholder="enter password"
						name="password"
						value={formData.password}
						onChange={handleFieldChange}
						onBlur={validatePassword}
					/>

					{passwordError && <p className="text-danger">{passwordError}</p>}
				</Row>
				<Row className="mt-3">
					<FormField
						controlId="confirmPassword"
						label="Confirm Password"
						type="password"
						placeholder="confirm password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleFieldChange}
					/>

				</Row>
				<Row className='m-0 mt-4'>
					<CustomButton variant="primary" type="submit" className="w-100">
                        Reset Password
					</CustomButton>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp variant="success" text="Your password has been updated.  Please check your email." onClose={() => setShowAlert(false)} />
			)}

		</FormContainer>
	)
}

export default NewPassPage
