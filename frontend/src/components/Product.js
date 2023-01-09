import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Rating from './Rating';

const Product = ({ product, redirect }) => {
  const link = redirect
    ? `/products/${product._id}?redirect=${redirect}`
    : `/products/${product._id}`;

  return (
    <Card className='my-3 p-3 rounded' style={{ width: '16rem' }}>
      <Link to={link}>
        <Card.Img src={product.image} />
      </Link>

      <Card.Body>
        <Link
          to={link}
          style={{ textDecoration: 'none' }}
        >
          <Card.Title>
            <h5 className='fs-bold' data-cy='product-name'>{product.name}</h5>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h5' className='product-price'>
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
