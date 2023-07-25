import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

// redux-slice
import cartReducer from '../slice/cart/cart-slice'
import customerReducer from '../slice/auth/customer-slice'


const persistConfig = {
	key: 'root',
	storage,
}

const rootReducer = combineReducers({
	cart: cartReducer,
	customer: customerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: [thunk],
})

export const persistor = persistStore(store)