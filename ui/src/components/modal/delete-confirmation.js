/* eslint-disable react/prop-types */
import {React} from 'react'

//react-bootstrap
import {Modal, Button, Container } from 'react-bootstrap'

//svg
import { ReactComponent as Exclamation } from '../../static/images/svg/Exclamation triangle.svg'

const DeleteConfirmationModal = ({showDeleteModal, setShowDeleteModal, handleDeleteConfirmation})=> {

	return(
		<Modal show={showDeleteModal} centered onHide={() => setShowDeleteModal(false)}>

			<Modal.Body className='m-4'>
				<Container className='d-flex flex-column align-items-center '>
					<h4 className='text-primary'>Remove Product</h4>
					<Exclamation></Exclamation>
				</Container>

				<Container style={{ width: '53%', marginTop: '7%' }} className='d-flex justify-content-center text-center'>
					<p><b>Are You Sure You Want To Delete The Item!</b></p>
				</Container>
				<Container className='mt-4 d-flex justify-content-evenly w-75'>
					<Button style={{ width: '6.75rem' }} variant="outline-primary" onClick={() => setShowDeleteModal(false)}>
                            No
					</Button>
					<Button style={{ width: '6.75rem' }} variant="primary" onClick={handleDeleteConfirmation}>
                            Yes
					</Button>
				</Container>
			</Modal.Body>
		</Modal>
	)
}

export default DeleteConfirmationModal