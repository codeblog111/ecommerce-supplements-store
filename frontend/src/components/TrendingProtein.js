import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { listTrendingProtein } from '../actions/productActions';

const TrendingProtein = () => {
  const dispatch = useDispatch();
  const productTrendingProtein = useSelector(
    (state) => state.productTrendingProtein
  );
  const { loading, error, products } = productTrendingProtein;

  useEffect(() => {
    dispatch(listTrendingProtein());
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
                  data-cy='trending-protein'
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

export default TrendingProtein;
