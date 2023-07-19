/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import axios from 'axios'

//svg
import { ReactComponent as ArrowLeft } from '../../static/images/svg/Arrow left.svg'
import { ReactComponent as ArrowUpRight } from '../../static/images/svg/Arrow up right.svg'

//components
import DetailsTable from '../../components/table'
import Footer from '../../components/footer'
import OffCanvasComp from '../../components/offcanvas'
import SpinnerComp from '../../components/spinner'

//redux
// import { useSelector, useDispatch } from 'react-redux'

function TotalOrders({ user }) {

	//states
	const [show, setShow] = useState(false)
	const [orderItem, setOrderItem] = useState()

	const [loading, setLoading] = useState(true)

	// const user = useSelector((state)=>state.customer)
	// const dispatch = useDispatch()

	// Sample data for the table
	// const orderItems = [
	// 	{
	// 		Date: '22 March 2023', OrderNo: '342599', Amount: 550,
	// 		products: [
	// 			{ id: 1, name: 'Product 1', description: 'This is product 1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80', price: 10, quantity: 5 },
	// 			{ id: 2, name: 'Product 2', description: 'This is product 2', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80', price: 20, quantity: 0 },
	// 			{ id: 3, name: 'Product 3', description: 'This is product 3', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80', price: 30, quantity: 2 },
	// 			{ id: 4, name: 'Product 4', description: 'This is product 4', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80', price: 40, quantity: 4 },
	// 		]
	// 	},
	// ]

	const [orderItems, setOrderItems] = useState([])

	useEffect(() => {
		fetchOrders()
	}, [])

	const fetchOrders = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_DEV_BACKEND_URL}/orders/user-orders`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			if (response.status === 200) {
				setOrderItems(response.data.orders)
				setLoading(false)
			}
			
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}

	// table column styling
	const columns = [
		{
			header: 'Date',
			width: '17rem',
			render: (item) => item.date
		},
		{
			header: 'Order#',
			width: '20rem',
			render: (item) => item.orderNumber
		},
		{
			header: 'Products',
			width: '20rem',
			render: (item) => item.products.length
		},
		{
			header: 'Amount',
			width: '17rem',
			render: (item) => '$' + item.totalAmount.toFixed(2)
		},
		{
			header: 'Action',
			render: (item) => (
				<>
					<button className="bg-white border-0" onClick={() => handleButtonClick(item)}><ArrowUpRight /></button>
				</>
			),
		},
	]

	const handleButtonClick = (item) => {
		setOrderItem(item)
		setShow(true)
	}

	return (
		<>
			{loading ? (
				<SpinnerComp />
			) :
				(
					<>
						<Container fluid className="pt-0 p-5">
							<div className="d-flex align-items-center heading-container">
								<Link to='/products'><ArrowLeft /></Link>
								<h1 className="cart-heading ms-1" >Orders</h1>
							</div>

							<DetailsTable data={orderItems} columns={columns} />

							<Footer className={'d-flex justify-content-between align-items-center pt-3'} text={`${orderItems.length} Total Count`} pageSize={8} url={'/api/data'} />

						</Container>
						{show && <OffCanvasComp placement={'end'} show={show} setShow={setShow} orderItem={orderItem} user={user} />}
					</>
				)}
		</>

	)
}

export default TotalOrders
