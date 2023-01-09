import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { listTrendingBcaa } from '../actions/productActions';

const TrendingBcaa = () => {
  const dispatch = useDispatch();
  const productTrendingBcaa = useSelector((state) => state.productTrendingBcaa);
  const { loading, error, products } = productTrendingBcaa;

  useEffect(() => {
    dispatch(listTrendingBcaa());
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
                  data-cy='trending-bcaa'
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

export default TrendingBcaa;
