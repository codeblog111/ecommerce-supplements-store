import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { listLatestProducts } from '../actions/productActions';

const LatestProducts = () => {
  const dispatch = useDispatch();
  const productLatest = useSelector((state) => state.productLatest);
  const { loading, error, products } = productLatest;

  useEffect(() => {
    dispatch(listLatestProducts());
  }, [dispatch]);

  return (
    <>
      {loading && !products ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products &&
              products.map((product) => (
                <Col
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  key={product._id}
                  data-cy='latest-products'
                >
                  <Product product={product} />
                </Col>
              ))}
          </Row>
        </>
      )}
    </>
  );
};

export default LatestProducts;
