import React from 'react'
import { Container, Offcanvas, Row, Col, Image } from 'react-bootstrap'

//svg
import { ReactComponent as ArrowLeft } from '../../static/images/svg/Arrow left.svg'

//components
import DetailsTable from '../table'

const OffCanvasComp = ({
	placement,
	show,
	setShow,
	orderItem,
	userName }) => {

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
							<p className='text-styles'>Order Date:</p> {orderItem.Date}
						</Col>
						<Col>
							<p className='text-styles'>Order #:</p> {orderItem.OrderNo}
						</Col>
						<Col>
							<p className='text-styles'>User:</p> {userName}
						</Col>
						<Col>
							<p className='text-styles'>Products Count:</p> {orderItem.products.length}
						</Col>
						<Col>
							<p className='text-styles'>Amount:</p> {'$'+orderItem.Amount.toFixed(2)}
						</Col>
					</Row>
					<hr />
					<div className="d-flex align-items-center heading-container">
						<h4>Product Information</h4>
					</div>

					<DetailsTable data={orderItem.products} columns={columns} />

				</Container>
			</Offcanvas.Body>
		</Offcanvas>

	)
}

export default OffCanvasComp