import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

//pages
import AllProductsPage from '../pages/product/ProductsPage'
import CartPage from '../pages/cart/cart'
import ForgetPasswordPage from '../pages/auth/forget-password'
import LoginPage from '../pages/auth/login'
import NewPassPage from '../pages/auth/new-password'
import SignUpPage from '../pages/auth/signup'
import TotalOrders from '../pages/orders/cust-total-orders'

const RouterLinks = ({
	user}) => {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ !user.name==''? <Navigate to='/products'/> : <LoginPage /> } />
				<Route path="/signup" element={<SignUpPage />} />
				<Route path="/forget-pass" element={<ForgetPasswordPage />} />
				<Route path="/new-pass" element={<NewPassPage />} />
				<Route path="/products" element={<AllProductsPage user={user} />} />
				<Route path="/cart" element={!user.name==''? <CartPage user={user}/> : <Navigate to='/'/> }></Route>
				<Route path="/total-orders" element={ !user.name==''? <TotalOrders user={user}/> : <Navigate to='/'/>}></Route>
				<Route path="*" element={<h1>Page Not Found!</h1>} />
			</Routes>
		</BrowserRouter>
	)
}

export default RouterLinks
