import React, { useEffect } from 'react'
import MetaData from './MetaData'
import { useGetProductsAllQuery } from '../../redux/api/productsApi.js'
import ProductItem from '../product/ProductItem';
import Loader from './Loader';
import toast from 'react-hot-toast';
import CustomPagination from './CustomPagination.js';
import {useSearchParams} from "react-router-dom";
import Filters from './Filters.jsx';
const Home = () => {

    // luong di cua phan trang: phan trang 
    //-> lay tham so tren url -> truyen tham so vao API (viet theo readuce tookit)

    let [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const keyword = searchParams.get("keyword") || "";

    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const category = searchParams.get("category");
    const ratings = searchParams.get("ratings");

    const params = {page,keyword};
    min !== null && (params.min = min);
    max !== null && (params.max = max);
    category !== null && (params.category = category);
    ratings !== null && (params.ratings = ratings);
     const {data, isLoading, error, isError} = useGetProductsAllQuery(params); 

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
                    {keyword && (
                <div className="col-6 col-md-3 mt-5">
                    <Filters />
                </div>
                )}
                <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
                    <h1 id="products_heading" className="text-secondary">
                        {keyword ? `${data?.products?.length} products found with keyword: ${keyword}` : "Latest Products"}
                    </h1>

                    <section id="products" className="mt-5">
                        <div className="row">
                            {data?.products?.map((product)=> ( 
                            <ProductItem product={product}/>
                            ))}                            
                        </div>

                        {/* neu de { (<ProductItem product={product} col="3"/>)} sẽ lỗ
                        neu dung se la { return (<ProductItem product={product} col="3"/>)}  */}
                    </section>

                    <CustomPagination resPerPage={data?.resPerPage} filteredProductsCount={data?.filteredProductsCount} />
                </div>
            </div>
        </div>
        </>
    )
}

export default Home