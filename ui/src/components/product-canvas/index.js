import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Container, Offcanvas, Row, Col } from 'react-bootstrap';

import AlertComp from '../alert';
import ImageUpload from '../image-upload';
import ProductForm from '../product-form';
import SpinnerComp from '../spinner'

//svg
import { ReactComponent as ArrowLeft } from '../../static/images/svg/Arrow left.svg'

const ProductCanvas = ({
    placement,
    show,
    setShow,
    product,
    handleShouldFetchAgain,
    token }) => {

    const [loading, setLoading] = useState(false)
    const [Errortext, setErrorText] = useState('')

    const [formData, setFormData] = useState({
        price: product?.price,
        quantity: product?.quantity,
        description: product?.description,
        image: product?.image,
    });

    // useEffect(() => {
    //     if (product != null) {
    //         fetchProduct()
    //     }
    // }, [])

    // const fetchProduct = async () => {
    //     setLoading(true)
    //     setErrorText('')

    //     try {
    //         const response = await axios.get(
    //             `${process.env.REACT_APP_DEV_BACKEND_URL}/products/${product._id}`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         )
    //         if (response.status === 200) {
    //             const { price, description, quantity, image } = response.data
    //             setFormData(
    //                 {
    //                     price: price,
    //                     quantity: quantity,
    //                     description: description,
    //                     image: image
    //                 })
    //         }
    //         setLoading(false)
    //     } catch (error) {
    //         setErrorText(error.response.data)
    //         setLoading(false)
    //     }
    // }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'image' ? files[0] : value,
        }));
    };


    const handleAddProduct = async (e) => {
        e.preventDefault();

        if(formData.quantity<1 || formData.price<1){
            setErrorText('Quantity and price can\'t be less than 1')
            return
        }

        setLoading(true)
        setErrorText('')
        
        const Form = new FormData();
        Form.append('description', formData.description);
        Form.append('price', formData.price);
        Form.append('quantity', formData.quantity);
        if (formData.image) {
            Form.append('image', formData.image);
        }


        try {
            const response = await axios.post(
                `${process.env.REACT_APP_DEV_BACKEND_URL}/products`,
                Form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            if (response.status === 201) {
                handleShouldFetchAgain()
                setShow(false)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            if (error.response?.status && error.response.status === 401) {
                setErrorText('Unauthorized. Try login again');
            }
            else{
                setErrorText('Error occured while creating the product.')
            }
            console.error(error);
            setLoading(false);
        }
    }

    const handleEditProduct = async(e) => {
        e.preventDefault();

        if(formData.quantity<1 || formData.price<1){
            setErrorText('Quantity and price can\'t be less than 1')
            return
        }

        setLoading(true)
        setErrorText('')
        
        const Form = new FormData();
        Form.append('description', formData.description);
        Form.append('price', formData.price);
        Form.append('quantity', formData.quantity);
        if (formData.image) {
            Form.append('image', formData.image);
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_DEV_BACKEND_URL}/products/${product._id}`,
                Form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            if (response.status === 200) {
                handleShouldFetchAgain()
                setShow(false)
            }
            setLoading(false)
        } catch (error) {
            if (error.response.status === 401) {
                handleShouldFetchAgain()
                setErrorText('Unauthorized. Try login again');
            }
            else
                setErrorText('Error occured while updating the product.');
            console.error(error);
            setLoading(false);
        }
    }


    return (

        <Offcanvas show={show} onHide={() => setShow(false)} placement={placement} style={{ width: '50%' }}>
            <Offcanvas.Body>
                {loading ? (
                    <SpinnerComp />
                ) : (
                    <>
                        <Container>
                            <div className='d-flex align-items-center heading-container'>
                                <ArrowLeft onClick={() => setShow(false)} style={{ cursor: 'pointer' }} />
                                {product ? (
                                    <h3 className='ms-1'>Edit Product</h3>
                                ) : (
                                    <h3 className='ms-1'>Add Product</h3>
                                )
                                }
                            </div>
                            <hr />
                            {/* form to add/edit product */}
                            <Row>
                                <Col md={4}>
                                    <ImageUpload handleChange={handleChange} product={product}/>
                                </Col>
                                <Col md={8}>
                                    <ProductForm product={product} formData={formData} handleChange={handleChange} 
                                        handleSubmit={product ? handleEditProduct : handleAddProduct} />
                                </Col>
                            </Row>
                        </Container>
                        {Errortext != '' && (
                            <AlertComp
                                variant='danger'
                                text={Errortext}
                                onClose={() => setErrorText('')}
                            />
                        )}
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>

    )
}

export default ProductCanvas