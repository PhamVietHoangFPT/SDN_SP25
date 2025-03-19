import { apiSlice } from '../../apis/apiSlice'

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProductListCustomer: build.query({
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
    getProductList: build.query({
      query: ({ pageNumber, pageSize, sort, name }) => ({
        url: '/manage/products',
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
    getProductDetailCustomer: build.query({
      query: (id) => ({
        url: `products/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
    getProductDetail: build.query({
      query: (id) => ({
        url: `/manage/products/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['products'],
    }),
    addProduct: build.mutation({
      query: (product) => ({
        url: '/manage/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['products'],
    }),
    updateProduct: build.mutation({
      query: ({ id, ...product }) => ({
        url: `/manage/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['products'],
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/manage/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
  }),
})

export const {
  useGetProductListQuery,
  useGetProductDetailQuery,
  useGetProductDetailCustomerQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useGetProductListCustomerQuery,
} = productsApi
