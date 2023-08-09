import React, { useState } from 'react'
import axios from 'axios'

// react-bootstrap
import { Form, Row, Col } from 'react-bootstrap'

//react-router-dom
import { Link, useNavigate } from 'react-router-dom'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//function based component
function SignUpPage() {

	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		mobile: '',
	})
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [nameError, setNameError] = useState('')
	const [showAlert, setShowAlert] = useState(false)
	const [alertText, setAlertText] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setShowAlert(false)
		setAlertText('')

		if(validateEmail()==false || validatePassword()==false ){
			return
		}

		// Name validation: Check if name is not empty and has at least 3 characters (excluding spaces)
		if (formData.name.trim().length < 3) {
			setNameError('Name should contain at least 3 letters (excluding spaces).')
			return
		}

		try {
			const res = await axios.post(`${process.env.REACT_APP_DEV_BACKEND_URL}/auth/signup`, {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				mobile: formData.mobile,
			})
			if (res.status && res.status === 201) {
				navigate('/login')
			}
		}
		catch (error) {
			if (error.response && error.response.data && error.response.data.message) {
				setAlertText(error.response.data.message)
				setShowAlert(true)
			}
			else{
				setAlertText('Something went wrong!')
				setShowAlert(true)
			}
		}

		setFormData({
			name: '',
			email: '',
			password: '',
			mobile: '',
		})
		setPasswordError('')
		setEmailError('')
	}

	const validateEmail = () => {
		// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const  emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
		if (!emailRegex.test(formData.email)) {
			setEmailError('Enter a valid email address')
		} else {
			setEmailError('')
			return true
		}
		return false
	}

	const validatePassword = () => {
		const hasUppercase = /[A-Z]/.test(formData.password)
		const hasLowercase = /[a-z]/.test(formData.password)
		const hasNumber = /\d/.test(formData.password)
		const hasSymbol = /[~`!@#$%^&*()-_+=]/.test(formData.password)

		if (!(hasUppercase && hasLowercase && hasNumber && hasSymbol)) {
			setPasswordError(
				'Password must contain a capital letter, small letter, number, and symbol'
			)
		} else {
			setPasswordError('')
			return true
		}
		return false
	}

	const handleFieldChange = (e) => {
		const { name, value } = e.target
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}))
	}

	return (
		<FormContainer heading="SignUp">
			<Form onSubmit={handleSubmit}>
				<Row>
					<FormField
						controlId="name"
						label="Fullname"
						type="text"
						placeholder="Fullname"
						name="name"
						value={formData.name}
						onChange={handleFieldChange}
					/>
					{nameError && <p className="text-danger">{nameError}</p>}
				</Row>
				<Row className="mt-3">
					<FormField
						controlId="email"
						label="Email address"
						type="text"
						placeholder="email address"
						name="email"
						value={formData.email}
						onChange={handleFieldChange}
					/>
					{emailError && <p className="text-danger">{emailError}</p>}
				</Row>
				<Row className="mt-3">
					<FormField
						controlId="password"
						label="Password"
						type="password"
						placeholder="password"
						name="password"
						value={formData.password}
						onChange={handleFieldChange}
					/>
					{passwordError && <p className="text-danger">{passwordError}</p>}
				</Row>
				<Row className="mt-3">
					<FormField
						controlId="mobile"
						label="Mobile"
						type="text"
						placeholder="mobile number"
						name="mobile"
						value={formData.mobile}
						onChange={handleFieldChange}
					/>
				</Row>
				<Row className="m-0 mt-4">
					<CustomButton variant="primary" type="submit" className="w-100" 
						// isDisabled={
						// 	emailError !== '' ||
						// 	passwordError !== '' ||
						// 	formData.email == '' ||
						// 	formData.password == '' ||
						// 	formData.name == '' ||
						// 	formData.mobile == ''}
					>
						SignUp
					</CustomButton>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-0 text-styles">
							Already have an account!{' '}
							<Link to="/login" className="text-decoration-none">
								Login
							</Link>
						</p>
					</Col>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp
					variant="danger"
					text = {alertText}
					onClose={() => setShowAlert(false)}
				/>
			)}
		</FormContainer>
	)
}

export default SignUpPage
