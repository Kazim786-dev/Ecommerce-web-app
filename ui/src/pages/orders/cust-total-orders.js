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

function TotalOrders({ user }) {

	//states
	const [show, setShow] = useState(false)
	const [orderItem, setOrderItem] = useState()

	const [loading, setLoading] = useState(true)

	const [orderItems, setOrderItems] = useState([])

	//states for pagination
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	const pageSize = 8

	useEffect(() => {
		fetchOrders()
	}, [currentPage])

	const fetchOrders = async () => {
		try {
			setLoading(true)
			const response = await axios.get(
				`${process.env.REACT_APP_DEV_BACKEND_URL}/orders/user-orders?page=${currentPage}&size=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			if (response.status && response.status === 200) {
				const { totalPages, data } = response.data
				setOrderItems(data)
				setTotalPages(totalPages)
				setTimeout(() => {
					setLoading(false)
				}, 1000)
			}
		} catch (error) {
			setTimeout(() => {
				setLoading(false)
			}, 1000)
			console.error('Error fetching data:', error)
		}
		
	}

	// table column styling
	const columns = [
		{
			header: 'Date',
			width: '17rem',
			render: (item) => {
				const date = new Date(item.date)
				const utcDate = date.toLocaleString(undefined, { timeZoneName: 'short' })
				
				return utcDate
			}
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
						<Container fluid className="pt-0 p-5 mt-5">
							<div className="d-flex align-items-center heading-container">
								<Link to='/products'><ArrowLeft /></Link>
								<h1 className="cart-heading ms-1" >Orders</h1>
							</div>

							<div style={{ height: '24rem', overflowY: 'auto' }}>
								<DetailsTable data={orderItems} columns={columns} />
							</div>

							<Footer 
								className={'d-flex justify-content-between align-items-center pt-3'}
								text={`${orderItems.length} Total Count`}
								pageSize={8}
								url={'/api/data'}
								totalPages={totalPages}
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
							/>

						</Container>
						{show && <OffCanvasComp 
							placement={'end'} 
							show={show} 
							setShow={setShow} 
							orderItem={orderItem} 
							name={user.name} 
							token={user.token}/>}
					</>
				)}
		</>

	)
}

export default TotalOrders
