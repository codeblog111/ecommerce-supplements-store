import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );
    history.push('/payment');
  };

  return (
    <FormContainer>
      <Meta title='PHANOX Shipping'/>
      <CheckoutSteps step1 step2 />
      <h4 className='mb-3'>SHIPPING ADDRESSS</h4>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='mb-3'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            data-cy='form-address'
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='city' className='mb-3'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            data-cy='form-city'
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='postalCode' className='mb-3'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Postal Code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            data-cy='form-postal-code'
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='country' className='mb-3'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            data-cy='form-country'
          ></Form.Control>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='m-auto'
          data-cy='btn-continue'
        >
          Countinue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
