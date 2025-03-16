import { apiSlice } from '../../apis/apiSlice'

export const articleApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Xem danh sách articles
    getArticles: build.query({
      query: (params) => ({
        url: '/articles',
        method: 'GET',
        params,
      }),
      transformErrorResponse: (res) => res,
      providesTags: ['Articles'],
    }),

    // Xem chi tiết article theo ID
    getArticleById: build.query({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
    }),

    // Thêm article mới
    addArticle: build.mutation({
      query: (article) => ({
        url: '/articles',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: ['Articles'],
    }),

    // Cập nhật article
    updateArticle: build.mutation({
      query: ({ id, ...article }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Articles', id }],
    }),

    // Xóa article
    deleteArticle: build.mutation({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi
