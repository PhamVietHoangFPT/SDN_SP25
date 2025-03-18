import { apiSlice } from '../../apis/apiSlice'

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query({
      query: () => ({
        url: '/cart',
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['cart'],
    }),
    addToCart: build.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['cart'],
    }),
    updateCart: build.mutation({
      query: ({ productId, quantity }) => ({
        url: '/cart/update',
        method: 'PUT',
        body: { productId, quantity },
      }),
      invalidatesTags: ['cart'],
    }),
    removeFromCart: build.mutation({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['cart'],
    }),
    clearCart: build.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi
