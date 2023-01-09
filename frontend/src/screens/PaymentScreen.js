import React, { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const PaymentScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <Meta title='PHANOX Payment'/>
      <CheckoutSteps step1 step2 step3 />
      <h4 className='mb-3'>PAYMENT METHOD</h4>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label>
            <span className='select-method'>Select Method</span>
          </Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='paypal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          className='my-3'
          data-cy='btn-continue'
        >
          Countinue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
