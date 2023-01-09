import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import LatestProducts from '../components/LatestProducts';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import TrendingProtein from '../components/TrendingProtein';
import TrendingBcaa from '../components/TrendingBcaa';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    //window.scrollTo(0, 0)
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword && match.url === '/' ? (
        <>
          <ProductCarousel />
          <Row className='p-2 my-3'>
            <Col>
              <Row xs='auto'>
                <Col>
                  <h5
                    className='fw-bold'
                    style={{ position: 'relative', top: '7px' }}
                  >
                    <i className='fas fa-bolt'></i>
                    &nbsp; LATEST PRODUCTS
                  </h5>
                </Col>
                <Col>
                  <Link
                    to='/products'
                    className='btn btn-success'
                    data-cy='view-all'
                  >
                    View All
                  </Link>
                </Col>
              </Row>
              <LatestProducts />
            </Col>
          </Row>
          <Row className='bg-light p-4 text-dark'>
            <Col className='text-center'>
              <h4>Authenticity Information When Buying Your Supplements</h4>
              <LinkContainer to='/authenticity'>
                <Button variant='outline-warning' className='fw-bold'>
                  BUY AUTHENTIC &nbsp;
                  <i
                    className='fas fa-caret-right'
                    style={{
                      position: 'relative',
                      top: '2px',
                      fontSize: '20px',
                    }}
                  ></i>
                </Button>
              </LinkContainer>
            </Col>
          </Row>

          <Row className='p-2 my-3'>
            <Col>
              <Row xs='auto'>
                <Col>
                  <h5 className='fw-bold'>
                    <i className='fas fa-poll'></i>
                    &nbsp; TRENDING IN PROTEIN{' '}
                  </h5>
                </Col>
              </Row>
              <TrendingProtein />
            </Col>
          </Row>

          <Row className='p-2 my-3'>
            <Col>
              <Row xs='auto'>
                <Col>
                  <h5 className='fw-bold'>
                    <i className='fas fa-poll'></i>
                    &nbsp; TRENDING IN AMINOS/BCAA
                  </h5>
                </Col>
              </Row>
              <TrendingBcaa />
            </Col>
          </Row>
        </>
      ) : (
        (keyword || match.url !== '/') && (
          <>
            <Link to='/' className='btn btn-dark' data-cy='back-btn'>
              GO BACK
            </Link>

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
                      data-cy='product-all'
                    >
                      <Product product={product} redirect={match.url} />
                    </Col>
                  ))}
                </Row>
                <Paginate
                  pages={pages}
                  page={page}
                  keyword={keyword ? keyword : ''}
                />
              </>
            )}
          </>
        )
      )}
    </>
  );
};

export default HomeScreen;
