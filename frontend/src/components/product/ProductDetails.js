import React, { Fragment, useState, useEffect } from 'react'
//import { Carousel } from 'react-bootstrap'

import MetaData from '../layout/MetaData'
import { useGetProductDetailsQuery } from '../../redux/api/productsApi';
import { useParams } from 'react-router-dom';

import toast from 'react-hot-toast';
import Loader from '../layout/Loader';
import StarRatings from 'react-star-ratings';

const ProductDetails = () => {

    const params = useParams();
    console.log("params?.id:"+ params?.id);
    const { data, isLoading, error, isError } = useGetProductDetailsQuery(params?.id);
    const product = data?.product;
    console.log(product);
    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message);
        }
    }, [isError])

    const [activeImg, setActiveImg] = useState('');
    useEffect(() => {
        setActiveImg(product?.images[0] ? product?.images[0]?.url : '/images/default_product.png')
    }, [product])

    if (isLoading) {
        return <Loader />
    }
    return (
        <div class="row d-flex justify-content-around">
            <div class="col-12 col-lg-5 img-fluid" id="product_image">
                <div class="p-3">
                    <img
                        class="d-block w-100"
                        src={activeImg}
                        alt={product?.name}
                        width="340"
                        height="390"
                    />
                </div>
                <div class="row justify-content-start mt-5">
                    {product?.images?.map((img) => (
                        <div class="col-2 ms-4 mt-2">
                            <a role="button">
                                <img
                                    class={`d-block border rounded p-3 cursor-pointer 
                                    ${img?.url == activeImg} ? "border-warning" : ""`}
                                    height="100"
                                    width="100"
                                    src={img?.url}
                                    alt={img?.url}
                                    onClick={(e) => setActiveImg(img?.url)}
                                />
                            </a>
                        </div>
                    ))}

                </div>
            </div>

            <div class="col-12 col-lg-5 mt-5">
                <h3>{product?.name}</h3>
                <p id="product_id">Product # {product?.id}</p>

                <hr />

                <div class="d-flex">
                    <StarRatings
                        rating={product?.ratings == null ? 0 : product?.ratings}
                        starRatedColor="#ffb829"
                        numberOfStars={5}
                        name='rating'
                        starSpacing='1px'
                        starDimension='22px'
                    />
                    <span id="no-of-reviews" class="pt-1 ps-2"> ({product?.numOfReviews} Reviews) </span>
                </div>
                <hr />

                <p id="product_price">${product?.price}</p>
                <div class="stockCounter d-inline">
                    <span class="btn btn-danger minus">-</span>
                    <input
                        type="number"
                        class="form-control count d-inline"
                        value="1"
                        readonly
                    />
                    <span class="btn btn-primary plus">+</span>
                </div>
                <button
                    type="button"
                    id="cart_btn"
                    class="btn btn-primary d-inline ms-4"
                    disabled=""
                >
                    Add to Cart
                </button>

                <hr />

                <p>
                    Status: <span id="stock_status" className={product?.stock > 0 ? "greenColor" : "redColor"}>
                        {product?.stock > 0 ? "in stock" : "out stock"}</span>
                </p>

                <hr />

                <h4 class="mt-2">Description:</h4>
                <p>
                    {product?.description}
                </p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

                <div class="alert alert-danger my-5" type="alert">
                    Login to post your review.
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
