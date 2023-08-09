/* eslint-disable react/prop-types */
import React from 'react'

import { Navbar, Container, Nav, Badge, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

//svg
import { ReactComponent as Bag } from '../../static/images/svg/Bag.svg'
import { ReactComponent as Bell } from '../../static/images/svg/Bell.svg'

//componenets
import NavDropdownComp from '../nav-dropdown'

import { logout } from '../../redux/slice/auth/user-slice'
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
		user.role!=='admin' && { to: '/total-orders', label: 'Orders' },
		user.role!=='admin' && 'divider',
		{ to: '/login', label: 'Logout', onClick: ()=>{
			dispatch(logout())
			dispatch(empty())
		}
		}
	].filter(Boolean) // Filter out undefined elements

	return (
		<Navbar bg="white" expand="lg" >
			<Container fluid className="ps-1 pe-1 ms-5 me-5">
				<Navbar.Brand>
					<Link to="/" className="text-decoration-none navbar-heading">E-commerce</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbar-nav" />
				<Navbar.Collapse id="navbar-nav">
					<Nav className="ms-auto align-items-center">
						{ user.role!=='admin' &&
							<Link to="/cart" className="me-4">
								<div style={{ position: 'relative' }}>
									<Bag />
									{cartProducts.length > 0 &&
									<Badge className='position-absolute translate-middle rounded-circle'>{cartProducts.length}
									</Badge>
									}

								</div>
							</Link>
						}
						<Link className="me-4">
							<Bell />
						</Link>
						{user.isLoggedIn ?
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
