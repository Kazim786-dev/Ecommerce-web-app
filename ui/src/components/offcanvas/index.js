import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Container, Offcanvas, Row, Col, Image } from 'react-bootstrap'

//svg
import { ReactComponent as ArrowLeft } from '../../static/images/svg/Arrow left.svg'

//components
import DetailsTable from '../table'
import SpinnerComp from '../spinner'

const OffCanvasComp = ({
	placement,
	show,
	setShow,
	orderItem,
	user }) => {

	const [loading,setLoading] = useState(true)
	const [OrderProducts,setOrderProducts] = useState([])


	const date = new Date(orderItem.date);
	const utcDate = date.toLocaleString('en-US', { timeZone: 'UTC' });

	useEffect(()=>{
		fetchProducts()
	},[])

	const fetchProducts = async()=>{
		try{
			const products = orderItem.products
			if(products.length > 0){
				const response = await axios.post(
					`${process.env.REACT_APP_DEV_BACKEND_URL}/orders/order-products`, 
					{
						products
					},
					{
						headers: {
							Authorization: `Bearer ${user.token}`,
						},
					}
				)

				if(response.status===200){
					setOrderProducts(response.data)
					setLoading(false)
				}
			}
		}
		catch(error){
			setLoading(false)
		}
	}

	// // table column styling
	const columns = [
		{
			header: 'Title',
			width: '32rem',
			render: (item) => (
				<div className="row align-items-center pe-5">
					<div className="col-auto pe-0" >
						<Image src={item.image} alt="Product" className='table-product-img' />
					</div>
					<div className="col">
						<span>{item.description}</span>
					</div>
				</div>
			),
		},
		{
			header: 'Price',
			width: '17rem',
			render: (product) => (
				product.price
			),
		},
		{
			header: 'Quantity',
			width: '22rem',
			render: (product) => product.quantity,
		},
		{
			header: 'Stock',
			width: '15rem',
			render: (product) => product.quantity
		},
	]

	return (
		<>
			{loading ? (
				<SpinnerComp />
			) :
				(
					<Offcanvas show={show} onHide={() => setShow(false)} placement={placement} style={{ width: '80%' }}>
						<Offcanvas.Body>
							<Container fluid className="pt-0 p-3" >
								<div className="d-flex align-items-center heading-container">
									<ArrowLeft onClick={() => setShow(false)} style={{ cursor: 'pointer' }}/>
									<h3 className='ms-1'>Order Detail</h3>
								</div>
								<hr />
								<Row className="order-info-row pt-1 pb-2">
									<Col>
										<p className='text-styles'>Order Date:</p> {utcDate}
									</Col>
									<Col>
										<p className='text-styles'>Order #:</p> {orderItem.orderNumber}
									</Col>
									<Col>
										<p className='text-styles'>User:</p> {user.name}
									</Col>
									<Col>
										<p className='text-styles'>Products Count:</p> {orderItem.products.length}
									</Col>
									<Col>
										<p className='text-styles'>Amount:</p> {'$'+orderItem.totalAmount.toFixed(2)}
									</Col>
								</Row>
								<hr />
								<div className="d-flex align-items-center heading-container">
									<h4>Product Information</h4>
								</div>

								<DetailsTable data={OrderProducts} columns={columns} />

							</Container>
						</Offcanvas.Body>
					</Offcanvas>
				)
			}
		</>
	)
}

export default OffCanvasComp