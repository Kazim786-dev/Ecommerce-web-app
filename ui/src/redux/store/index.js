import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
// import sessionStorage from 'redux-persist/es/storage/session'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

// redux-slice
import cartReducer from '../slice/cart/cart-slice'
import usererReducer from '../slice/auth/user-slice'

import { logout } from '../slice/auth/user-slice'

// const isRememberedMeClicked = () => {
// 	const persistedData = localStorage.getItem('persist:root')
// 	if (persistedData) {
// 		const parsedData = JSON.parse(persistedData)
// 		if (parsedData && parsedData.user) {
// 			const user = JSON.parse(parsedData.user)
// 			return user.rememberMe == 'on' ? true : false
// 		}
// 	}
// 	return false // Return null if data not found or not valid
// }


// Middleware to check the last login time and dispatch the logout action if needed
const expirationMiddleware = (store) => (next) => (action) => {
	// Get the current timestamp
	const currentTime = Date.now()

	// Get the last login time from the state
	const lastLoginTime = store.getState().user.lastLoginTime
	if (lastLoginTime && currentTime - lastLoginTime >= 3 * 60 * 60 * 1000) {
		store.dispatch(logout())
	}
	// Call the next middleware in the chain
	return next(action)
}


const persistConfig = {
	key: 'root',
	storage: storage,
}

const rootReducer = combineReducers({
	cart: cartReducer,
	user: usererReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: [thunk]
	// middleware: [thunk, expirationMiddleware],
})

export const persistor = persistStore(store)