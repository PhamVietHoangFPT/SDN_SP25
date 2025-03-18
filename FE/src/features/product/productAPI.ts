import { apiSlice } from '../../apis/apiSlice'

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProductList: build.query({
      query: ({ pageNumber, pageSize, sort, name }) => ({
        url: '/products',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          sort,
          name,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
    getProductDetail: build.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
  }),
})

export const { useGetProductListQuery, useGetProductDetailQuery } = productsApi
