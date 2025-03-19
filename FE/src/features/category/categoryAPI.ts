import { apiSlice } from '../../apis/apiSlice'

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategoryList: build.query({
      query: ({ pageNumber, pageSize, sort, name }) => ({
        url: '/category',
        method: 'GET',
        params: {
          pageNumber,
          pageSize,
          sort,
          name,
        },
      }),
      transformResponse: (res) => res,
      providesTags: ['category'],
    }),
    getCategoryDetail: build.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      transformResponse: (res) => res,
      providesTags: ['category'],
    }),
    updateCategory: build.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['category'],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['category'], // Invalidate the 'category' tag to refetch related data
    }),
    addCategory: build.mutation({
      query: (data) => ({
        url: '/category',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res) => res,
      invalidatesTags: ['category'], // Invalidate the 'category' tag to refetch the list
    }),
  }),
})

export const {
  useGetCategoryListQuery,
  useUpdateCategoryMutation,
  useGetCategoryDetailQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} = categoryApi
