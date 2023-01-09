import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Meta from '../components/Meta';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

import { listProducts } from '../actions/productActions';

const CollectionsScreen = ({ match }) => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, match.params.collection));
    window.scrollTo(0, 0);
  }, [dispatch, keyword, pageNumber, match]);

  return (
    <>
      <Meta />

      <div>
        <Link to='/'>Store</Link>
        &nbsp; &nbsp;
        <span className='text-muted'>/</span>
        &nbsp; &nbsp;
        <span className='fw-bold text-capitalize text-muted'>
          {match.params.collection}
        </span>
      </div>

      <h4 className='text-center fw-bold text-uppercase'>
        {match.params.collection}
      </h4>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col
                sm={12}
                md={6}
                lg={4}
                xl={3}
                key={product._id}
                data-cy={`product-collection-${match.params.collection}`}
              >
                <Product product={product} redirect={match.url} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
            url={`/collections/${match.params.collection}`}
          />
        </>
      )}
    </>
  );
};

export default CollectionsScreen;
