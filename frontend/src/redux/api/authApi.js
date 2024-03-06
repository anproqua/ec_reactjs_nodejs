import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {userApi} from './userApi'
export const authApi = createApi({

    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query(body) {
                return {
                    url: "/login",
                    method: "POST",
                    body
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        register: builder.mutation({
            query(body) {
                return {
                    url: "/register",
                    method: "POST",
                    body
                }
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.log(error);
                }
            },
        }),
        logout: builder.query({
            query:() => `/logout`,
        }),
    }),
    // xai onQueryStarted neu muon lay thong tin user sau khi login hoac dang ky
    // xai mutation vi theo phuong thuc post, post data trong body
    //phai viet dung cu phap viết (params) => {"/products"} là sai
});
// useGetProductsAllQuery tu hệ thống tạo ra tên theo endpoints
export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery} = authApi;