import { createSlice } from '@reduxjs/toolkit'

const cart = {
	products: [
	],
}


export const cartSlice = createSlice({
	name: 'cart',
	initialState: cart,
	reducers: {
		add: (state, action) => {
			const newProduct = action.payload
			newProduct.quantity=1
			state.products.push(newProduct)
		},
		remove: (state, action) => {
			const productID = action.payload
			const index = state.products.findIndex(
				(product) => product.id === productID
			)
			if (index !== -1) {
				state.products.splice(index, 1)
			}
		},
		increase: (state, action) => {
			const productID = action.payload
			const product = state.products.find((product) => product.id === productID)
			if (product) {
				product.quantity += 1
			}
		},
		decrease: (state, action) => {
			const productID = action.payload
			const product = state.products.find((product) => product.id === productID)
			if (product && product.quantity > 1) {
				product.quantity -= 1
			}
		}
	}
})

// Action creators are generated for each case reducer function
export const { add, remove, increase, decrease } = cartSlice.actions

export default cartSlice.reducer