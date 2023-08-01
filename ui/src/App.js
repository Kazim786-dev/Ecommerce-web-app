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

	const user = useSelector((state)=> state.user)
	
	return (
		<div className="App">
			<RouterLinks user={user} ></RouterLinks>
		</div>
	)
}

export default App
