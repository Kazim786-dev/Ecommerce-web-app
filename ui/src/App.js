import React from 'react'
// styles
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import './static/css/styles.css'
//Routes
import RouterLinks from './route/routing'

//redux
import { useSelector } from 'react-redux'

const App = () => {

	// const userName = 'Johnson Charles'

	const customer = useSelector((state)=> state.customer)
	
	return (
		<div className="App">
			<RouterLinks user={customer} ></RouterLinks>
		</div>
	)
}

export default App
