import React, { useEffect } from 'react';
import { Col, Row, ListGroup } from 'react-bootstrap';
import Meta from '../components/Meta';

const AuthencityScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Meta title='H2Cart Authenticity'/>
      <Row className='text-center py-2'>
        <Col className='px-0'>
          <div
            className='bg-primary'
            style={{
              height: '2px',
              width: '100%',
              position: 'relative',
              top: '50%',
            }}
          ></div>
        </Col>
        <Col className='px-0 text-primary' md={6} xs={9}>
          <div style={{ border: 'solid 2px' }}>
            <h4
              className='fw-bold'
              style={{ position: 'relative', top: '4px' }}
            >
              AUTHENTICITY MATTERS
            </h4>
          </div>
        </Col>
        <Col className='px-0'>
          <div
            className='bg-primary'
            style={{
              height: '2px',
              width: '100%',
              position: 'relative',
              top: '50%',
            }}
          ></div>
        </Col>
      </Row>
      <Row>
        <Col className='p-4'>
          <h5>
            H2Cart's shield of trust is our guarantee that the products
            sold on the site are 100% Authentic and only sourced directly from
            brands or their authorized distributors.
          </h5>
        </Col>
      </Row>
      <Row className='text-center py-2'>
        <Col className='px-0'>
          <div
            className='bg-primary'
            style={{
              height: '2px',
              width: '100%',
              position: 'relative',
              top: '50%',
            }}
          ></div>
        </Col>
        <Col className='px-0 text-primary' md={6} xs={9}>
          <div>
            <h4
              className='fw-bold'
              style={{ position: 'relative', top: '4px' }}
            >
              AUTHENTICITY CHECKLIST
            </h4>
          </div>
        </Col>
        <Col className='px-0'>
          <div
            className='bg-primary'
            style={{
              height: '2px',
              width: '100%',
              position: 'relative',
              top: '50%',
            }}
          ></div>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col lg={9} md={12} xs={12}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              Products delivered from H2Cart warehouse directly to the
              consumers.
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              Stock procured at H2Cart directly from brands & authorised
              importers.
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              H2Cart certified as authorised retailer by all major brands
              and importers.
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              Imported Products have an Importer Sticker or the Importer details
              printed in the label.
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              Products have a valid Expiry Date and Batch Number printed.
            </ListGroup.Item>
            <ListGroup.Item>
              <i className='fas fa-check text-success px-2'></i>
              Tax Paid Retail Invoice provided with all orders.
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col></Col>
      </Row>
    </>
  );
};

export default AuthencityScreen;
