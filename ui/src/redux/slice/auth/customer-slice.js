import { createSlice } from '@reduxjs/toolkit'

const customer = {
	email: '',
	password: '',
	name: '',
	mobile: '',
	token: '',
}

export const customerSlice = createSlice({
	name: 'customer',
	initialState: customer,
	reducers: {
		login: (state, action) => {
			const cust = action.payload
			state.email = cust.email
			state.password = cust.password
			state.name = cust.name
			state.mobile = cust.mobile
			state.token = cust.token
		},
		logout:(state) => {
			Object.assign(state, customer)
			
		}
	}
})

export const { login, logout } = customerSlice.actions

export default customerSlice.reducer