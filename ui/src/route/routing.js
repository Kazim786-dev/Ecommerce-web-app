import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

//pages
import AllProductsPage from '../pages/product/ProductsPage'
import CartPage from '../pages/cart/cart'
import ForgetPasswordPage from '../pages/auth/forget-password'
import LoginPage from '../pages/auth/login'
import NewPassPage from '../pages/auth/new-password'
import SignUpPage from '../pages/auth/signup'
import TotalOrders from '../pages/orders/cust-total-orders'

//components
import NavbarComp from '../components/navbar'

const RouterLinks = ({
	user }) => {

	return (
		<>
			<BrowserRouter>
				<NavbarComp name={user.name} userPicture={'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80'} />
				<Routes>
					<Route path="/" element={<Navigate to='/products' />} />
					<Route path="/login" element={user.name == '' ? <LoginPage /> : <Navigate to='/products' /> } />
					<Route path="/signup" element={ user.name == '' ? <SignUpPage /> : <Navigate to='/products' /> } />
					<Route path="/forget-pass" element={<ForgetPasswordPage />} />
					<Route path="/new-pass" element={<NewPassPage />} />
					<Route path="/products" element={<AllProductsPage user={user} />} />
					<Route path="/cart" element={user.name !== '' ? <CartPage user={user} /> : <Navigate to='/login' />}></Route>
					<Route path="/total-orders" element={user.name !== '' ? <TotalOrders user={user} /> : <Navigate to='/login' />}></Route>
					<Route path="*" element={<h1>Page Not Found!</h1>} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default RouterLinks
