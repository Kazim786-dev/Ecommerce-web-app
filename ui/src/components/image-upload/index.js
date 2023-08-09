import React from 'react'
import { Badge, Button, Image } from 'react-bootstrap'

import { ReactComponent as ArrowUp } from '../../static/images/svg/Arrow bar up.svg'
import { ReactComponent as Edit } from '../../static/images/svg/Pencil square.svg'

const handleUploadImage = () => {
	// Trigger the file selection dialog when the button is clicked
	const fileInput = document.getElementById('fileInput')
	fileInput.click()
}

const ImageUpload = ({ handleChange, product }) => {
	return (
		<div className='border rounded'>
			<input id='fileInput' type="file" className='d-none' name="image" accept="image/*" onChange={handleChange} />
			{!product ? (
				<>
					<div className='d-flex justify-content-center'>
						<ArrowUp className='mt-4' />
					</div>
					<div className='d-block d-flex justify-content-center'>
						<Button onClick={handleUploadImage} className='mt-5 mb-3 w-75' variant='primary' type='file'>
                            Upload
						</Button>
					</div>
				</>
			) : (
				<div style={{ position: 'relative' }}>
					<Image src={product.image} alt='Product' className='w-100' style={{ height: '179px'}} />
					<Badge className='position-absolute bottom-0 start-0 rounded-circle'>
						<Edit onClick={handleUploadImage} stroke="white"/>
					</Badge>
				</div>
                
			)}
		</div>
	)
}

export default ImageUpload