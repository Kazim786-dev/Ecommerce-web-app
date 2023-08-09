import { createSlice } from '@reduxjs/toolkit'

const user = {
	email: '',
	password: '',
	name: '',
	mobile: '',
	token: '',
	rememberMe: false,
	role:'',
	isLoggedIn: false,
	lastLoginTime: null,
}

export const userSlice = createSlice({
	name: 'user',
	initialState: user,
	reducers: {
		login: (state, action) => {
			const user = action.payload
			state.email = user.email
			state.password = user.password
			state.name = user.name
			state.mobile = user.mobile
			state.token = user.token
			state.rememberMe = user.rememberMe
			state.role = user.role
			state.isLoggedIn = true

			// Update lastLoginTime with the current timestamp
			state.lastLoginTime = Date.now()
		},
		logout:(state) => {
			Object.assign(state, user)
		}
	}
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer