import { apiSlice } from '../../apis/apiSlice'

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['orders'],
    }),
    getOrderById: build.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['orders'],
    }),
    addOrder: build.mutation({
      query: ({ account, products }) => ({
        url: '/orders',
        method: 'POST',
        body: { account, products },
      }),
      invalidatesTags: ['orders'],
    }),
    updateOrder: build.mutation({
      query: ({ id, status, products }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: { status, products },
      }),
      invalidatesTags: ['orders'],
    }),
    deleteOrder: build.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useAddOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi
