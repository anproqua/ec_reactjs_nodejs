import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {setUser, setIsAuthenticated, setLoading} from '../features/userSlice'
export const userApi = createApi({
    // dispatch: Đây là một hàm được sử dụng để gửi các hành động đến cửa hàng Redux.
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    // để refetch lại user khi có  invalidatesTags , đặt tên gì cũng dc vd : User
    tagTypes:["User"],
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => `/me`,
            transformResponse: (result) => result.user,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setLoading(false));
                } catch (error) {
                    dispatch(setLoading(false));
                    console.log(error);
                }
            },
            providesTags:["User"],
        }),
        updateProfile: builder.mutation({
            query(body) {
                return {
                    url: "/me/update",
                    method: "PUT",
                    body
                }
            },
            invalidatesTags:["User"],
           
        }),
        uploadAvatar: builder.mutation({
            query(body) {
                return {
                    url: "/me/upload_avatar",
                    method: "PUT",
                    body
                }
            },
            invalidatesTags:["User"],
           
        }),
        updatePassword: builder.mutation({
            query(body) {
                return {
                    url: "/password/update",
                    method: "PUT",
                    body
                }
            },          
        }),

    }),
    //phai viet dung cu phap viết (params) => {"/products"} là sai
});
// useGetProductsAllQuery tu hệ thống tạo ra tên theo endpoints
export const { useGetMeQuery, useUpdateProfileMutation, useUploadAvatarMutation, useUpdatePasswordMutation } = userApi;