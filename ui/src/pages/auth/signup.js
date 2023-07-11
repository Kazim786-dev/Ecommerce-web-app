import React, { useState } from 'react'

// react-ootstrap
import { Form, Row, Col } from 'react-bootstrap'

//react-router-dom
import { Link } from 'react-router-dom'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//function based component
function SignUpPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		mobile: '',
	})
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [showAlert, setShowAlert] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		validatePassword()

		if (passwordError === '' && emailError === '') {
			setShowAlert(true)
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
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			setEmailError('Enter a valid email address')
		} else {
			setEmailError('')
		}
	}

	const validatePassword = () => {
		const hasUppercase = /[A-Z]/.test(formData.password)
		const hasLowercase = /[a-z]/.test(formData.password)
		const hasNumber = /\d/.test(formData.password)
		const hasSymbol = /[!@#$%^&*]/.test(formData.password)

		if (!(hasUppercase && hasLowercase && hasNumber && hasSymbol)) {
			setPasswordError(
				'Password must contain a capital letter, small letter, number, and symbol'
			)
		} else {
			setPasswordError('')
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
						onBlur={validateEmail}
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
						type="number"
						placeholder="mobile number"
						name="mobile"
						value={formData.mobile}
						onChange={handleFieldChange}
					/>
				</Row>
				<Row className="m-0 mt-4">
					<CustomButton variant="primary" type="submit" className="w-100">
            SignUp
					</CustomButton>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-0 text-styles">
              Already have an account!{' '}
							<Link to="/" className="text-decoration-none">
                Login
							</Link>
						</p>
					</Col>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp
					variant="success"
					text="Your account has been created. Instruction sent to your email id."
					onClose={() => setShowAlert(false)}
				/>
			)}
		</FormContainer>
	)
}

export default SignUpPage
