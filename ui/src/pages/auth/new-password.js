import React, { useState } from 'react'
import axios from 'axios'

// react-ootstrap
import { Form, Row } from 'react-bootstrap'

//react-router-dom
import { useParams } from 'react-router-dom'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//function based component
const NewPassPage = () => {

	//states
	const initialState = {
		password: '',
		confirmPassword: '',
	}

	const [formData, setFormData] = useState(initialState)
	const [passwordError, setPasswordError] = useState('')
	const [showAlert, setShowAlert] = useState(false)


	// Get the token from the URL using useParams
	const { token } = useParams()


	const handleSubmit = async (e) => {
		e.preventDefault()

		// Perform login logic here
		if (validatePassword()) {

			try {
				// Send the token and new password in the request body
				const response = await axios.patch(`${process.env.REACT_APP_DEV_BACKEND_URL}/users/update-password`, { token, newPassword: formData.password })
				console.log(response)
				if (response.status === 200) {
					setShowAlert(true)
				}
			} catch (error) {
				console.log('Error updating password. Please try again.\n'+error)
			}


		}
		// Clear all fields
		setFormData(initialState)
	}

	const validatePassword = () => {
		const { password } = formData
		const isValidPassword = /[A-Z]/.test(password)
			&& /[a-z]/.test(password)
			&& /\d/.test(password)
			&& /[!@#$%^&*]/.test(password)

		if (!isValidPassword) {
			setPasswordError('Password must contain a capital letter, small letter, number, and symbol')
		} else {
			setPasswordError('')
		}

		return isValidPassword
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
					<CustomButton
						variant="primary"
						type="submit"
						className="w-100"
						isDisabled={passwordError!==''
							|| formData.password === ''
							|| formData.password !== formData.confirmPassword
						}>
						Reset Password
					</CustomButton>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp
					variant="success"
					text="Your password has been updated. Please check your email."
					onClose={() => setShowAlert(false)}
				/>
			)}

		</FormContainer>
	)
}

export default NewPassPage
