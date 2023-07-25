/* eslint-disable react/prop-types */
import React from 'react'

import { Navbar, Container, Nav, Badge, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//svg
import { ReactComponent as Bag } from '../../static/images/svg/Bag.svg'
import { ReactComponent as Bell } from '../../static/images/svg/Bell.svg'

//componenets
import NavDropdownComp from '../nav-dropdown'

import { logout } from '../../redux/slice/auth/customer-slice'
import { empty } from '../../redux/slice/cart/cart-slice'

import { useSelector, useDispatch } from 'react-redux'

const NavbarComp = ({
	user,
	userPicture,
}) => {

	const dispatch = useDispatch()
	const cartProducts = useSelector((state) => state.cart.products)

	//drop down items
	const dropdownItems = [
		{ to: '/total-orders', label: 'Orders' },
		'divider',
		{ to: '/login', label: 'Logout', onClick: ()=>{
			dispatch(logout())
			dispatch(empty())
		} 
		}
	]

	return (
		<Navbar bg="white" expand="lg" className="mb-5">
			<Container fluid className="ps-1 pe-1 ms-5 me-5">
				<Navbar.Brand>
					<Link to="/" className="text-decoration-none navbar-heading">E-commerce</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbar-nav" />
				<Navbar.Collapse id="navbar-nav">
					<Nav className="ms-auto align-items-center">
						<Link to="/cart" className="me-4">
							<div style={{ position: 'relative' }}>
								<Bag />
								{cartProducts.length > 0 &&
									<Badge className='position-absolute translate-middle rounded-circle'>{cartProducts.length}
									</Badge>
								}

							</div>
						</Link>
						<Link className="me-4">
							<Bell />
						</Link>
						{user.name !== '' ?
							(<>
								<NavDropdownComp title={<span style={{ color: 'blue' }}>{user.name}</span>} items={dropdownItems} />
								<Image
									src={userPicture}
									alt="User Image"
									roundedCircle
									width={30}
									height={30}
								/>
							</>) :
							(<Link to="/login" className="text-decoration-none">
								Login
							</Link>)
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default NavbarComp
