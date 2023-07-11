import { configureStore } from '@reduxjs/toolkit'

// redux-slice
import cartReducer from '../slice/cart/cart-slice'
import customerReducer from '../slice/auth/customer-slice'

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		customer: customerReducer,
	},
})