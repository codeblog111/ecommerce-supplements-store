import React from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Nav,
  Image,
} from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className='bg-light my-4 text-dark'>
      <Container className='text-center py-4'>
        <Row>
          <Col xs={12} md={3} className='py-2'>
            <h5 className='fw-bold'>
              Get The Latest News Sent Right To Your Inbox
            </h5>
            <br />
            <InputGroup className='mb-3'>
              <InputGroup.Text id='basic-addon1'>
                <i className='far fa-envelope'></i>
              </InputGroup.Text>
              <FormControl
                placeholder='Email'
                aria-label='Email'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Col>
          <Col xs={6} md={3} className='py-2'>
            <h6
              className='text-start fw-bold'
              style={{ padding: '0.0rem 1rem' }}
            >
              Need Help
            </h6>
            <Nav defaultActiveKey='/' className='flex-column text-start'>
              <Nav.Link href='/' style={{ padding: '0.25rem 1rem' }}>
                Help Center
              </Nav.Link>
              <Nav.Link eventKey='link-1' style={{ padding: '0.25rem 1rem' }}>
                Email Support
              </Nav.Link>
              <Nav.Link eventKey='link-4' style={{ padding: '0.25rem 1rem' }}>
                Send us Feedback
              </Nav.Link>
            </Nav>
          </Col>
          <Col xs={6} md={3} className='py-2'>
            <h6
              className='text-start fw-bold'
              style={{ padding: '0.0rem 1rem' }}
            >
              Orders & Shipping
            </h6>
            <Nav defaultActiveKey='/' className='flex-column text-start'>
              <Nav.Link href='/profile' style={{ padding: '0.25rem 1rem' }}>
                Order Status
              </Nav.Link>
              <Nav.Link eventKey='link-1' style={{ padding: '0.25rem 1rem' }}>
                Return/Exchanges
              </Nav.Link>
              <Nav.Link eventKey='link-2' style={{ padding: '0.25rem 1rem' }}>
                Shipping Support
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={3} className='py-2'>
            <h5 className='fw-bold'>Choose Shop Location</h5>
            <Image
              src='images/flags/us.png'
              height='20'
              alt='United States'
              className='mx-1'
            />
            <Image
              src='images/flags/ca.png'
              height='20'
              alt='Canada'
              className='mx-1'
            />
            <Image
              src='images/flags/au.png'
              height='20'
              alt='Australia'
              className='mx-1'
            />
          </Col>
        </Row>
        <Row className='py-3'>
          <Col>
            <h6 className='fw-bold'>We Accept</h6>
            <Image
              src='images/cards/Visa.bb1ce184.svg'
              height='30'
              width='47'
              alt='Visa'
              className='mx-1'
            />
            <Image
              src='images/cards/AmericanExpress.061b2277.svg'
              height='30'
              width='47'
              alt='American Express'
              className='mx-1'
            />
            <Image
              src='images/cards/Mastercard.65fc81f2.svg'
              height='30'
              width='47'
              alt='Mastercard'
              className='mx-1'
            />
            <Image
              src='images/cards/Discover.cbf6c6e1.svg'
              height='30'
              width='47'
              alt='Discover'
              className='mx-1'
            />
            <Image
              src='images/cards/Paypal.eae00b48.svg'
              height='30'
              width='47'
              alt='PayPal'
              className='mx-1'
            />
          </Col>
        </Row>
        <Row>
          <Col className='text-muted text-start'>
            <span>
              Copyright &copy; PHANOX 2023. All rights reserved.
            </span>
            <br />
            <p style={{ fontSize: '14px' }} className='py-2'>
              Always consult with a qualified healthcare professional prior to
              beginning any diet or exercise program or taking any dietary
              supplement. The content on our website is for informational and
              educational purposes only and is not intended as medical advice or
              to replace a relationship with a qualified healthcare
              professional.
            </p>
            <p style={{ fontSize: '14px' }}>
              0000 W State St #000, Boise, ID 000000 USA 0-000-000-0000
            </p>
            <p style={{ fontSize: '14px' }} className='text-warning fw-bold'>
              Not a real website, it's just a moke up ecommerce website. Do not
              enter any personal information or credit card information in this
              site!! More information: &nbsp;
              <a
                href='https://www.memoryinject.io'
                target='_blank'
                rel='noreferrer'
              >
                memoryinject.io
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
