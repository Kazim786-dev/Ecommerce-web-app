/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import axios from 'axios'

// react-bootstrap
import { Form, Row, Col } from 'react-bootstrap'

//react-router-dom
import { Link } from 'react-router-dom'

//components
import AlertComp from '../../components/alert'
import CustomButton from '../../components/button'
import FormField from '../../components/input-field'
import FormContainer from '../../components/formContainer'

//redux
import { useDispatch } from 'react-redux'
import { login } from '../../redux/slice/auth/user-slice'

//function based component
const LoginPage = () => {

	//states
	// Create an object to store the form data
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false,
	})
	const [emailError, setEmailError] = useState('')
	const [showAlert, setShowAlert] = useState(false)
	const dispatch = useDispatch()

	// Destructure the form data object
	const { email, password, remember } = formData

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const res = await axios.post(`${process.env.REACT_APP_DEV_BACKEND_URL}/auth/signin`, {
				email: email,
				password: password
			})

			if (res.data.token) {
				dispatch(login({
					email,
					password,
					name: res.data.user.name,
					mobile: res.data.user.mobile,
					token: res.data.token,
					rememberMe: formData.remember,
					role: res.data.user.role
				}))
				setShowAlert(false)
			}
		} catch (error) {
			setShowAlert(true) // Set showAlert to true to show the alert
		}

		// Clear all fields by resetting the form data state
		setFormData({
			email: '',
			password: '',
			remember: false,
		})
	}

	const validateEmail = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError('Enter a valid email address')
		} else {
			setEmailError('')
		}
	}

	const handleFieldChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	return (
		<FormContainer heading="Login">
			<Form onSubmit={handleSubmit}>
				<Row>
					<FormField
						controlId="email"
						label="Enter email address"
						type="text"
						placeholder="Please enter your email"
						name="email"
						value={email}
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
						placeholder="Please enter password"
						name="password"
						value={password}
						onChange={handleFieldChange}
					/>
				</Row>
				<Row className="mt-2">
					<Form.Group controlId="remember" className="mb-3">
						<Form.Check className='text-styles' type="checkbox" name="remember" label="Remember me" checked={remember} onChange={handleFieldChange} />
					</Form.Group>
				</Row>
				<Row className='m-0 mt-4'>
					<CustomButton variant="primary" type="submit" className="w-100" isDisabled={emailError !== '' || password == ''}>
						Login
					</CustomButton>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-2 text-styles">Forgot password! <Link to='/forget-pass' className="text-decoration-none">Reset</Link></p>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col>
						<p className="text-center mb-0 text-styles">I don't have an account! <Link to='/signup' className="text-decoration-none">SignUp</Link></p>
					</Col>
				</Row>
			</Form>

			{showAlert && (
				<AlertComp variant="danger" text="Wrong username password, please enter correct credentials" onClose={() => setShowAlert(false)} />
			)}

		</FormContainer>
	)
}

export default LoginPage
