import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SummaryElement from './summary-element'

const OrderSummary = ({ user, setErrorText }) => {

	const [orderSummary, setOrderSummary] = useState({
		totalAmount: 0,
		totalOrders: 0,
		totalUnits: 0
	})

	useEffect(() => {
		const fetchSummary = async () => {
			const data = await fetchOrderSummary()
			setOrderSummary(data)
		}

		fetchSummary()
	}, [])

	const fetchOrderSummary = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_DEV_BACKEND_URL}/orders/summary`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			)
			const data = response.data
			return data

		} catch (error) {
			setErrorText('Error fetching order summary')
			console.error('Error fetching order summary:', error)
		}
		return {
			totalAmount: 0,
			totalOrders: 0,
			totalUnits: 0
		}
	}

	return (
		<div className='mb-4 d-flex justify-content-between'>
			<SummaryElement 
				title={'Total Orders:'} 
				count={orderSummary.totalOrders}
				className={'px-4 py-3 mr-1 bg-white order-summary-element'}
			/>
			<SummaryElement 
				title={'Total Units:'} 
				count={orderSummary.totalUnits} 
				className={'px-4 py-3 mr-1 bg-white order-summary-element'}
			/>
			<SummaryElement 
				title={'Total Amount:'} 
				count={`$${orderSummary.totalAmount}`} 
				className={'px-4 py-3 bg-white order-summary-element'}
			/>
		</div>
	)
}

export default OrderSummary
