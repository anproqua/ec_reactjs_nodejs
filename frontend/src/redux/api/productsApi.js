import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const productApi = createApi({

    reducerPath:"productApi",
    baseQuery: fetchBaseQuery({baseUrl:"api/v1"}),
    endpoints: (builder) => ({
        getProductsAll: builder.query({
            query:(params) => "/products",
        }),
        getProductDetails: builder.query({
            query:(id) => `/products/${id}`,
        }),
    }),
    //phai viet dung cu phap viết (params) => {"/products"} là sai
});
// useGetProductsAllQuery tu hệ thống tạo ra tên theo endpoints
export const {useGetProductsAllQuery, useGetProductDetailsQuery} = productApi;