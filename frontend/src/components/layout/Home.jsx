import React, { useEffect } from 'react'
import MetaData from './MetaData'
import { useGetProductsAllQuery } from '../../redux/api/productsApi.js'
import ProductItem from '../product/ProductItem';
import Loader from './Loader';
import toast from 'react-hot-toast';
const Home = () => {

     const {data, isLoading, error, isError} = useGetProductsAllQuery(); 

     useEffect(()=>{
        if(isError){
            toast.error(error?.data?.message);
        }
     },[isError])
  
     if(isLoading){
        return <Loader />
     }
    console.log(data?.products);
    return (
        
        <><MetaData title={'Trang chủ !'} />
            <div className="container">
            <div className="row">
                <div className="col-12 col-sm-6 col-md-12">
                    <h1 id="products_heading" className="text-secondary">Latest Products</h1>

                    <section id="products" className="mt-5">
                        <div className="row">
                            {data?.products?.map((product)=> ( 
                            <ProductItem product={product} col="3"/>
                            ))}                            
                        </div>

                        {/* neu de { (<ProductItem product={product} col="3"/>)} sẽ lỗ
                        neu dung se la { return (<ProductItem product={product} col="3"/>)}  */}
                    </section>
                </div>
            </div>
        </div>
        </>
    )
}

export default Home